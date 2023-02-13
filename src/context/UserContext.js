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
  const [autProfileData, setAuthProfileData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [updatedField, setUpdatedFields] = useState({});
  console.log("dummy");
  const auth = getAuth(app);
  const requestRef = collection(db, "users");

  useEffect(() => {
    getStkInfo();
  }, []);

  useEffect(() => {
    setUpdatedFields(profileData);
  }, [profileData]);

  const getStkInfo = async () => {
    let response;
    try {
      response = await getDocs(requestRef);
      response.docs.map(
        (req) =>
          req.data().uid === auth.currentUser?.uid &&
          setProfileData({ ...req.data(), id: req.id })
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

    const request = doc(db, "users", profileData?.id);

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
        autProfileData,
        setAuthProfileData,
        profileData,
        setProfileData,
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
