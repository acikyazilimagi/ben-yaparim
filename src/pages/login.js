import Router from "next/router";
import { useState, useContext } from "react";
import { Button, Input } from "@material-tailwind/react";
import { UserContext } from "@/src/context/UserContext";
import { app } from "@/src/firebase-config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import toast from "react-hot-toast";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { autProfileData, setAuthProfileData } = useContext(UserContext);

  const loginSTK = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setAuthProfileData(user);

      return user;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginSTK(email, password).then((e) => {
      if (e?.accessToken) {
        Router.push("/profile");
      }
    });
  };

  return (
    <div className="m-10 lg:mx-36 space-y-10">
      <form className="max-w-xl mx-auto grid gap-y-4" onSubmit={handleSubmit}>
        <p className="text-4xl font-bold">Giriş</p>
        <p className="text-gray-500 text-xs py-2" >Tüm alanlar doldurulmalıdır.</p>
        <Input
          label="E-mail"
          name="name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          label="Şifre"
          name="name"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          disabled={!email || !password}
          className="w-36 right-0 my-5"
          type="submit"
          color="gray"
        >
          Giriş yap
        </Button>

        <Link
          href={"/register"}
          className="text-center text-pink-600 font-bold hover:text-pink-800"
        >
          Hesabın yok mu? Kayıt ol.
        </Link>
      </form>
    </div>
  );
}
