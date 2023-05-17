import { useEffect, useState } from "react";
import "@/src/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "@/components/Navbar";
import CallProvider from "@/src/context/CallContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Toaster } from "react-hot-toast";
import UserProvider from "@/src/context/UserContext";
import Spinner from "@/src/components/icons/Spinner";
import Router from "next/router";

export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);

  return (
    <>
      <ThemeProvider>
        <CallProvider>
          <UserProvider>
            <Toaster position="top-right" />
            <Navbar />
            {isLoading && (
              <Spinner className="w-1/2 h-56 animate-spin m-auto my-20" />
            )}
            <Component {...pageProps} />
          </UserProvider>
        </CallProvider>
      </ThemeProvider>
    </>
  );
}
