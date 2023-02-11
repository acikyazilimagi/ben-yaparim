import "@/src/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "@/components/Navbar";
import CallProvider from "@/src/context/CallContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Toaster } from "react-hot-toast";
import UserProvider from "@/src/context/UserContext";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider>
        <CallProvider>
          <UserProvider>
            <Toaster position="top-right" />
            <Navbar />
            <Component {...pageProps} />
          </UserProvider>
        </CallProvider>
      </ThemeProvider>
    </>
  );
}
