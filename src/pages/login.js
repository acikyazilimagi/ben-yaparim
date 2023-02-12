import Router from "next/router";
import { useState, useEffect, useContext } from "react";
import { Button, Textarea, Input } from "@material-tailwind/react";
import { UserContext } from "@/src/context/UserContext";

import { app } from "@/src/firebase-config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import toast from "react-hot-toast";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { stkProfile, setSdkProfile } = useContext(UserContext);

  const loginSTK = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setSdkProfile(user);

      return user;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginSTK(email, password).then((e) => {
      if (e.accessToken) {
        Router.push("/stk/profile");
      }
    });
  };

  return (
    <div>
      <form className="max-w-xl mx-auto grid gap-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          variant="outlined"
          label="E-mail"
          name="name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          variant="outlined"
          label="Şifre"
          name="name"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={!email || !password}
          className="primary disabled:opacity-20 bg-purple-400 hover:bg-purple-600"
          type="submit"
        >
          Giriş yap
        </button>
      </form>
    </div>
  );
}
