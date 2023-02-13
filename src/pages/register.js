import { useState, useEffect, useContext } from "react";
import { app } from "@/src/firebase-config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Button, Textarea, Input, Checkbox } from "@material-tailwind/react";
import { db } from "@/src/firebase-config";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { UserContext } from "@/src/context/UserContext";
import toast from "react-hot-toast";
import Router from "next/router";
import Link from "next/link";
import places from "./places.json" assert { type: "json" };

const auth = getAuth(app);

export default function Register() {
  const userRef = collection(db, "users");
  const { setAuthProfileData } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [cities, setCities] = useState([]);
  const [towns, setTowns] = useState([]);

  const [checkedSkills, setCheckedSkills] = useState([]);
  const [checkedLanguages, setCheckedLanguage] = useState([]);
  const [checkedCertificates, setCheckedCertificates] = useState([]);
  const [checkedConsent, setCheckedConsents] = useState([]);

  const [info, setUserInfo] = useState({
    role: "volunteer",
  });

  useEffect(() => {
    setCities(places);
  }, []);

  useEffect(() => {
    cities &&
      cities.find(
        (city) => city.name === info?.location && setTowns(city.towns)
      );
  }, [info?.location]);

  useEffect(() => {
    setUserInfo({
      ...info,
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
  };

  const registerSTK = async (email, password) => {
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
        { ...info, uid: user.uid, email: user.email, appliedCalls: [] },
        { merge: true }
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerSTK(email, password).then((e) => {
      if (e?.accessToken) {
        addUser(e);
        Router.push("/profile");
      }
    });
  };

  const handleProfileInputChange = (e) => {
    setUserInfo({ ...info, [e.target.name]: e.target.value });
  };

  const skills = [
    "ilk yardım",
    "nakliye",
    "eğitim",
    "çadır kurulumu",
    "yemek hazırlık",
    "saha görevlisi",
    "psikolojik destek",
    "yazılım",
    "tamir",
    "tercümanlık",
    "temizlik",
  ];

  const language_spoken = [
    "Türkçe",
    "İngilizce",
    "Arapça",
    "İspanyola",
    "Fransızca",
    "Japonca",
    "Portekizce",
    "Rusça",
  ];

  const certificates = ["Ehliyet", "İlk yardım eğitimi", "AKUT/AFAD eğitimi"];

  const consents = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  ];

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
    <div className="m-10 lg:mx-36 space-y-10 mb-10">
      <p className="text-4xl font-bold">Gönüllü Profilini Oluştur</p>
      <p className="text-gray-500 text-xs py-2">Tüm alanlar doldurulmalıdır.</p>
      <p className="text-2xl text-gray-400 font-bold my-5">Genel Bilgiler</p>
      <form className="max-w-xl grid gap-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-between space-x-2">
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
          <select
            name="location"
            onChange={handleProfileInputChange}
            className="border-gray-400 rounded-md w-full mr-2"
          >
            {places.map((city) => {
              return (
                <option key={city.index} value={city.name}>
                  {city.name}
                </option>
              );
            })}
          </select>
          <select
            name="town"
            onChange={handleProfileInputChange}
            className="border-gray-400 rounded-md w-full"
          >
            {towns &&
              towns.map((town) => {
                return (
                  <option key={town.index} value={town.name}>
                    {town.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="flex justify-between space-x-2">
          <select
            name="gender"
            className="border-gray-400 rounded-md w-full mr-2"
            onChange={handleProfileInputChange}
          >
            <option value="woman" key="1">Kadın</option>
            <option value="man" key="2">Erkek</option>
            <option value="not" key="3">Belirtmek istemiyorum</option>
          </select>
          <select
            name="age"
            className="border-gray-400 rounded-md w-full mr-2"
            onChange={handleProfileInputChange}
          >
            <option value="18 -25" key="1">18 -25</option>
            <option value="25-45" key="2">25-45</option>
            <option value="45 +" key="3">45 +</option>
          </select>
          <select
            name="blood"
            className="border-gray-400 rounded-md w-full mr-2"
            onChange={handleProfileInputChange}
          >
            {bloodTypes.map((blood) => {
              return (
                <option key={blood} value={blood}>
                  {blood}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex justify-between space-x-2">
          <Input
            variant="outlined"
            label="Şifre"
            name="password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="text-2xl text-gray-400 font-bold my-5">Yetkinlikler</p>

        <p className="text-gray-400 font-bold my-5">Aranılan Yetenekler</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {skills.map((skill, index) => {
            return (
              <div className="flex min-w-fit items-center" key={index}>
                <Checkbox
                  name="skills"
                  type="checkbox"
                  value={skill}
                  onChange={handleSkillCheck}
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

        <p className="text-gray-400 font-bold my-5">Konuşulan Diller</p>
        <div className="grid grid-cols-3 gap-3 mb-10">
          {language_spoken.map((languages, index) => {
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
              <div className="flex flex-row min-w-fit items-center" key={index}>
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
            Acil Durum İletişim Bilgileri
          </p>
          <div className="flex justify-between space-x-2">
            <Input
              variant="outlined"
              label="İsim Soyisim"
              name="emercengyName"
              value={info?.emercengyName}
              onChange={(e) => handleProfileInputChange(e)}
            />
            <Input
              variant="outlined"
              label="Telefon"
              name="emercengyPhone"
              value={info?.emercengyPhone}
              onChange={(e) => handleProfileInputChange(e)}
            />
          </div>
        </div>

        <div className="my-10">
          {consents.map((consent, index) => {
            return (
              <div className="flex flex-row min-w-fit items-center" key={index}>
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
        </div>

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
