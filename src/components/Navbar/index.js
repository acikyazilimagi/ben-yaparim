import Router from "next/router";
import Link from "next/link";

import { app } from "@/src/firebase-config";
import { getAuth, signOut } from "firebase/auth";

import toast from "react-hot-toast";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/src/context/UserContext";
import Logo from "@/images/logo.png";

export default function Navbar() {
  const { stkProfile } = useContext(UserContext);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    setAuth(getAuth(app));
  }, [stkProfile]);

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
      {!!auth.currentUser ? (
        <div className="flex justify-between items-center px-[8%] py-10 w-full">
          <div className="flex items-center">
            <img
              width={150}
              height={100}
              src={Logo.src}
              alt="Kurum Logo"
              className="cursor-pointer"
              onClick={() => Router.push("/")}
            />
          </div>

          <div>
            <Link
              href={"/stk/profile"}
              className="text-center text-pink-600 font-bold mr-10"
            >
              Profilim
            </Link>

            <button
              className="primary bg-pink-600 hover:bg-purple-600 text-white"
              onClick={() => logoutSTK()}
            >
              Çıkış yap
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end p-10 w-full">
          <Link href={"/login"} className="text-center text-pink-600 font-bold">
            Kurum Girişi
          </Link>

          <Link
            href={"/register"}
            className="text-center text-pink-600 font-bold ml-5"
          >
            Gönüllü Girişi
          </Link>
        </div>
      )}
    </div>
  );
}
