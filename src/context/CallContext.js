import React, { createContext, useState, useEffect } from "react";
import { db } from "@/src/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const CallContext = createContext();

const CallProvider = (props) => {
  const [callInput, setCallInput] = useState({});
  const [calls, setCall] = useState([]);

  const requestRef = collection(db, "requests");

  useEffect(() => {
    getCalls()
  }, [])

  const getCalls = async () => {
    let response;
    try {
      response = await getDocs(collection(db, "requests"));
      setCall(response.docs.map((req) => ({ ...req.data(), id: req.id })));
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      response = err.response;
    }

    return response;
  };

  const createNewCall = async () => {
    let response;
    try {
      response = await addDoc(requestRef, callInput);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      response = err.response;
    }

    return response;
  };

  const updateCall = async (id) => {
    let response;

    const request = doc(db, "requests", id);
    const newFields = {
      title: "new title",
      description: "new description",
      date: "new date",
    };

    try {
      response = await updateDoc(request, newFields);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      response = err.response;
    }

    return response;
  };

  const deleteCall = async (id) => {
    let response;

    const request = doc(db, "requests", id);

    try {
      response = await deleteDoc(request);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      response = err.response;
    }

    return response;
  };

  useEffect(() => {
    getCalls();
  }, []);

  return (
    <CallContext.Provider
      value={{
        callInput,
        setCallInput,
        calls,
        createNewCall,
        getCalls
      }}
    >
      {props.children}
    </CallContext.Provider>
  );
};

export default CallProvider;
