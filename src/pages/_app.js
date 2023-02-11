import "@/src/styles/globals.css";

import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "@/components/Navbar";
import CallProvider from "@/src/context/CallContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Toaster } from "react-hot-toast";
import { UserContext } from "@/src/context/UserContext";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [value, setValue] = useState(null);

  return (
    <>
      <ThemeProvider>
        <CallProvider>
          <UserContext.Provider value={{ value, setValue }}>
            <Toaster position="top-right" />
            <Navbar />
            <Component {...pageProps} />
          </UserContext.Provider>
        </CallProvider>
      </ThemeProvider>
    </>
  );
}
