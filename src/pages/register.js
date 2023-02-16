import { useState, useEffect, useContext } from "react";
import { app, db } from "@/src/firebase-config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { collection, setDoc, doc } from "firebase/firestore";
import { UserContext } from "@/src/context/UserContext";

import Router from "next/router";
import Link from "next/link";

import places from "./places.json" assert { type: "json" };
import skills from "./skills.json" assert { type: "json" };
import spokenLanguages from "./spokenLanguages.json" assert { type: "json" };
import consents from "./consents.json" assert { type: "json" };
import certificates from "./certificates.json" assert { type: "json" };

import { Button, Input, Checkbox } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const auth = getAuth(app);

export default function Register() {
  const { setAuthProfileData } = useContext(UserContext);

  const [cities, setCities] = useState([]);
  const [towns, setTowns] = useState([]);

  const [checkedSkills, setCheckedSkills] = useState([]);
  const [checkedLanguages, setCheckedLanguage] = useState([]);
  const [checkedCertificates, setCheckedCertificates] = useState([]);
  const [checkedConsent, setCheckedConsents] = useState([]);

  const [info, setUserInfo] = useState({});

  const formik = useFormik({
    initialValues: {
      role: "volunteer",
      name: "",
      surname: "",
      phone: "",
      email: "",
      location: "",
      town: "",
      gender: "",
      age: "",
      blood: "",
      skills: [],
      languages: [],
      password: "",
      emergencycontactname: "",
      emergencycontactphone: "",
      consents: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Lütfen adınızı giriniz."),
      surname: Yup.string().required("Lütfen soyadınızı giriniz."),
      phone: Yup.string()
        .required("Lütfen cep telefon numaranızı giriniz.")
        .min(
          10,
          "Cep telefon numaranızı doğru formatta girdiğinizden emin olun."
        ),
      email: Yup.string()
        .email("Geçersiz bir e-mail girdiniz.")
        .required("Lütfen e-mailinizi giriniz."),
      location: Yup.string().required("Lütfen ilinizi seçiniz."),
      town: Yup.string().required("Lütfen ilçenizi seçiniz."),
      gender: Yup.string().required("Lütfen seçiniz."),
      age: Yup.string().required("Lütfen seçiniz."),
      blood: Yup.string().required("Lütfen seçiniz."),
      password: Yup.string()
        .required("Lütfen şifre giriniz.")
        .min(6, "Şifreniz minimum 6 karakterden oluşmalıdır."),
      skills: Yup.array()
        .min(1, "En az bir yetenek seçmeniz gerekmektedir.")
        .required(),
      languages: Yup.array().min(1, "En az bir dil seçilmelidir.").required(),
      emergencycontactname: Yup.string().required(
        "Lütfen acil durumda ulaşılacak kişi bilgisi girin."
      ),
      emergencycontactphone: Yup.string().required(
        "Lütfen acil durumda ulaşılacak kişi telefon bilgisi girin."
      ),
      consents: Yup.array()
        .min(2, "Tüm şart ve koşullara onay vermeniz gerekmektedir.")
        .required(),
    }),
    onSubmit: async function (values) {
      await registerUser(values.email, values.password).then((e) => {
        if (e?.accessToken) {
          addUser(e);
          Router.push("/profile");
        }
      });
    },
  });

  useEffect(() => {
    setCities(places);
  }, []);

  useEffect(() => {
    cities &&
      cities.find(
        (city) => city.name === formik?.values?.location && setTowns(city.towns)
      );
  }, [formik?.values.location]);

  useEffect(() => {
    setUserInfo({
      ...formik.values,
      checkedSkills: checkedSkills,
      checkedLanguages: checkedLanguages,
      checkedCertificates: checkedCertificates,
      checkedConsent: checkedConsent,
    });
  }, [checkedSkills, checkedLanguages, checkedCertificates, checkedConsent]);

  const handleSkillCheck = (event) => {
    let updatedList = [...checkedSkills];
    if (event.target.checked) {
      updatedList = [...checkedSkills, event.target.value];
    } else {
      updatedList.splice(checkedSkills.indexOf(event.target.value), 1);
    }
    formik.values.skills = updatedList;
    setCheckedSkills(updatedList);
  };

  const handleLanguageCheck = (event) => {
    let updatedList = [...checkedLanguages];
    if (event.target.checked) {
      updatedList = [...checkedLanguages, event.target.value];
    } else {
      updatedList?.splice(checkedLanguages.indexOf(event.target.value), 1);
    }
    setCheckedLanguage(updatedList);
    formik.values.languages = updatedList;
  };

  const handleCertificateCheck = (event) => {
    let updatedList = [...checkedCertificates];
    if (event.target.checked) {
      updatedList = [...checkedCertificates, event.target.value];
    } else {
      updatedList?.splice(checkedCertificates.indexOf(event.target.value), 1);
    }
    setCheckedCertificates(updatedList);
  };

  const handleConsentCheck = (event) => {
    let updatedList = [...checkedConsent];
    if (event.target.checked) {
      updatedList = [...checkedConsent, event.target.value];
    } else {
      updatedList?.splice(checkedConsent.indexOf(event.target.value), 1);
    }
    setCheckedConsents(updatedList);
    formik.values.consents = updatedList;
  };

  const registerUser = async (email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setAuthProfileData(user);
      return user;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const addUser = async (user) => {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...formik.values,
          uid: user.uid,
          email: user.email,
          appliedCalls: [],
        },
        { merge: true }
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const bloodTypes = [
    "A Pozittif",
    "A Negatif",
    "B Pozittif",
    "B Negatif",
    "AB Pozittif",
    "AB Negatif",
    "0 Pozittif",
    "O Negative",
  ];

  return (
    <div className="mr-20 lg:mx-36 space-y-10">
      <div className="w-1/2 m-auto">
        <p className="text-4xl font-bold">Gönüllü Profilini Oluştur</p>
        <p className="text-gray-500 text-xs py-2">
          Tüm alanlar doldurulmalıdır.
        </p>
        <p className="text-2xl text-gray-400 font-bold my-5">Genel Bilgiler</p>
        <form className="max-w-xl grid gap-y-4" onSubmit={formik.handleSubmit}>
          <div className="flex justify-between space-x-2">
            <div className="w-full">
              <Input
                variant="outlined"
                label="İsim*"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <span className="text-red-400 text-sm">
                  {formik.errors.name}
                </span>
              )}
            </div>
            <div className="w-full">
              <Input
                variant="outlined"
                label="Soyisminiz*"
                name="surname"
                value={formik.values.surname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.surname && formik.errors.surname && (
                <span className="text-red-400 text-sm">
                  {formik.errors.surname}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <div className="w-full">
              <Input
                variant="outlined"
                label="Telefon numaranız*"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <span className="text-red-400 text-sm">
                  {formik.errors.phone}
                </span>
              )}
            </div>
            <div className="w-full">
              <Input
                variant="outlined"
                label="E-mail adresiniz*"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-400 text-sm">
                  {formik.errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <div className="w-full">
              <select
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-400 rounded-md w-full mr-2"
              >
                <option value="" selected disabled hidden>
                  İl Seçiniz*
                </option>
                {places.map((city) => {
                  return (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  );
                })}
              </select>
              {formik.touched.location && formik.errors.location && (
                <span className="text-red-400 text-sm">
                  {formik.errors.location}
                </span>
              )}
            </div>

            <div className="w-full">
              <select
                name="town"
                value={formik.values.town}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-400 rounded-md w-full mr-2"
              >
                <option value="" selected disabled hidden>
                  İlçe Seçiniz*
                </option>
                {towns &&
                  towns.map((town) => {
                    return (
                      <option key={town.name} value={town.name}>
                        {town.name}
                      </option>
                    );
                  })}
              </select>
              {formik.touched.town && formik.errors.town && (
                <span className="text-red-400 text-sm">
                  {formik.errors.town}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between space-x-2">
            <div className="w-full">
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-gray-400 rounded-md w-full mr-2"
              >
                <option value="" selected disabled hidden>
                  Cinsiyet*
                </option>
                <option value="woman" key="1">
                  Kadın
                </option>
                <option value="man" key="2">
                  Erkek
                </option>
                <option value="not" key="3">
                  Belirtmek istemiyorum
                </option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <span className="text-red-400 text-sm">
                  {formik.errors.gender}
                </span>
              )}
            </div>

            <div className="w-full">
              <select
                name="age"
                className="border-gray-400 rounded-md w-full mr-2"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" selected disabled hidden>
                  Yaş aralığı*
                </option>
                <option value="18 -25" key="1">
                  18 -25
                </option>
                <option value="25-45" key="2">
                  25-45
                </option>
                <option value="45 +" key="3">
                  45 +
                </option>
              </select>
              {formik.touched.age && formik.errors.age && (
                <span className="text-red-400 text-sm">
                  {formik.errors.age}
                </span>
              )}
            </div>

            <div className="w-full">
              <select
                name="blood"
                className="border-gray-400 rounded-md w-full mr-2"
                value={formik.values.blood}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" selected disabled hidden>
                  Kan Grubu*
                </option>
                {bloodTypes.map((blood) => {
                  return (
                    <option key={blood} value={blood}>
                      {blood}
                    </option>
                  );
                })}
              </select>
              {formik.touched.blood && formik.errors.blood && (
                <span className="text-red-400 text-sm">
                  {formik.errors.blood}
                </span>
              )}
            </div>
          </div>

          <div className="w-full">
            <Input
              variant="outlined"
              label="Şifre*"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-400 text-sm">
                {formik.errors.password}
              </span>
            )}
          </div>

          <p className="text-2xl text-gray-400 font-bold my-5">Yetkinlikler</p>

          <p className="text-gray-400 font-bold my-5">Aranılan Yetenekler*</p>
          {formik.touched.skills && formik.errors.skills && (
            <span className="text-red-400 text-sm">{formik.errors.skills}</span>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {skills.map((skill, index) => {
              return (
                <div className="flex min-w-fit items-center" key={index}>
                  <Checkbox
                    value={skill}
                    onChange={handleSkillCheck}
                    name="skills"
                    type="checkbox"
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="text-sm font-medium w-28"
                  >
                    {skill}
                  </label>
                </div>
              );
            })}

            <Input
              variant="outlined"
              label="Diğer"
              name="otherSkills"
              className="max-w-xs"
              value={info?.otherSkills}
              onChange={(e) => handleProfileInputChange(e)}
            />
          </div>
          <p className="text-gray-400 font-bold my-5">Konuşulan Diller*</p>
          {formik.touched.languages && formik.errors.languages && (
            <span className="text-red-400 text-sm">
              {formik.errors.languages}
            </span>
          )}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {spokenLanguages.map((languages, index) => {
              return (
                <div className="flex min-w-fit items-center" key={index}>
                  <Checkbox
                    name="languages"
                    type="checkbox"
                    value={languages}
                    onChange={handleLanguageCheck}
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="text-sm font-medium w-28"
                  >
                    {languages}
                  </label>
                </div>
              );
            })}
          </div>

          <p className="text-gray-400 font-bold my-5">Sertifikalar</p>
          <div className="grid grid-cols-3 gap-3 mb-10">
            {certificates.map((certificate, index) => {
              return (
                <div
                  className="flex flex-row min-w-fit items-center"
                  key={index}
                >
                  <Checkbox
                    name="certificates"
                    type="checkbox"
                    value={certificate}
                    onChange={handleCertificateCheck}
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="text-sm font-medium w-full"
                  >
                    {certificate}
                  </label>
                </div>
              );
            })}
          </div>

          <div className="py-2">
            <p className="text-2xl text-gray-400 font-bold my-5">
              Acil Durum İletişim Bilgileri*
            </p>
            <div className="w-full space-y-4">
              <Input
                variant="outlined"
                label="İsim Soyisim"
                name="emergencycontactname"
                value={formik.values.emergencycontactname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.emergencycontactname &&
                formik.errors.emergencycontactname && (
                  <span className="text-red-400 text-sm">
                    {formik.errors.emergencycontactname}
                  </span>
                )}

              <Input
                variant="outlined"
                label="Telefon"
                name="emergencycontactphone"
                value={formik.values.emergencycontactphone}
                onChange={formik.handleChange}
              />

              {formik.touched.emergencycontactphone &&
                formik.errors.emergencycontactphone && (
                  <span className="text-red-400 text-sm">
                    {formik.errors.emergencycontactphone}
                  </span>
                )}
            </div>
          </div>

          <div className="my-10">
            {consents.map((consent, index) => {
              return (
                <div
                  className="flex flex-row min-w-fit items-center"
                  key={index}
                >
                  <Checkbox
                    name="consent"
                    type="checkbox"
                    value={consent}
                    onChange={handleConsentCheck}
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="text-sm w-full py-5"
                  >
                    {consent}
                  </label>
                </div>
              );
            })}
            {formik.touched.consents && formik.errors.consents && (
              <span className="text-red-400 text-sm">
                {formik.errors.consents}
              </span>
            )}
          </div>
          <div className="mb-10 flex flex-col justify-center items-center space-y-5">
            <Button color="gray" type="submit" className="w-36">
              Kayıt ol
            </Button>

            <Link
              href={"/login"}
              className="text-center text-pink-600 font-bold hover:text-pink-800"
            >
              Zaten Kaydın Var mı? Giriş Yap.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
