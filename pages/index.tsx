import NextLink from "next/link";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default function Home() {
  return (
    <Box
      minHeight="100vh"
      flexDirection="column"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Container sx={{ position: "fixed", top: 0, display: "flex", py: 2 }}>
        <NextLink href="/tool/jss-to-styled">
          <Button component="a" sx={{ ml: "auto" }}>
            JSS 👉 styled
          </Button>
        </NextLink>
      </Container>
      <CssBaseline />
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
      </Typography>
    </Box>
  );
}
