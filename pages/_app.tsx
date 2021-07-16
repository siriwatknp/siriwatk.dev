import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider, StyledEngineProvider } from "@material-ui/core/styles";
import createCache from "@emotion/cache";

import { lightTheme } from "../lib/theme";

const cache = createCache({ key: "css" });
cache.compat = true;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={lightTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
