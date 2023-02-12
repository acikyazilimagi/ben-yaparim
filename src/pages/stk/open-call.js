import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";

import {
  Button,
  Textarea,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";

import { CallContext } from "src/context/CallContext";
import { DateRange } from "react-date-range";
import { UserContext } from "@/src/context/UserContext";

import { app } from "@/src/firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

export default function OpenCall() {
  const { callInput, setCallInput, createNewCall, getCalls } =
    useContext(CallContext);

  const handleInputChange = (e) => {
    setCallInput({ ...callInput, value: value });
  };

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    setCallInput({
      ...callInput,
      date: date[0],
    });
  }, [date]);

  const createCall = () => {
    createNewCall();
    setCallInput({});
    getCalls();
    Router.push("/stk/profile");
  };

  const { value, setValue } = useContext(UserContext);

  useEffect(() => {
    onAuthStateChanged(auth, (value) => {
      if (value) {
        console.log(auth.currentUser);
      } else {
        Router.push("/");
      }
    });
  }, [value]);

  const skills = [
    ["ilk yardım", "#FFDCDC"],
    ["yemek hazırlık", "#FFD66E"],
    ["tamir", "#72DDC3"],
    ["nakliye", "#CFDFFF"],
    ["saha görevlisi", "#93E088"],
    ["tercümanlık", "#9CC7FF"],
    ["eğitim", "#FADCFF"],
    ["psikolojik destek", "#C2F5E9"],
    ["temizlik", "#D1F7C4"],
    ["çadır kurulumu", "#FFC7BB"],
    ["yazılım", "#E5DCF9"],
  ];

  const language_spoken = ["Türkçe", "İngilizce", "Arapça", "İspanyola", "Fransızca", "Japonca", "Portekizce", "Rusça"];
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
              <Select
                label="Konum"
                name="location"
                value={callInput.location}
                onChange={(e) => handleInputChange(e)}
              >
                <Option>Material Tailwind HTML</Option>
                <Option>Material Tailwind React</Option>
                <Option>Material Tailwind Vue</Option>
                <Option>Material Tailwind Angular</Option>
                <Option>Material Tailwind Svelte</Option>
              </Select>

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
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-400 font-bold my-3">Aranılan Yetenekler</p>
      <div className="grid grid-cols-4 gap-3 pb-3">
        {skills.map((skill) => {
          return (
            <div className="flex min-w-fit items-center">
              <input
                type="checkbox"
                value={skill}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
              />
              <label
                for="checked-checkbox"
                className="ml-2 p-1 text-sm font-medium w-28"
                style={{ backgroundColor: skill[1] }}
              >
                {skill[0]}
              </label>
            </div>
          );
        })}
      </div>

      <p className="text-gray-400 font-bold pt-6">Konuşulan Diller</p>
      <div className="grid grid-cols-4 gap-3 pb-3">
        {language_spoken.map((languages) => {
          return (
            <div className="flex min-w-fit items-center">
              <input
                type="checkbox"
                value={languages}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
              />
              <label
                for="checked-checkbox"
                className="ml-2 p-1 text-sm font-medium w-28"
              >
                {languages}
              </label>
            </div>
          );
        })}
      </div>

      <p className="text-gray-400 font-bold pt-6">Yetkinlikler</p>
      <div className="grid grid-cols-1 gap-3 pb-3">
        {certificates.map((certificate) => {
          return (
            <div className="flex min-w-fit items-center">
              <input
                type="checkbox"
                value={certificate}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
              />
              <label
                for="checked-checkbox"
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
        {facilities.map((facility) => {
          return (
            <div className="flex min-w-fit items-center">
              <input
                type="checkbox"
                value={facility}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray"
              />
              <label
                for="checked-checkbox"
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
        value={callInput.notes}
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
