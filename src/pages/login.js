import Router from "next/router";
import { useState, useEffect, useContext } from "react";

import { UserContext } from "@/src/context/UserContext";
import { app } from "@/src/firebase-config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { Button, Textarea, Input } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const auth = getAuth(app);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { authProfileData, setAuthProfileData } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("Lütfen e-mailinizi giriniz."),
      password: Yup.string()
        .required("Lütfen şifre giriniz.")
        .min(6, "Şifreniz minimum 6 karakterden oluşmalıdır.")
    }),
    onSubmit: async function (values) {
      await loginSTK(values.email, values.password).then((e) => {
        if (e?.accessToken) {
          Router.push("/profile");
        }
      });
    },
  });

  const loginSTK = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setAuthProfileData(user);

      return user;
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="m-10 lg:mx-36 space-y-10">
      <form
        className="max-w-xl mx-auto grid gap-y-4"
        onSubmit={formik.handleSubmit}
      >
        <p className="text-4xl font-bold">Kurum Girişi</p>
        <p className="text-gray-500 text-xs py-2">
          Tüm alanlar doldurulmalıdır.
        </p>
        <div>
          <Input
            label="E-mail"
            type="email"
            name="email"
            id="email"
            className={`block w-full rounded border py-1 px-2 ${
              formik.touched.email && formik.errors.email
                ? "border-red-400"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-400">{formik.errors.email}</span>
          )}
        </div>
        <div>
          <Input
            type="password"
            label="Şifre"
            name="password"
            id="password"
            className={`block w-full rounded border py-1 px-2 ${
              formik.touched.password && formik.errors.password
                ? "border-red-400"
                : "border-gray-300"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <span className="text-red-400">{formik.errors.password}</span>
          )}
        </div>

        <Button className="w-36 right-0 my-5" type="submit" color="gray">
          Giriş yap
        </Button>
      </form>
    </div>
  );
}
