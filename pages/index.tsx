import * as React from "react";
import NextLink from "next/link";
import Head from "next/head";
import { useSpring, animated } from "@react-spring/web";
import { useTheme, styled } from "@material-ui/core/styles";
import GlobalStyles from "@material-ui/core/GlobalStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
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
  return (
    <AppLayout>
      <Head>
        <title>Hello from Siriwat.K</title>
      </Head>
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
            bottom: 0,
            lineHeight: 0,
            left: "80vw",
            transform: "translate(-75%)",
            "& > svg": {
              transition: "0.5s",
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
            bottom: 0,
            lineHeight: 0,
            left: "calc(-50% + 100vw)",
            transform: "translate(-50%)",
            "& > svg": {
              transition: "0.5s",
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
        {/* <Container sx={{ position: "fixed", top: 0, display: "flex", py: 2 }}>
          <NextLink href="/tool/jss-to-styled">
            <Button component="a" sx={{ ml: "auto" }}>
              JSS 👉 styled
            </Button>
          </NextLink>
        </Container>
        <Typography
          variant="h1"
          fontSize="clamp(2rem, 0.4286rem + 4.7619vw, 4rem)"
          fontWeight={900}
          color="primary.main"
          mb={1}
        >
          👋 I'm Siriwat.K
        </Typography>
        <Typography
          variant="h4"
          color="text.secondary"
          fontSize="clamp(1.5rem, 0.3571rem + 2.8571vw, 2.5rem)"
          fontWeight="bold"
        >
          UI Lover @Material-UI
        </Typography> */}
      </Box>
    </AppLayout>
  );
}
