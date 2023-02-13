import Router from "next/router";
import { useState, useEffect, useContext } from "react";
import { Button, Textarea, Input } from "@material-tailwind/react";
import { UserContext } from "@/src/context/UserContext";
import { app } from "@/src/firebase-config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { Formik } from "formik";

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
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Geçerli bir e-mail addresi girin.";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit;
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ errors, touched, handleSubmit }) => (
          <form
            className="max-w-xl mx-auto grid gap-y-4"
            onSubmit={handleSubmit}
          >
            <p className="text-4xl font-bold">Kurum Girişi</p>
            <p className="text-gray-500 text-xs py-2">
              Tüm alanlar doldurulmalıdır.
            </p>
            {errors.email && touched.email && errors.email}
            <Input
              label="E-mail"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && touched.email && errors.email}
            <Input
              type="password"
              label="Şifre"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && touched.password && errors.password}
            <Button
              disabled={!email || !password}
              className="w-36 right-0 my-5"
              type="submit"
              color="gray"
            >
              Giriş yap
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}
