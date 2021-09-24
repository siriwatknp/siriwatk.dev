import jscodeshift from "jscodeshift";

const j = jscodeshift.withParser("tsx");

export default function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function jssToStyled({
  jss,
  jsx,
  printOptions = {
    quote: "single",
    tabWidth: 2,
    trailingComma: true,
    objectCurlySpacing: true,
  },
}: {
  jss: string;
  jsx: string;
  printOptions?: Record<string, any>;
}) {
  if (jss.match(/const.*\=(?!>)/)) {
    jss = jss.replace(/const.*\=(?!>)/gm, "");
  }
  if (jss.match(/makeStyles\([\s\S]*\)/gm)) {
    jss = (jss.match(/makeStyles(\([\s\S]*\))/gm)[0] || "").replace(
      "makeStyles",
      ""
    );
  }
  const jssRoot = j(jss);
  const jsxRoot = j(jsx);

  const styles: Array<{ key: string; value: jscodeshift.ObjectExpression }> =
    [];
  let styleArgs; // for function like

  /**
   * find all classKeys
   */
  jssRoot
    .find(j.ExpressionStatement)
    .at(0)
    .forEach(({ node }) => {
      if (node.expression.type === "ObjectExpression") {
        node.expression.properties.forEach((prop) => {
          if (prop.type === "ObjectProperty") {
            if (
              prop.key.type === "Identifier" &&
              prop.value.type === "ObjectExpression"
            ) {
              styles.push({
                key: prop.key.name,
                value: prop.value,
              });
            }
          }
        });
      }

      if (node.expression.type === "ArrowFunctionExpression") {
        styleArgs = {};
        const themeParam = node.expression.params[0];

        if (node.expression.body.type === "ObjectExpression") {
          node.expression.body.properties.forEach((prop) => {
            if (prop.type === "ObjectProperty") {
              if (
                prop.key.type === "Identifier" &&
                prop.value.type === "ObjectExpression"
              ) {
                styleArgs[prop.key.name] = j.arrowFunctionExpression(
                  [],
                  j.objectExpression([]),
                  true
                );
                if (themeParam?.type === "Identifier") {
                  // (theme) =>
                  const obj = j.objectProperty(themeParam, themeParam);
                  obj.shorthand = true;
                  styleArgs[prop.key.name].params.push(j.objectPattern([obj]));
                }

                if (themeParam?.type === "ObjectPattern") {
                  // ({ palette, spacing }) =>
                  styleArgs[prop.key.name].params.push(
                    j.objectPattern([
                      j.objectProperty(j.identifier("theme"), themeParam),
                    ])
                  );
                }

                styles.push({
                  key: prop.key.name,
                  value: prop.value,
                });

                (
                  styleArgs[prop.key.name].body as jscodeshift.ObjectExpression
                ).properties = prop.value.properties;
              }
            }
          });
        }
      }
    });

  let styledResult = j.file(j.program([]));

  function createStyledComponent(
    styledName: string,
    tag: jscodeshift.Identifier | jscodeshift.StringLiteral,
    expression:
      | jscodeshift.ObjectExpression
      | jscodeshift.ArrowFunctionExpression
  ) {
    return j.variableDeclaration("const", [
      j.variableDeclarator(
        j.identifier(styledName),
        j.callExpression(j.callExpression(j.identifier("styled"), [tag]), [
          expression,
        ])
      ),
    ]);
  }

  function appendStyledComponent(
    node: jscodeshift.JSXElement,
    style: { key: string; value: jscodeshift.ObjectExpression },
    styleArgs:
      | undefined
      | Record<
          string,
          jscodeshift.ObjectExpression | jscodeshift.ArrowFunctionExpression
        >
  ) {
    const expression = styleArgs ? styleArgs[style.key] : style.value;
    if (node.openingElement.name.type === "JSXIdentifier") {
      const jsxName = node.openingElement.name.name;
      let styledName;
      if (jsxName && jsxName.match(/^[a-z]/)) {
        let tagName = jsxName;
        if (jsxName === "a") {
          tagName = "anchor";
        }
        // jsxName is html tag
        if (jsxName === style.key) {
          styledName = `Styled${capitalize(tagName)}`;
        } else {
          styledName = `${capitalize(tagName)}${capitalize(style.key)}`;
        }
        styledResult.program.body.push(
          createStyledComponent(
            styledName,
            j.stringLiteral(jsxName),
            expression
          )
        );
      }
      if (jsxName && jsxName.match(/^[A-Z]/)) {
        // React Component
        if (jsxName.toLowerCase() === style.key.toLowerCase()) {
          styledName = `Styled${jsxName}`;
        } else {
          styledName = `${jsxName}${capitalize(style.key)}`;
        }
        styledResult.program.body.push(
          createStyledComponent(styledName, j.identifier(jsxName), expression)
        );
      }
      if (styledName) {
        node.openingElement.name.name = styledName;
        if (
          node.closingElement &&
          node.closingElement.name.type === "JSXIdentifier"
        ) {
          node.closingElement.name.name = styledName;
        }
      }
    }
  }

  function isClassKey(member: jscodeshift.MemberExpression, classKey: string) {
    return (
      member.object.type === "Identifier" &&
      (member.object.name === "classes" || member.object.name === "styles") &&
      member.property.type === "Identifier" &&
      member.property.name === classKey
    );
  }

  /**
   * for each key, find jsx that has classes.$key then create styled component
   */
  styles.forEach((style) => {
    jsxRoot.find(j.JSXElement).forEach(({ node }) => {
      node.openingElement.attributes.forEach((attr, attrIndex) => {
        if (attr.type === "JSXAttribute" && attr.name.name === "className") {
          if (attr.value.type === "JSXExpressionContainer") {
            if (attr.value.expression.type === "MemberExpression") {
              const expression = attr.value.expression;
              if (isClassKey(expression, style.key)) {
                // className={classes[style.key]}
                appendStyledComponent(node, style, styleArgs);

                // delete `className` attribute
                delete node.openingElement.attributes[attrIndex];
              }
            }
            if (attr.value.expression.type === "CallExpression") {
              const expression = attr.value.expression;
              expression.arguments.forEach((arg, argIndex) => {
                if (
                  arg.type === "MemberExpression" &&
                  isClassKey(arg, style.key)
                ) {
                  // className={clsx('anything', classes[style.key])}
                  appendStyledComponent(node, style, styleArgs);

                  delete expression.arguments[argIndex];
                }
              });
            }
          }
        }
      });
    });
  });

  return {
    styledComponents: j(styledResult).toSource(printOptions),
    jsx: jsxRoot.toSource(printOptions),
  };
}
