import { useState, useContext } from "react";
import { app } from "@/src/firebase-config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, Textarea, Input } from "@material-tailwind/react";
import { db } from "@/src/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { UserContext } from "@/src/context/UserContext";
import toast from "react-hot-toast";

import Router from "next/router";
import Link from "next/link";

const auth = getAuth(app);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [info, setUserInfo] = useState({
    role: "volunteer",
  });

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
  console.log("info", info);

  const addUser = async (user) => {
    try {
      await addDoc(userRef, { ...info, uid: user.uid, email: user.email });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerSTK(email, password).then((e) => {
      if (e?.accessToken) {
        addUser(e);
        Router.push("/stk/profile");
      }
    });
  };

  const handleProfileInputChange = (e) => {
    setUserInfo({ ...info, [e.target.name]: e.target.value });
  };

  return (
    <div className="m-10 lg:mx-36 space-y-10">
      <p className="text-5xl font-bold my-10">Gönüllü Profilini Oluştur</p>
      <p className="text-base text-gray-600">Tüm alanlar doldurulmalıdır.</p>
      <p className="text-xl">Genel Bilgiler</p>
      <form className="max-w-xl grid gap-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between space-x-2">
          {" "}
          <Input
            variant="outlined"
            label="İsim"
            name="name"
            value={info?.name}
            onChange={(e) => handleProfileInputChange(e)}
          />
          <Input
            variant="outlined"
            label="Soyisim"
            name="surname"
            value={info?.surname}
            onChange={(e) => handleProfileInputChange(e)}
          />
        </div>
        <div className="flex justify-between space-x-2">
          <Input
            variant="outlined"
            label="Telefon"
            name="phone"
            value={info?.phone}
            onChange={(e) => handleProfileInputChange(e)}
          />
          <Input
            variant="outlined"
            label="E-mail"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-between space-x-2">
          <Input
            variant="outlined"
            label="Şifre"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            variant="outlined"
            label="Şifre tekrar"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="text-xl">Yetkinlikler</p>
        <p className="text-xl">Acil Durum Kontak Bilgileri</p>
        {/* <div className="flex justify-between space-x-2">
          <Input
            variant="outlined"
            label="İsim"
            name="contactName"
            value={info?.contactName}
            onChange={(e) => handleProfileInputChange(e.target.value)}
          />
          <Input
            variant="outlined"
            label="Soyisim"
            name="contactSurname"
            value={info?.contactSurname}
            onChange={(e) => handleProfileInputChange(e.target.value)}
          />
          <Input
            variant="outlined"
            label="Telefon"
            name="contactPhone"
            value={info?.contactPhone}
            onChange={(e) => handleProfileInputChange(e.target.value)}
          />
        </div> */}

        <Button color="gray" type="submit" disabled={!email || !password}>
          Kayıt ol
        </Button>
        <Link
          href={"/login"}
          className="text-center text-pink-600 font-bold hover:text-pink-800"
        >
          Zaten Kaydın Var mı? Giriş Yap.
        </Link>
      </form>
    </div>
  );
}
