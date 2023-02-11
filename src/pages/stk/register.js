import { useState, useContext } from "react";
import { app } from "@/src/firebase-config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { db } from "@/src/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { UserContext } from "@/src/context/UserContext";

import toast from "react-hot-toast";
import Router from "next/router";

const auth = getAuth(app);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userRef = collection(db, "users");
  const { stkProfile, setSdkProfile } = useContext(UserContext);

  const registerSTK = async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setSdkProfile(user);
      return user;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const addUser = async (user) => {
    try {
      const info = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        needs: ["ilkyardim", "ehliyet"],
      };

      await addDoc(userRef, info);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerSTK(email, password).then((e) => {
      if (e.accessToken) {
        addUser(e);
        Router.push("/stk/profile");
      }
    });
  };

  return (
    <div>
      <form className="max-w-xl mx-auto grid gap-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-posta adresi
          </label>
          <div className="mt-1">
            <input
              type="email"
              placeholder="adin@örnek.com"
              className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Şifren
          </label>
          <div className="mt-1">
            <input
              type="password"
              placeholder="********"
              className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          disabled={!email || !password}
          className="primary disabled:opacity-20 bg-purple-400 hover:bg-purple-600"
          type="submit"
        >
          Kayıt ol
        </button>
      </form>
    </div>
  );
}
