import { useState, useRef } from "react";
import NextLink from "next/link";
import prettier from "prettier/standalone";
import prettierParserBabel from "prettier/parser-babel";
import Highlight, { defaultProps } from "prism-react-renderer";
import prismGithubTheme from "prism-react-renderer/themes/github";
import useClipboard from "react-use-clipboard";
import { styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import GlobalStyles from "@material-ui/core/GlobalStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import KeyboardArrowDownRounded from "@material-ui/icons/KeyboardArrowDownRounded";
import CheckRounded from "@material-ui/icons/CheckRounded";
import SettingsRounded from "@material-ui/icons/SettingsRounded";
import CopyAllRounded from "@material-ui/icons/CopyAllRounded";

import { jssToStyled } from "../../lib/jss-to-styled";

const Textarea = styled("textarea")({
  border: "none",
  padding: "1rem",
  flexGrow: 1,
  fontSize: 14,
  lineHeight: 1.43,
});

function formatCode(code) {
  return prettier.format(code, {
    parser: "babel",
    plugins: [prettierParserBabel],
  });
}

const defaultResult = {
  styledComponents: "",
  jsx: "",
};

const JssToStyled = () => {
  const [open, setOpen] = useState(null);
  const [jss, setJss] = useState("");
  const [jsx, setJsx] = useState("");
  const buttonRef = useRef(null);
  let result = defaultResult;
  try {
    result = jssToStyled({ jss, jsx });
    result.styledComponents = formatCode(result.styledComponents);
    result.jsx = formatCode(result.jsx);
  } catch (error) {
    result.styledComponents = "Error";
    result.jsx = "Error";
  }
  const [isStyledCopied, setStyledCopied] = useClipboard(
    result.styledComponents,
    {
      successDuration: 2000,
    }
  );
  const [isJsxCopied, setJsxCopied] = useClipboard(result.jsx, {
    successDuration: 2000,
  });
  return (
    <Box>
      <GlobalStyles
        styles={`
        .prism-code {
          font-size: 14px;
          line-height: 1.43;
          margin: 0;
          background-color: unset !important;
        }
      `}
      />
      <CssBaseline />
      <Container>
        <Box display="flex" alignItems="center" minHeight="4rem">
          <Box flex={1} />
          <Typography component="h1" variant="h6" textAlign="center" flex={1}>
            JSS 👉 styled
          </Typography>
          <Box flex={1} textAlign="right">
            {/* <Button
              ref={buttonRef}
              endIcon={<KeyboardArrowDownRounded />}
              onClick={(event) => {
                event.stopPropagation();
                setOpen(true);
              }}
            >
              Tools
            </Button>
            <Menu
              open={open}
              anchorEl={buttonRef.current}
              onClose={() => setOpen(false)}
              PaperProps={{
                elevation: 2,
              }}
              anchorOrigin={{
                horizontal: "right",
                vertical: "bottom",
              }}
              transformOrigin={{
                horizontal: "right",
                vertical: "top",
              }}
            >
              <MenuItem>
                <NextLink href="/tool/jss-to-styled">
                  <a>JSS 👉 styled</a>
                </NextLink>
              </MenuItem>
            </Menu> */}
          </Box>
        </Box>
      </Container>
      <Container>
        <Box display="flex" alignItems="center">
          <Box flex={1}>
            <Button startIcon={<SettingsRounded />}>Settings</Button>
          </Box>
          <Box flex={1} textAlign="center">
            <Button>Tweet</Button>
            <Button sx={{ ml: 1 }}>Copy Url</Button>
          </Box>
          <Box flex={1} />
        </Box>
        <Box
          display="flex"
          minHeight="calc(100vh - 160px)"
          mt={1.5}
          border="1px solid"
          borderColor="grey.300"
          bgcolor="background.paper"
        >
          <Box
            flexBasis="50%"
            flexGrow={1}
            display="flex"
            flexDirection="column"
          >
            <Box flexBasis={240} display="flex" flexDirection="column">
              <Box px={1.5} py={1} bgcolor="grey.100">
                <Typography>JSS</Typography>
              </Box>
              <Textarea
                placeholder="Hey"
                value={jss}
                onChange={(event) => {
                  setJss(event.target.value);
                }}
                onBlur={(event) => {
                  setJss(formatCode(event.target.value));
                }}
              />
            </Box>
            <Box
              flex={1}
              borderTop="1px solid"
              borderColor="grey.300"
              display="flex"
              flexDirection="column"
            >
              <Box px={1.5} py={1} bgcolor="grey.100">
                <Typography>JSX</Typography>
              </Box>
              <Textarea
                placeholder="Hey"
                value={jsx}
                onChange={(event) => {
                  setJsx(event.target.value);
                }}
                onBlur={(event) => {
                  setJsx(formatCode(event.target.value));
                }}
              />
            </Box>
          </Box>
          <Box bgcolor="grey.200" width="8px" />
          <Box
            flexBasis="50%"
            flexGrow={1}
            display="flex"
            flexDirection="column"
          >
            <Box px={1.5} py={1} bgcolor="grey.100">
              <Typography>Result</Typography>
            </Box>
            {result.styledComponents && (
              <Box position="relative" p={2} minHeight={240}>
                <Tooltip title={isStyledCopied ? "Copied" : "Copy result"}>
                  <IconButton
                    color={isStyledCopied ? "success" : "default"}
                    onClick={setStyledCopied}
                    sx={{ top: 8, right: 8, position: "absolute", zIndex: 1 }}
                  >
                    {isStyledCopied ? <CheckRounded /> : <CopyAllRounded />}
                  </IconButton>
                </Tooltip>
                <Highlight
                  {...defaultProps}
                  code={result.styledComponents}
                  theme={prismGithubTheme}
                  language="jsx"
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre className={className} style={style}>
                      {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                          {line.map((token, key) => (
                            <span {...getTokenProps({ token, key })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </Box>
            )}
            {result.jsx && (
              <>
                <Divider />
                <Box position="relative" p={2}>
                  <Tooltip title={isJsxCopied ? "Copied" : "Copy result"}>
                    <IconButton
                      color={isJsxCopied ? "success" : "default"}
                      onClick={setJsxCopied}
                      sx={{ top: 8, right: 8, position: "absolute", zIndex: 1 }}
                    >
                      {isJsxCopied ? <CheckRounded /> : <CopyAllRounded />}
                    </IconButton>
                  </Tooltip>
                  <Highlight
                    {...defaultProps}
                    code={result.jsx}
                    theme={prismGithubTheme}
                    language="jsx"
                  >
                    {({
                      className,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps,
                    }) => (
                      <pre className={className} style={style}>
                        {tokens.map((line, i) => (
                          <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                              <span {...getTokenProps({ token, key })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default JssToStyled;
