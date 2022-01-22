import { useState, useRef } from "react";
import Head from "next/head";
import { Options } from "prettier";
import prettier from "prettier/standalone";
import prettierParserBabel from "prettier/parser-babel";
import Highlight, { defaultProps } from "prism-react-renderer";
import prismGithubTheme from "prism-react-renderer/themes/github";
import useClipboard from "react-use-clipboard";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import OutlinedInput from "@mui/material/OutlinedInput";
import Switch from "@mui/material/Switch";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";

import CheckRounded from "@mui/icons-material/CheckRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import CopyAllRounded from "@mui/icons-material/CopyAllRounded";
import InfoRounded from "@mui/icons-material/InfoRounded";
import TextSnippetRounded from "@mui/icons-material/TextSnippetRounded";

import { jssToStyled, EXAMPLE_1, EXAMPLE_2 } from "lib/jss-to-styled";
import AppLayout from "layouts/AppLayout";

type PrettierOptions = Omit<Options, "trailingComma"> & {
  trailingComma: boolean;
};

const Textarea = styled("textarea")({
  border: "none",
  padding: "1rem",
  flexGrow: 1,
  fontSize: 14,
  lineHeight: 1.43,
});

function formatCode(code: string, options: Partial<PrettierOptions> = {}) {
  return prettier.format(code, {
    ...options,
    trailingComma: options.trailingComma ? "es5" : "none",
    parser: "babel",
    plugins: [prettierParserBabel],
  });
}

const defaultResult = {
  styledComponents: "",
  jsx: "",
};

const JssToStyled = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [prettierOptions, setPrettierOptions] = useState<PrettierOptions>({
    tabWidth: 2,
    bracketSpacing: true,
    jsxBracketSameLine: false,
    semi: true,
    singleQuote: false,
    trailingComma: true,
  });
  const [jss, setJss] = useState("");
  const [jsx, setJsx] = useState("");
  const settingsRef = useRef(null);
  let result = defaultResult;
  try {
    result = jssToStyled({ jss, jsx });
    result.styledComponents = formatCode(
      result.styledComponents,
      prettierOptions
    );
    result.jsx = formatCode(result.jsx, prettierOptions);
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
    <AppLayout>
      <Head>
        <title>siriwatk — jss-to-styled for Material-UI</title>
        <meta
          name="title"
          content="siriwatk — jss-to-styled for Material-UI v5"
        />
        <meta
          name="description"
          content="A tool for helping developer migrate Material-UI project to version 5 with less afford"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://siriwatk.dev/tool/jss-to-styled"
        />
        <meta
          property="og:title"
          content="siriwatk — jss-to-styled for Material-UI v5"
        />
        <meta
          property="og:description"
          content="A tool for helping developer migrate Material-UI project to version 5 with less afford"
        />
        <meta
          property="og:image"
          content="https://siriwatk.dev/static/jss-to-styled.jpeg"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://siriwatk.dev/tool/jss-to-styled"
        />
        <meta
          property="twitter:title"
          content="siriwatk — jss-to-styled for Material-UI v5"
        />
        <meta
          property="twitter:description"
          content="A tool for helping developer migrate Material-UI project to version 5 with less afford"
        />
        <meta
          property="twitter:image"
          content="https://siriwatk.dev/static/jss-to-styled.jpeg"
        />
      </Head>
      <Box>
        <Dialog
          maxWidth="md"
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle>How it works</DialogTitle>
          <DialogContent>
            <Alert color="info" icon={<InfoRounded />} sx={{ mb: 2 }}>
              This is the last step of migration to convert JSS{" "}
              <code>makeStyles()</code> or <code>withStyles()</code> to{" "}
              <code>styled component</code> with less afford. If you haven't go
              through migration, please read
              <Link
                href="https://next.material-ui.com/guides/migration-v4/#main-content"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mx: 1 }}
              >
                official migration docs
              </Link>
              first.
            </Alert>
            <Typography component="h3" variant="h6">
              <b>Inputs</b>
            </Typography>
            <Typography mb={2}>
              You need to copy <b>JSS</b> and <b>JSX</b> from your js file to
              the inputs. This tool will start looking at the JSS and map the
              keys with JSX that your provide. If JSS and JSX is valid, you will
              see the result on the right which contains 2 section, the styled
              components and the parsed JSX that you can copy to your project.
            </Typography>
            <Typography>
              <b>Valid JSS</b>
            </Typography>
            <ul>
              <li>
                <code>{`({ root: { ... }, divider: { ... } })`}</code>
              </li>
              <li>
                <code>{`const useStyles = makeStyles(theme => ({ ... }))`}</code>
              </li>
              <li>
                <code>{`const styles = (theme) => ({ ... })`}</code>
              </li>
              <li>
                <code>{`makeStyles({ ... })`}</code>
              </li>
              <li>
                <code>{`withStyles({ ... })`}</code>
              </li>
            </ul>
            <Typography mt={2}>
              <b>Valid JSX</b> - only single root element
            </Typography>
            <ul>
              <li>
                <code>{`<div>...</div>`}</code>
              </li>
            </ul>
          </DialogContent>
        </Dialog>
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
          <Box
            display="flex"
            alignItems="center"
            minHeight={{ xs: "5rem", sm: "4rem" }}
            flexWrap="wrap"
          >
            <Typography
              component="h1"
              variant="h6"
              flexBasis={200}
              flexShrink={1}
            >
              JSS 👉 styled
            </Typography>
            <div>
              <Button
                size="small"
                onClick={() => setDialogOpen(true)}
                startIcon={<InfoRounded />}
              >
                How it works?
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<TextSnippetRounded />}
                onClick={() => {
                  setJss(EXAMPLE_1.jss);
                  setJsx(EXAMPLE_1.jsx);
                }}
                sx={{ ml: 1.5 }}
              >
                Example 1
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<TextSnippetRounded />}
                onClick={() => {
                  setJss(EXAMPLE_2.jss);
                  setJsx(EXAMPLE_2.jsx);
                }}
                sx={{ ml: 1.5 }}
              >
                Example 2
              </Button>
            </div>
          </Box>
        </Container>
        <Container>
          <Box
            display="flex"
            minHeight="calc(100vh - 160px)"
            mt={1.5}
            border="1px solid"
            borderColor="grey.300"
            bgcolor="background.paper"
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <Box
              flexBasis="50%"
              flexGrow={1}
              display="flex"
              flexDirection="column"
            >
              <Box
                flexBasis={{ xs: 160, sm: 300 }}
                display="flex"
                flexDirection="column"
              >
                <Box px={1.5} py={1} bgcolor="grey.100">
                  <Typography>JSS</Typography>
                </Box>
                <Textarea
                  placeholder="const useStyles = makeStyles(theme => ({ ... })"
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
                  placeholder="<div className={classes.root}>...<div>"
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
              maxWidth={{ sm: "calc(50% - 4px)" }}
              flexGrow={1}
              display="flex"
              flexDirection="column"
              bgcolor="grey.50"
            >
              <Box
                px={1.5}
                py={1}
                bgcolor="grey.100"
                display="flex"
                alignItems="center"
              >
                <Typography>Result</Typography>
                <ClickAwayListener
                  onClickAway={(event) => {
                    const dom = document.getElementById("prettier-options");
                    if (!dom || !dom.contains(event.target as Node)) {
                      setOpen(false);
                    }
                  }}
                >
                  <Tooltip title="Settings">
                    <IconButton
                      ref={settingsRef}
                      size="small"
                      onClick={() => setOpen(true)}
                      sx={{ ml: "auto", my: -0.5 }}
                    >
                      <SettingsRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
              </Box>
              <Popper
                id="prettier-options"
                open={open}
                anchorEl={settingsRef.current}
                placement={"left-start"}
                transition
                style={{ zIndex: 1 }}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper elevation={2} sx={{ minWidth: 240 }}>
                      <List
                        dense
                        subheader={
                          <ListSubheader
                            disableSticky
                            component="div"
                            sx={{ lineHeight: "36px" }}
                          >
                            Prettier options
                          </ListSubheader>
                        }
                      >
                        <ListItem>
                          <ListItemText>Tab width</ListItemText>
                          <OutlinedInput
                            aria-label="Tab Width"
                            type="number"
                            value={prettierOptions.tabWidth}
                            onChange={(event) =>
                              setPrettierOptions((v) => ({
                                ...v,
                                tabWidth: Number(event.target.value),
                              }))
                            }
                            inputProps={{ min: 2 }}
                            sx={{
                              p: 0,
                              width: 48,
                              "& > input": { padding: "7.5px 0.5rem" },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText>Bracket Spacing</ListItemText>
                          <Switch
                            sx={{ mr: -1 }}
                            checked={prettierOptions.bracketSpacing}
                            onChange={(event) =>
                              setPrettierOptions((v) => ({
                                ...v,
                                bracketSpacing: event.target.checked,
                              }))
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText>JSX Bracket Same Line</ListItemText>
                          <Switch
                            sx={{ mr: -1 }}
                            checked={prettierOptions.jsxBracketSameLine}
                            onChange={(event) =>
                              setPrettierOptions((v) => ({
                                ...v,
                                jsxBracketSameLine: event.target.checked,
                              }))
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText>semi</ListItemText>
                          <Switch
                            sx={{ mr: -1 }}
                            checked={prettierOptions.semi}
                            onChange={(event) =>
                              setPrettierOptions((v) => ({
                                ...v,
                                semi: event.target.checked,
                              }))
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText>Single Quote</ListItemText>
                          <Switch
                            sx={{ mr: -1 }}
                            checked={prettierOptions.singleQuote}
                            onChange={(event) =>
                              setPrettierOptions((v) => ({
                                ...v,
                                singleQuote: event.target.checked,
                              }))
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText>Trailing Commas</ListItemText>
                          <Switch
                            sx={{ mr: -1 }}
                            checked={prettierOptions.trailingComma}
                            onChange={(event) =>
                              setPrettierOptions((v) => ({
                                ...v,
                                trailingComma: event.target.checked,
                              }))
                            }
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Fade>
                )}
              </Popper>
              {!result.jsx && !result.styledComponents && (
                <Box p={2} color="grey.400">
                  Once valid JSS and JSX is provided on the left, the result
                  will appear here.
                </Box>
              )}
              {result.styledComponents && (
                <Box position="relative" minHeight={240}>
                  <Tooltip title={isStyledCopied ? "Copied" : "Copy result"}>
                    <IconButton
                      color={isStyledCopied ? "success" : "default"}
                      onClick={setStyledCopied}
                      sx={{
                        top: 8,
                        right: 8,
                        position: "absolute",
                        zIndex: 1,
                        bgcolor: "grey.100",
                        "&:hover": {
                          bgcolor: "grey.200",
                        },
                      }}
                      size="large">
                      {isStyledCopied ? <CheckRounded /> : <CopyAllRounded />}
                    </IconButton>
                  </Tooltip>
                  <Box overflow="auto" p={2}>
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
                </Box>
              )}
              {result.jsx && (
                <>
                  <Divider />
                  <Box position="relative">
                    <Tooltip title={isJsxCopied ? "Copied" : "Copy result"}>
                      <IconButton
                        color={isJsxCopied ? "success" : "default"}
                        onClick={setJsxCopied}
                        sx={{
                          top: 8,
                          right: 8,
                          position: "absolute",
                          zIndex: 1,
                          bgcolor: "grey.100",
                          "&:hover": {
                            bgcolor: "grey.200",
                          },
                        }}
                        size="large">
                        {isJsxCopied ? <CheckRounded /> : <CopyAllRounded />}
                      </IconButton>
                    </Tooltip>
                    <Box overflow="auto" p={2}>
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
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </AppLayout>
  );
};

export default JssToStyled;
