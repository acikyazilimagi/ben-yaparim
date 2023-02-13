import React, { createContext, useState, useEffect } from "react";

export const CallContext = createContext();

const CallProvider = (props) => {
  const [callInput, setCallInput] = useState({});

console.log("input", callInput)
  return (
    <CallContext.Provider
      value={{
        callInput,
        setCallInput,

      }}
    >
      {props.children}
    </CallContext.Provider>
  );
};

export default CallProvider;
