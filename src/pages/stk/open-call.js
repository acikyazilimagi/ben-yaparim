import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";

import { Button, Textarea, Input, Checkbox } from "@material-tailwind/react";

import { CallContext } from "src/context/CallContext";
import { DateRange } from "react-date-range";
import { UserContext } from "@/src/context/UserContext";

import { app } from "@/src/firebase-config";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

export default function OpenCall() {
  const { callInput, setCallInput, createNewCall } = useContext(CallContext);

  const handleInputChange = (e) => {
    setCallInput({ ...callInput, [e.target.name]: e.target.value });
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
    Router.push('/stk/profile')
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
    "ilk yardım",
    "yemek hazırlık",
    "tercümanlık",
    "eğitim",
    "psikolojik destek",
    "tamir",
    "temizlik",
    "yazılım",
    "diğer",
  ];

  return (
    <div className="border border-gray-200 mx-[6%] px-[2%] p-10 justify-start  bg-background space-y-3">
      <h1 className="text-4xl mb-10 font-bold">Çağrını Oluştur</h1>
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
      <div className="flex justify-start gap-x-10">
        <div className="w-1/2">
          <label>Faaliyet Tarihleri</label>
          <DateRange
            className="min-w-full"
            editableDateInputs={true}
            onChange={(item) => setDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={date}
          />
        </div>

        <div className="w-1/2">
          <label>Lokasyon</label>
          <Input
            variant="outlined"
            label="Konum"
            name="location"
            value={callInput.location}
            onChange={(e) => handleInputChange(e)}
          />
        </div>
      </div>

      <label>İstenilen Yetenekler</label>
      <div className="grid grid-cols-3 gap-2">
        {skills.map((skill) => {
          return (
            <div className="flex min-w-fit items-center">
              <input
                type="checkbox"
                value={skill}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray"
              />
              <label
                for="checked-checkbox"
                class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {skill}
              </label>
            </div>
          );
        })}
      </div>

      <div>
        <label>Lokasyon</label>
        <Input
          variant="outlined"
          label="Gönüllü Sayısı"
          name="needOfVolunteer"
          type="number"
          value={callInput.needOfVolunteer}
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      <Textarea
        variant="outlined"
        label="Notlar"
        name="notes"
        value={callInput.notes}
        onChange={(e) => handleInputChange(e)}
      />

      <Button variant="outlined" onClick={createCall}>
        Çağrı Oluştur
      </Button>
    </div>
  );
}
