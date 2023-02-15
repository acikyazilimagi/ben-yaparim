import React, { createContext, useState, useEffect } from "react";

export const CallContext = createContext();

const CallProvider = (props) => {
  const [callInput, setCallInput] = useState({});

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
