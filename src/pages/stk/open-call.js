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
import Location from "@/components/icons/Location";
import Calendar from "@/components/icons/Calendar";
import People from "@/components/icons/People";
import { Checkbox } from "@material-tailwind/react";

const auth = getAuth(app);

export default function OpenCall() {
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [checkedLanguages, setCheckedLanguage] = useState([]);
  const [checkedCertificates, setCheckedCertificates] = useState([]);
  const [checkedFacilities, setCheckedFacilities] = useState([]);

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
      checkedFacilities: checkedFacilities,
    });
  }, [checkedSkills, checkedLanguages, checkedCertificates, checkedFacilities]);

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

  const handleFacilitiesCheck = (event) => {
    let updatedList = [...checkedFacilities];
    if (event.target.checked) {
      updatedList = [...checkedFacilities, event.target.value];
    } else {
      updatedList?.splice(checkedFacilities.indexOf(event.target.value), 1);
    }
    setCheckedFacilities(updatedList);
  };

  const createCall = (event) => {
    event.preventDefault();
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
  const facilities = ["Yol Masrafı", "Konaklama", "Yemek"];

  return (
    <div className="m-10 lg:mx-36 pb-10">
      <form onSubmit={createCall}>
        <div className="">
          <h1 className="text-4xl mb-10 font-bold">Yeni Çağrı Oluştur</h1>

          <div className="pb-10">
            <p className="text-gray-400 font-bold my-3">Genel Bilgiler</p>
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="max-w-xl lg:w-1/2 space-y-5">
                <Input
                  required
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
              <div className="max-w-xl lg:w-1/2 space-y-5">
                <div className="flex flex-start items-center space-x-3">
                  <Location />
                  <p className="">Faliyet Lokasyonu</p>
                </div>
                ...
                <div className="flex flex-start items-center space-x-3">
                  <Calendar />
                  <p className="">Faaliyet Tarihleri</p>
                </div>
                <DateRange
                  className="min-w-full"
                  editableDateInputs={true}
                  onChange={(item) => setDate([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={date}
                />
                <div className="flex flex-start items-center space-x-3">
                  <People />
                  <p className="">Aranan Gönüllü Sayısı</p>
                </div>
                <Input
                  variant="outlined"
                  label="Sayı"
                  name="needOfVolunteer"
                  type="number"
                  min={0}
                  value={callInput.needOfVolunteer}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
          </div>

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
              value={callInput.otherSkills}
              onChange={(e) => handleInputChange(e)}
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

          <p className="text-gray-400 font-bold my-5">Sağlanan İmkanlar</p>
          <div className="grid grid-cols-3 gap-3 mb-10">
            {facilities.map((facility, index) => {
              return (
                <div className="flex min-w-fit items-center" key={index}>
                  <Checkbox
                    name="facilities"
                    type="checkbox"
                    value={facility}
                    onChange={handleFacilitiesCheck}
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="text-sm font-medium w-full"
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
            className="mb-10"
            value={callInput?.notes}
            onChange={(e) => handleInputChange(e)}
          />

          <div className="flex justify-end gap-x-3">
            <Button disabled>Kaydet</Button>

            <Button color="pink" type="submit" onClick={createCall}>
              Yayınla
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
