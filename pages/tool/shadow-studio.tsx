import * as React from "react";
import Head from "next/head";
import Color from "color";
import Highlight, { defaultProps } from "prism-react-renderer";
import { HexColorPicker } from "react-colorful";
import useClipboard from "react-use-clipboard";
import prismTheme from "prism-react-renderer/themes/vsDark";
import GlobalStyles from "@mui/material/GlobalStyles";
import { blue } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import FormatPaintRounded from "@mui/icons-material/FormatPaintRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import TungstenRounded from "@mui/icons-material/TungstenRounded";
import HeightRounded from "@mui/icons-material/HeightRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";

const createShadowLayer = (elevation = 0, deg = 45) => {
  return Number((elevation / Math.tan((deg * Math.PI) / 180)).toFixed(0));
};

const createDegrees = (light = 1, min = 15, max = 75) => {
  return [...Array(light)]
    .map((_, index) => ((max - min) / (light + 1)) * (index + 1) + min)
    .reverse();
};

const getAlpha =
  (light = 1) =>
  (index: number) => {
    // alpha starts at 0.12 and reduced by 0.01
    const range = [...Array(light).fill(0.08)].map((value, i) =>
      Math.min(0.16, Number((value + i * 0.01).toFixed(2)))
    );
    return range[index];
  };

const CodeHighlight = ({ code }: { code: string }) => (
  <Highlight {...defaultProps} code={code} theme={prismTheme} language="css">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
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
);

interface ShadowCustomizerProps {
  initialElevation: number;
  initialLight: number;
  onChange?: (shadow: string) => void;
}

const ShadowCustomizer = ({
  initialElevation,
  initialLight,
  onChange,
}: ShadowCustomizerProps) => {
  const [elevation, setElevation] = React.useState(initialElevation || 2);
  const [light, setLight] = React.useState(initialLight || 2);
  const degrees = createDegrees(light);
  const shadow = degrees
    .map((deg, index) => {
      const blur = createShadowLayer(elevation, deg);
      return `0 ${(blur / (2 * (index || 1) * 0.8)).toFixed(
        0
      )}px ${blur}px hsl(var(--shadow-channel) / ${getAlpha(light)(index)})`;
    })
    .join(",\n");
  const [copied, setCopied] = useClipboard(shadow.replace(/\n/g, " "), {
    successDuration: 2000,
  });
  React.useEffect(() => {
    onChange(shadow);
  }, [shadow]);
  return (
    <React.Fragment>
      <Box sx={{ py: 4, px: { xs: 2, md: 4 }, alignSelf: "center" }}>
        <Box
          sx={{
            width: 200,
            height: 120,
            bgcolor: "#fff",
            borderRadius: "8px",
            boxShadow: shadow,
            ml: "auto",
          }}
        />
      </Box>
      <Box
        sx={{
          py: 2,
          pl: { xs: 2, sm: 5 },
          pr: { md: 5 },
          display: "flex",
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Distance between object and background. The size of the shadow increases as the distance goes up.">
            <HeightRounded sx={{ mb: 1 }} />
          </Tooltip>
          <Slider
            orientation="vertical"
            min={1}
            max={64}
            value={elevation}
            onChange={(event, value: number) => setElevation(value)}
            sx={{ color: "var(--primary-color)" }}
          />
          <Typography variant="body2">{elevation}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Size of the light source that creates shadow layers.">
            <TungstenRounded sx={{ mb: 1 }} />
          </Tooltip>
          <Slider
            orientation="vertical"
            min={2}
            max={8}
            value={light}
            onChange={(event, value: number) => setLight(value)}
            sx={{ color: "var(--primary-color)" }}
          />
          <Typography variant="body2">{light}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: "100%",
          mr: 1,
          gridColumn: { xs: "span 2", md: "span 1" },
          justifySelf: "center",
          alignSelf: {
            md: "center",
          },
          position: "relative",
          "& .prism-code": {
            overflow: "auto",
          },
        }}
      >
        <CodeHighlight code={shadow} />
        <Tooltip title={copied ? "Copied" : "Copy shadow"}>
          <IconButton
            aria-label="Copy"
            size="small"
            color={copied ? "success" : "default"}
            onClick={() => setCopied()}
            sx={{
              bgcolor: "#fff",
              "&:hover": {
                bgcolor: "#e5e5e5",
              },
              position: "absolute",
              top: 0,
              right: 0,
              transform: "translate(50%, -50%)",
            }}
          >
            {copied ? (
              <CheckRounded fontSize="small" />
            ) : (
              <ContentCopyRounded fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </React.Fragment>
  );
};

const GetCode = ({
  shadows,
  shadowChannel,
}: {
  shadows: Array<string>;
  shadowChannel: string;
}) => {
  const [codeMenuEl, setCodeMenuEl] = React.useState<null | HTMLElement>(null);
  const [type, setType] = React.useState<"js" | "css">("js");
  const scale = ["xs", "sm", "md", "lg", "xl"];
  const text = {
    js: `{ ${shadows
      .map((s, index) => `${scale[index]}: '${s.replace(/\n/g, " ")}'`)
      .join(",")} }`,
    css: `:root { --shadow-channel: ${shadowChannel}; ${shadows
      .map((s, index) => `--shadow-${scale[index]}: ${s.replace(/\n/g, " ")}`)
      .join(";")} }`,
  };
  const [copied, setCopied] = useClipboard(text[type], {
    successDuration: 2000,
  });
  let result = "";
  if (type === "js") {
    result = `{
  xs:
  \`${shadows[0]?.replace(/\n/g, "\n   ")}\`,
  sm:
  \`${shadows[1]?.replace(/\n/g, "\n   ")}\`,
  md:
  \`${shadows[2]?.replace(/\n/g, "\n   ")}\`,
  lg:
  \`${shadows[3]?.replace(/\n/g, "\n   ")}\`,
  xl:
  \`${shadows[4]?.replace(/\n/g, "\n   ")}\`,
}`;
  }
  if (type === "css") {
    result = `:root {
  --shadow-channel: ${shadowChannel};
  --shadow-xs:
  ${shadows[0]?.replace(/\n/g, "\n  ")};
  --shadow-sm:
  ${shadows[1]?.replace(/\n/g, "\n  ")};
  --shadow-md:
  ${shadows[2]?.replace(/\n/g, "\n  ")};
  --shadow-lg:
  ${shadows[3]?.replace(/\n/g, "\n  ")};
  --shadow-xl:
  ${shadows[4]?.replace(/\n/g, "\n  ")};
}`;
  }
  return (
    <React.Fragment>
      <IconButton
        aria-label="Get code"
        id="code-button"
        aria-controls={Boolean(codeMenuEl) ? "code-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(codeMenuEl) ? "true" : undefined}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          setCodeMenuEl(event.currentTarget);
        }}
      >
        <CodeRounded />
      </IconButton>
      <Menu
        id="code-menu"
        anchorEl={codeMenuEl}
        open={Boolean(codeMenuEl)}
        onClose={() => setCodeMenuEl(null)}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        BackdropProps={{
          invisible: true,
        }}
        MenuListProps={{
          // @ts-ignore MUI bug
          component: "div",
          sx: { pb: 0 },
          "aria-labelledby": "code-button",
        }}
        PaperProps={{
          sx: {
            maxWidth: 500,
            borderRadius: "8px",
            "& .prism-code": {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", px: 1, mb: 1 }}>
          <ToggleButtonGroup
            exclusive
            value={type}
            color="primary"
            onChange={(event, value: "js" | "css") => setType(value)}
            sx={{ "& > button": { py: 0.5 } }}
          >
            <ToggleButton value="js">JS</ToggleButton>
            <ToggleButton value="css">CSS</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={copied ? <CheckRounded /> : <ContentCopyRounded />}
            onClick={() => setCopied()}
            sx={{ ml: "auto" }}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </Box>
        <CodeHighlight code={result} />
      </Menu>
    </React.Fragment>
  );
};

export default function ShadowStudio() {
  const shadowRef = React.useRef([]);
  const [bgColor, setBgColor] = React.useState(Color(blue[100]).hsl());
  const [bgMenuEl, setBgMenuEl] = React.useState<null | HTMLElement>(null);
  const clonedColor = Color(bgColor);
  const shadowChannel = clonedColor
    .desaturate(0.7)
    .darken(0.7)
    .string(0)
    .replace(/hsl\((.*)\)/, "$1")
    .replace(/,/g, "") as string;
  const primaryColor = clonedColor.desaturate(0.1).darken(0.7).string(0);
  const saveShadow = (index: number) => (value: string) => {
    shadowRef.current[index] = value;
  };
  return (
    <React.Fragment>
      <Head>
        <title>siriwatk — shadow studio</title>
        <meta name="title" content="siriwatk — shadow studio" />
        <meta
          name="description"
          content="A shadow scale generator for building a design system"
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://siriwatk.dev/tool/shadow-studio"
        />
        <meta property="og:title" content="siriwatk — shadow studio" />
        <meta
          property="og:description"
          content="A shadow scale generator for building a design system"
        />
        <meta
          property="og:image"
          content="https://siriwatk.dev/static/shadow-studio.jpeg"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://siriwatk.dev/tool/shadow-studio"
        />
        <meta property="twitter:title" content="siriwatk — shadow studio" />
        <meta
          property="twitter:description"
          content="A shadow scale generator for building a design system"
        />
        <meta
          property="twitter:image"
          content="https://siriwatk.dev/static/shadow-studio.jpeg"
        />
      </Head>
      <Container maxWidth="md" sx={{ pb: 6 }}>
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: bgColor.toString(),
              transition: "0.3s",
              "--shadow-channel": shadowChannel,
              "--primary-color": primaryColor,
            },
            ".prism-code": {
              borderRadius: "8px",
              fontSize: "0.875rem",
              padding: "0.75rem 1rem",
              margin: "initial",
            },
            svg: {
              color: "var(--primary-color)",
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            mx: "auto",
            width: "min-content",
            justifyContent: "center",
            gap: 2,
            px: 1.5,
            py: 1,
            my: 2,
            mb: 8,
            borderRadius: "40px",
            bgcolor: "hsl(var(--shadow-channel) / 0.12)",
          }}
        >
          <IconButton
            id="bgColor-button"
            aria-controls={Boolean(bgMenuEl) ? "bgColor-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(bgMenuEl) ? "true" : undefined}
            aria-label="Background color"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setBgMenuEl(event.currentTarget);
            }}
          >
            <FormatPaintRounded />
          </IconButton>
          <Menu
            id="bgColor-menu"
            anchorEl={bgMenuEl}
            open={Boolean(bgMenuEl)}
            onClose={() => setBgMenuEl(null)}
            transformOrigin={{
              horizontal: "center",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: "center",
              vertical: "bottom",
            }}
            MenuListProps={{
              // @ts-ignore MUI bug
              component: "div",
              sx: { p: 0 },
              "aria-labelledby": "bgColor-button",
            }}
            PaperProps={{
              sx: {
                overflow: "visible",
                bgcolor: "initial",
                borderRadius: "8px",
              },
            }}
          >
            <HexColorPicker
              color={Color(bgColor).hex().toString()}
              onChange={(value) => setBgColor(Color(value).hsl())}
            />
          </Menu>
          <GetCode shadows={shadowRef.current} shadowChannel={shadowChannel} />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "auto auto 1fr",
            },
            gridAutoRows: {
              xs: "160px",
              md: "200px",
            },
            columnGap: { xs: 0, md: 2 },
            rowGap: { xs: 0, md: 8 },
          }}
        >
          <ShadowCustomizer
            initialElevation={2}
            initialLight={2}
            onChange={saveShadow(0)}
          />
          <ShadowCustomizer
            initialElevation={6}
            initialLight={3}
            onChange={saveShadow(1)}
          />
          <ShadowCustomizer
            initialElevation={12}
            initialLight={3}
            onChange={saveShadow(2)}
          />
          <ShadowCustomizer
            initialElevation={24}
            initialLight={4}
            onChange={saveShadow(3)}
          />
          <ShadowCustomizer
            initialElevation={40}
            initialLight={5}
            onChange={saveShadow(4)}
          />
        </Box>
      </Container>
    </React.Fragment>
  );
}
