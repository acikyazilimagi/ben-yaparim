import { useEffect, useState, createContext } from "react";
import { getUser } from "../firebase/users";
import { auth } from "@/src/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext(null);

const UserProvider = (props) => {
  const [autProfileData, setAuthProfileData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [updatedField, setUpdatedFields] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const data = await getUser(uid);
        setProfileData(data);
      } else {
        Router.push("/");
      }
    });
  }, [auth]);

  return (
    <UserContext.Provider
      value={{
        autProfileData,
        setAuthProfileData,
        profileData,
        setProfileData,
        updatedField,
        setUpdatedFields,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
