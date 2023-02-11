import { app } from "@/src/firebase-config";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

import toast from "react-hot-toast";
import { UserContext } from "@/src/context/UserContext";
import { useContext, useEffect } from "react";

import Router from "next/router";

const auth = getAuth(app);

export default function Profile() {
  const { value, setValue } = useContext(UserContext);

  useEffect(()=> {
    onAuthStateChanged(auth, (value) => {
      if (value) {
        console.log(auth.currentUser)
      } else {
        Router.push('/')
      }
    });
  },[value])
 

  const logoutSTK = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1>{value.email}</h1>
      <button
        className="primary bg-purple-400 hover:bg-purple-600"
        onClick={() => logoutSTK()}
      >
        Çıkış yap
      </button>
    </div>
  );
}
