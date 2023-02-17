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
            <p className="text-xs mx-[6%]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Netus
              et malesuada fames ac turpis. Porta nibh venenatis cras sed. Nisi
              lacus sed viverra tellus in hac habitasse. Eros in cursus turpis
              massa. Iaculis nunc sed augue lacus viverra. Egestas maecenas
              pharetra convallis posuere morbi leo urna molestie. Elit eget
              gravida cum sociis natoque. Nunc pulvinar sapien et ligula
              ullamcorper. Quisque id diam vel quam. Commodo ullamcorper a lacus
              vestibulum sed arcu non odio euismod. Odio ut sem nulla pharetra
              diam. Cras ornare arcu dui vivamus. Leo vel fringilla est
              ullamcorper eget nulla facilisi etiam. Ornare arcu dui vivamus
              arcu felis bibendum ut tristique. Ipsum a arcu cursus vitae congue
              mauris rhoncus aenean vel. Risus sed vulputate odio ut. Purus sit
              amet volutpat consequat mauris nunc congue. Mattis enim ut tellus
              elementum sagittis vitae et. Diam sit amet nisl suscipit. Id diam
              vel quam elementum. Scelerisque in dictum non consectetur.
            </p>
          </UserProvider>
        </CallProvider>
      </ThemeProvider>
    </>
  );
}
