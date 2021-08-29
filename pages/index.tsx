import * as React from "react";
import Head from "next/head";
import { useSpring, animated } from "@react-spring/web";
import { useTheme, styled } from "@material-ui/core/styles";
import GlobalStyles from "@material-ui/core/GlobalStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import AppLayout from "layouts/AppLayout";
import SvgMountain1 from "components/SvgMountain1";
import SvgMountain2 from "components/SvgMountain2";

const calc = (x: number, y: number, rect: DOMRect) => [
  -(y - rect.top - rect.height / 2) / 20,
  (x - rect.left - rect.width / 2) / 20,
];
const calc2 = (x: number, y: number, rect: DOMRect) => [
  ((rect.width / 2 - (x - rect.x)) * 100) / rect.width,
  ((rect.height / 2 - (y - rect.y)) * 100) / rect.height,
];
const trans = (x: number, y: number) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg)`;

function BendingFrame({ children }: { children: React.ReactNode }) {
  const container = React.useRef<HTMLDivElement | null>(null);
  const card = React.useRef<HTMLDivElement | null>(null);
  const [xy, set] = React.useState([0, 0]);
  const [xy2, set2] = React.useState([0, 0]);
  const props = useSpring({
    xy,
    xy2,
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
      clamp: false,
      precision: 0.01,
      velocity: 0,
    },
  });
  return (
    <Box
      ref={container}
      sx={{
        "& .BendingFrame": { position: "relative", overflow: "hidden" },
        "& .BendingFrame-blur": {
          position: "absolute",
          width: "300px",
          height: "300px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          filter: "blur(80px)",
          borderRadius: "50%",
          top: 0,
          left: 0,
          pointerEvents: "none",
        },
      }}
    >
      <animated.div
        className="BendingFrame"
        ref={card}
        style={{ transform: props.xy.to(trans) }}
        onMouseLeave={() => {
          set([0, 0]);
          set2([0, 0]);
        }}
        onMouseMove={(e) => {
          if (container.current && card.current) {
            const rect = container.current.getBoundingClientRect();
            const cardRect = card.current.getBoundingClientRect();
            set(calc(e.clientX, e.clientY, rect));
            set2(calc2(e.clientX, e.clientY, cardRect));
          }
        }}
      >
        {children}
        <animated.div
          className="BendingFrame-blur"
          style={{
            transform: props.xy2.to((x, y) => `translate(${x}%, ${y}%)`),
          }}
        />
      </animated.div>
    </Box>
  );
}

const Glass = styled("div")({
  border: "1px solid",
  borderColor: "rgba(255,255,255,0.4)",
  backgroundColor: "rgba(255,255,255,0.2)",
  borderRadius: 20,
  backdropFilter: "blur(4px)",
  display: "flex",
  flexDirection: "column",
  "@media(prefers-color-scheme: dark)": {
    borderColor: "rgba(0,0,0,0.4)",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});

export default function Home() {
  const theme = useTheme();
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <AppLayout>
      <Head>
        <title>Hello from Siriwat.K</title>
        <meta name="title" content="siriwatk personal blog" />
        <meta
          name="description"
          content="Welcome to my personal blog. This is where I share stuff from my discovery & experience."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://siriwatk.dev/" />
        <meta property="og:title" content="siriwatk personal blog" />
        <meta
          property="og:description"
          content="Welcome to my personal blog. This is where I share stuff from my discovery & experience."
        />
        <meta property="og:image" content="/static/social-preview.jpeg" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://siriwatk.dev/" />
        <meta property="twitter:title" content="siriwatk personal blog" />
        <meta
          property="twitter:description"
          content="Welcome to my personal blog. This is where I share stuff from my discovery & experience."
        />
        <meta property="twitter:image" content="/static/social-preview.jpeg" />
      </Head>
      <GlobalStyles
        styles={{
          "a[href]": {
            color: "#75FBFB",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      />
      <CssBaseline />
      <Box
        height="100vh"
        flexDirection="column"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        maxHeight={{ xs: 500, md: "80vh" }}
        minHeight={500}
        sx={{
          overflow: "hidden",
          background: "linear-gradient(to top, #517FA4, #71B7CD 96%, #71C8CD)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: loaded ? 0 : -80,
            transition: "bottom 0.7s",
            lineHeight: 0,
            left: "80vw",
            transform: "translate(-75%)",
            "& > svg": {
              transition: "transform 0.5s",
              height: "auto",
            },
            [theme.breakpoints.only("xs")]: {
              "& > svg": {
                width: 1000,
              },
            },
            [theme.breakpoints.only("sm")]: {
              "& > svg": {
                width: 1200,
              },
            },
            [theme.breakpoints.only("md")]: {
              "& > svg": {
                width: 1400,
                transform: "translate(0, 40px)",
              },
            },
            [theme.breakpoints.only("lg")]: {
              "& > svg": {
                width: 1600,
                transform: "translate(0, 40px)",
              },
            },
            [theme.breakpoints.only("xl")]: {
              left: 0,
              transform: "none",
              "& > svg": {
                width: "100vw",
              },
            },
          }}
        >
          <SvgMountain1 />
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: loaded ? 0 : -120,
            transition: "bottom 0.7s",
            lineHeight: 0,
            left: "calc(-50% + 100vw)",
            transform: "translate(-50%)",
            "& > svg": {
              transition: "transform 0.5s",
              height: "auto",
            },
            [theme.breakpoints.only("xs")]: {
              "& > svg": {
                width: 800,
              },
            },
            [theme.breakpoints.only("sm")]: {
              "& > svg": {
                width: 900,
              },
            },
            [theme.breakpoints.only("md")]: {
              "& > svg": {
                width: 1280,
                transform: "translate(0, 60px)",
              },
            },
            [theme.breakpoints.only("lg")]: {
              "& > svg": {
                width: 1536,
                transform: "translate(0, 60px)",
              },
            },
            [theme.breakpoints.only("xl")]: {
              left: 0,
              transform: "none",
              "& > svg": {
                width: "100%",
                transform: "translate(0, 60px)",
              },
            },
          }}
        >
          <SvgMountain2 />
        </Box>
        <Box
          sx={{
            width: 3,
            position: "absolute",
            height: 100,
            bottom: 0,
            left: "50%",
            background:
              "linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))",
          }}
        />
        <BendingFrame>
          <Glass
            sx={{
              py: 5,
              px: { xs: 5, sm: 6, md: 7, lg: 8 },
              textAlign: "center",
              maxWidth: "100%",
            }}
          >
            <Typography
              variant="h1"
              fontSize="clamp(3rem, 2.4851rem + 2.1968vw, 6rem)"
              fontWeight={800}
              color="#fff"
              sx={{
                textShadow: "0px 2px 4px rgba(43, 68, 88, 0.4)",
                lineHeight: 1,
              }}
            >
              Exploring
              <br />
              Learning
              <br />
              Sharing.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignSelf: "center",
                alignItems: "center",
                mt: 4,
                textAlign: "left",
              }}
            >
              <Avatar
                src="https://avatars.githubusercontent.com/u/18292247?s=64&v=4"
                srcSet="https://avatars.githubusercontent.com/u/18292247?s=128&v=4 2x"
                sx={{
                  width: { xs: 48, sm: 64 },
                  height: { xs: 48, sm: 64 },
                  mr: 2,
                  border: "2px solid",
                  borderColor: "#fff",
                }}
              />
              <div>
                <Typography color="#fff">Siriwat.k (Jun)</Typography>
                <Typography color="#fff" noWrap sx={{ opacity: 0.6 }}>
                  Junior React Developer
                </Typography>
              </div>
            </Box>
          </Glass>
        </BendingFrame>
      </Box>
      <Box
        sx={{
          bgcolor: "#253A4A",
          textAlign: "center",
          color: "rgba(255,255,255,0.8)",
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: "inline-block" }}>
          <Typography sx={{ maxWidth: 400, textAlign: "center" }}>
            Welcome to my personal blog. This is where I share stuff from my
            discovery & experience.
          </Typography>
        </Box>
        <div>
          <Box
            sx={{
              display: "inline-block",
              width: 3,
              height: 100,
              background:
                "linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))",
            }}
          />
        </div>
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mx: "auto",
            maxWidth: 1200,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            "& > div": {
              flexGrow: 1,
              minWidth: 200,
              maxWidth: 240,
              "& img": {
                mb: 1,
              },
            },
          }}
        >
          <Box>
            <img src="/static/mui-logo.svg" width="36" height="32" />
            <Typography>
              Software Engineer at <br />{" "}
              <a
                href="https://material-ui.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <b>Material-UI</b>
              </a>
            </Typography>
          </Box>
          <Box>
            <img src="/static/muitreasury-logo.svg" width="36" height="32" />
            <Typography>
              Building UI Collection <br />{" "}
              <a
                href="https://mui-treasury.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <b>Mui Treasury</b>
              </a>
            </Typography>
          </Box>
          <Box>
            <img src="/static/react-logo.svg" width="36" height="32" />
            <Typography>
              <a
                href="https://github.com/React-in-Thai/react-foundation"
                rel="noopener noreferrer"
                target="_blank"
              >
                <b>React online course</b>
              </a>{" "}
              in <b>Thai</b> <br /> (work in progress)
            </Typography>
          </Box>
          <Box>
            <img src="/static/facebook-logo.svg" width="32" height="32" />
            <Typography>
              <a
                href="https://www.facebook.com/devMasterSomeday/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <b>Facebook page</b>
              </a>
              <br />
              sharing tips & tricks about frontend.
            </Typography>
          </Box>
          <Box>
            <img src="/static/youtube-logo.svg" width="46" height="32" />
            <Typography>
              My own{" "}
              <a
                href="https://www.youtube.com/channel/UCe0f9Y5GA-erQ_ZX1IGmV3g"
                rel="noopener noreferrer"
                target="_blank"
              >
                <b>Youtube channel</b>
              </a>{" "}
              <br />
              in Thai.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: 100 }} />
      </Box>
    </AppLayout>
  );
}
