import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import createCache from "@emotion/cache";

import * as ga from "lib/analytics/google-analytics";
import { lightTheme } from "lib/theme";

const cache = createCache({
  key: "css",
  prepend: true,
});
cache.compat = true;

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <StyledEngineProvider injectFirst>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={lightTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
