import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";

import {
  Button,
  Textarea,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { addCall } from "@/src/firebase/calls";
import { CallContext } from "src/context/CallContext";
import { DateRange } from "react-date-range";
import { UserContext } from "@/src/context/UserContext";
import { app } from "@/src/firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import places from "../places" assert { type: "json" };

const auth = getAuth(app);

export default function OpenCall() {
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [checkedLanguages, setCheckedLanguage] = useState([]);
  const [checkedCertificates, setCheckedCertificates] = useState([]);

  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(places);
  }, []);

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const { callInput, setCallInput } = useContext(CallContext);
  const { autProfileData } = useContext(UserContext);

  const handleInputChange = (e) => {
    setCallInput({ ...callInput, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setCallInput({
      ...callInput,
      date: date[0],
    });
  }, [date]);

  useEffect(() => {
    setCallInput({
      ...callInput,
      checkedSkills: checkedSkills,
      checkedLanguages: checkedLanguages,
      checkedCertificates: checkedCertificates,
    });
  }, [checkedSkills, checkedLanguages, checkedCertificates]);

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
      updatedList.splice(checkedLanguages.indexOf(event.target.value), 1);
    }
    setCheckedLanguage(updatedList);
  };

  const handleCertificateCheck = (event) => {
    let updatedList = [...checkedCertificates];
    if (event.target.checked) {
      updatedList = [...checkedCertificates, event.target.value];
    } else {
      updatedList.splice(checkedCertificates.indexOf(event.target.value), 1);
    }
    setCheckedCertificates(updatedList);
  };

  const createCall = () => {
    addCall(callInput);
    Router.push("/stk/profile");
  };

  useEffect(() => {
    onAuthStateChanged(auth, (value) => {
      if (value) {
        //console.log(auth.currentUser);
      } else {
        Router.push("/");
      }
    });
  }, [autProfileData]);

  const skills = [
    "ilk yardım",
    "yemek hazırlık",
    "tamir",
    "nakliye",
    "saha görevlisi",
    "tercümanlık",
    "eğitim",
    "psikolojik destek",
    "temizlik",
    "çadır kurulumu",
    "yazılım",
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
  const facilities = ["Yol Masrafı", "Konaklama", "Yemek"];

  return (
    <div className="border border-gray-200 mx-[6%] px-[2%] p-10 justify-start  bg-background space-y-3">
      <h1 className="text-4xl mb-10 font-bold">Yeni Çağrı Oluştur</h1>

      <div className="pb-10">
        <p className="text-gray-400 font-bold my-3">Genel Bilgiler</p>
        <div className="flex justify-between gap-x-20">
          <div className="w-1/2 grid gap-y-3">
            <Input
              variant="outlined"
              label="Başlık"
              name="title"
              value={callInput.title}
              onChange={(e) => handleInputChange(e)}
            />
            <Textarea
              variant="outlined"
              label="Açıklama"
              name="description"
              value={callInput.description}
              onChange={(e) => handleInputChange(e)}
            />
            <Textarea
              variant="outlined"
              label="Ön koşul ve beklenen çalışma frekansı"
              name="precondition"
              value={callInput.precondition}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className="w-1/2">
            <div className="grid gap-y-3">
              <div className="flex gap-x-2">
                <Select
                  label="Şehir"
                  name="location"
                  value={callInput.location}
                  onChange={(e) => handleInputChange(e)}
                >
                  {places.map((city) => {
                    return (
                      <Option name="location" key={city.index}>
                        {city.name}
                      </Option>
                    );
                  })}
                </Select>
                
                {/*TODO this shoul map selected_place*/} 
                <Select
                  label="İlçe"
                  name="location"
                  value={callInput.location}
                  onChange={(e) => handleInputChange(e)}
                >
                  {places.map((city) => {
                    return (
                      <Option name="location" key={city.index}>
                        {city.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
              <label>Faaliyet Tarihleri</label>
              <DateRange
                className="min-w-full"
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
              />

              <Input
                variant="outlined"
                label="Gönüllü İhtiyacı (sayı)"
                name="needOfVolunteer"
                type="number"
                min={0}
                value={callInput.needOfVolunteer}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-400 font-bold my-3">Aranılan Yetenekler</p>
      <div className="grid grid-cols-4 gap-3 pb-3">
        {skills.map((skill, index) => {
          return (
            <div className="flex min-w-fit items-center" key={index}>
              <input
                name="skills"
                type="checkbox"
                value={skill}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
                onChange={handleSkillCheck}
              />
              <label
                htmlFor="checked-checkbox"
                className="ml-2 p-1 text-sm font-medium w-28"
              >
                {skill}
              </label>
            </div>
          );
        })}
      </div>

      <p className="text-gray-400 font-bold pt-6">Konuşulan Diller</p>
      <div className="grid grid-cols-4 gap-3 pb-3">
        {language_spoken.map((languages, index) => {
          return (
            <div className="flex min-w-fit items-center" key={index}>
              <input
                name="languages"
                type="checkbox"
                value={languages}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
                onChange={handleLanguageCheck}
              />
              <label
                htmlFor="checked-checkbox"
                className="ml-2 p-1 text-sm font-medium w-28"
              >
                {languages}
              </label>
            </div>
          );
        })}
      </div>

      <p className="text-gray-400 font-bold pt-6">Sertifikalar</p>
      <div className="grid grid-cols-1 gap-3 pb-3">
        {certificates.map((certificate, index) => {
          return (
            <div className="flex min-w-fit items-center" key={index}>
              <input
                name="certificates"
                type="checkbox"
                value={certificate}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
                onChange={handleCertificateCheck}
              />
              <label
                htmlFor="checked-checkbox"
                className="ml-2 p-1 text-sm font-medium w-full"
              >
                {certificate}
              </label>
            </div>
          );
        })}
      </div>

      <p className="text-gray-400 font-bold pt-6">Sağlanan İmkanlar</p>
      <div className="grid grid-cols-1 gap-3 pb-3">
        {facilities.map((facility, index) => {
          return (
            <div className="flex min-w-fit items-center" key={index}>
              <input
                name="facilities"
                type="checkbox"
                value={facility}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
              />
              <label
                htmlFor="checked-checkbox"
                className="ml-2 p-1 text-sm font-medium w-full"
              >
                {facility}
              </label>
            </div>
          );
        })}
      </div>

      <Textarea
        variant="outlined"
        label="Notlar"
        name="notes"
        value={callInput?.notes}
        onChange={(e) => handleInputChange(e)}
      />

      <div className="flex justify-end gap-x-3">
        <Button disabled variant="outlined">
          Kaydet
        </Button>

        <Button variant="outlined" onClick={createCall}>
          Çağrı Oluştur
        </Button>
      </div>
    </div>
  );
}
