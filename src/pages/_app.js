import "@/src/styles/globals.css";

import { Toaster } from "react-hot-toast";
import { UserContext } from "@/src/context/UserContext";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [value, setValue] = useState(null);
  
  return (
    <>
      <UserContext.Provider value={{value, setValue}}>
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}
