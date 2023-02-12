import { useEffect, useState, createContext } from "react";
import { db } from "@/src/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { app } from "@/src/firebase-config";
import { getAuth } from "firebase/auth";

export const UserContext = createContext(null);

const UserProvider = (props) => {
  const [stkProfile, setSdkProfile] = useState(null);
  const [stkData, setSdkData] = useState(null);

  const [updatedField, setUpdatedFields] = useState({});

  const auth = getAuth(app);
  const requestRef = collection(db, "users");

  useEffect(() => {
    getStkInfo();
  }, []);

  useEffect(() => {
    setUpdatedFields(stkData);
  }, [stkData]);

  const getStkInfo = async () => {
    let response;
    try {
      response = await getDocs(requestRef);
      response.docs.map(
        (req) =>
          req.data().uid === auth.currentUser?.uid &&
          setSdkData({ ...req.data(), id: req.id })
      );
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

  const updateStkInfo = async () => {
    let response;

    const request = doc(db, "users", stkData?.id);

    try {
      response = await updateDoc(request, updatedField);
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

  return (
    <UserContext.Provider
      value={{
        stkProfile,
        setSdkProfile,
        stkData,
        setSdkData,
        getStkInfo,
        updateStkInfo,
        updatedField,
        setUpdatedFields,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
