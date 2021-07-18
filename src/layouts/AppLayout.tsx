import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/router";
import * as ga from "lib/analytics/google-analytics";

const AppLayout = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();

  useEffect(() => {
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
  return <>{children}</>;
};

export default AppLayout;
