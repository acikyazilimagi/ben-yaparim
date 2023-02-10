import { useState, useEffect } from "react";
import Link from "next/link";

import { app } from "@/src/firebase-config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import toast from "react-hot-toast";

const auth = getAuth(app);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerSTK = async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return user;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerSTK(email, password);
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
