import Router from "next/router";
import Link from "next/link";

import { app } from "@/src/firebase-config";
import { getAuth, signOut } from "firebase/auth";

import toast from "react-hot-toast";

export default function Navbar() {
  const auth = getAuth(app);

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
              width={100}
              height={100}
              src="https://avatars.githubusercontent.com/u/16260732?s=200&v=4"
              alt="Kurum Logo"
              onClick={() => Router.push("/")}
            />
            <p className="text-xl font-bold mx-10">Açık kaynak</p>
          </div>

          <div>
            <Link
              href={"/stk/profile"}
              className="text-center text-pink-600 font-bold mr-10"
            >
              Profilin
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
        </div>
      )}
    </div>
  );
}
