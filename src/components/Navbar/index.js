import React, { useContext, useEffect } from "react";
import Link from "next/link";

import { UserContext } from "@/src/context/UserContext";
import { app } from "@/src/firebase-config";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const { value, setValue } = useContext(UserContext);

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
      {!!value ? (
        <div className="flex justify-between items-center p-10 w-full">
          <div className="flex items-center">
            <img
              width={100}
              height={100}
              src="https://avatars.githubusercontent.com/u/16260732?s=200&v=4"
              alt="Kurum Logo"
            />
            <p className="text-xl font-bold mx-10">Açık kaynak</p>
          </div>

          <button
            className="primary bg-purple-400 hover:bg-purple-600"
            onClick={() => logoutSTK()}
          >
            Çıkış yap
          </button>
        </div>
      ) : (
        <div className="flex justify-end p-10 w-full">
          <Link
            href={"/stk/login"}
            className="text-center text-pink-600 font-bold"
          >
            Kurum Girişi
          </Link>
        </div>
      )}
    </div>
  );
}
