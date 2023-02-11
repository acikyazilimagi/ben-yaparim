import "@/src/styles/globals.css";
// @material-tailwind/react
import { ThemeProvider } from "@material-tailwind/react";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Navbar />
      <Component {...pageProps}/>
    </ThemeProvider>
  );
}
