import "@/src/styles/globals.css";
// @material-tailwind/react
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "@/components/Navbar";
import CallProvider from "@/src/context/CallContext";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CallProvider>
        <Navbar />
        <Component {...pageProps} />
      </CallProvider>
    </ThemeProvider>
  );
}
