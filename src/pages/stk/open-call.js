import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";

import { Button, Textarea, Input } from "@material-tailwind/react";
import { addCall } from "@/src/firebase/calls";
import { CallContext } from "src/context/CallContext";
import { DateRange } from "react-date-range";
import { UserContext } from "@/src/context/UserContext";
import Location from "@/components/icons/Location";
import Calendar from "@/components/icons/Calendar";
import People from "@/components/icons/People";
import { Checkbox } from "@material-tailwind/react";

import places from "../places.json" assert { type: "json" };
import skills from "../skills.json" assert { type: "json" };
import spokenLanguages from "../spokenLanguages.json" assert { type: "json" };
import consents from "../consents.json" assert { type: "json" };
import certificates from "../certificates.json" assert { type: "json" };

import { useFormik } from "formik";
import * as Yup from "yup";

export default function OpenCall() {
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [checkedLanguages, setCheckedLanguage] = useState([]);
  const [checkedCertificates, setCheckedCertificates] = useState([]);
  const [checkedFacilities, setCheckedFacilities] = useState([]);

  const [cities, setCities] = useState([]);
  const [towns, setTowns] = useState([]);

  const { callInput, setCallInput } = useContext(CallContext);

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      town: "",
      needOfVolunteer: 0,
      precondition: "",
      otherSkills: "",
      startDate: date[0].startDate,
      notes: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Lütfen görev başlığını giriniz."),
      description: Yup.string().required("Lütfen görev açıklaması giriniz."),
      location: Yup.string().required("Lütfen görev yapılacak ili seçiniz."),
      town: Yup.string().required("Lütfen görev yapılacak ilçeyi seçiniz."),
      needOfVolunteer: Yup.number("Lütfen sayı formatında giriş yapınız")
        .min(1, "Gönüllü sayısı sıfır veya negatif olamaz.")
        .required("Lütfen ihtiyaç duyduğunuz gönüllü sayısını belirtiniz."),
      precondition: Yup.string(),
      otherSkills: Yup.string(),
      startDate: Yup.date()
        .min(new Date(), "Lütfen gelecek bir tarih için planlama yapın.")
        .required("Lütfen geçerli bir başlangıç tarihi seçin"),
      notes: Yup.string(),
    }),
    onSubmit: async function (values) {
      addCall({
        ...values,
        ...callInput,
        isActive: true,
      });
      setCallInput({});
      Router.push("/stk/profile");
    },
  });
  useEffect(() => {
    setCities(places);
  }, []);

  useEffect(() => {
    setCallInput({
      ...callInput,
      date: date[0],
    });
    formik.values.startDate = date[0].startDate;
  }, [date]);

  useEffect(() => {
    cities &&
      cities.find(
        (city) => city.name === formik.values?.location && setTowns(city.towns)
      );
  }, [formik.values?.location]);

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

  const facilities = ["Yol Masrafı", "Konaklama", "Yemek"];

  return (
    <div className="m-10 lg:mx-36 pb-10">
      <form onSubmit={formik.handleSubmit}>
        <div className="">
          <h1 className="text-4xl mb-10 font-bold">Yeni Çağrı Oluştur</h1>

          <div className="pb-10">
            <p className="text-gray-400 font-bold my-3">Genel Bilgiler</p>
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="max-w-xl lg:w-1/2 space-y-5">
                <div className="w-full">
                  <Input
                    variant="outlined"
                    label="Başlık*"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <span className="text-red-400 text-sm">
                      {formik.errors.title}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <Textarea
                    variant="outlined"
                    label="Açıklama*"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <span className="text-red-400 text-sm">
                      {formik.errors.description}
                    </span>
                  )}
                </div>
                <Textarea
                  variant="outlined"
                  label="Ön koşul ve beklenen çalışma frekansı"
                  name="precondition"
                  value={formik.values.precondition}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="max-w-xl lg:w-1/2 space-y-5">
                <div className="flex flex-start items-center space-x-3">
                  <Location />
                  <p className="">Faliyet Lokasyonu*</p>
                </div>
                <div className="flex justify-between gap-x-2">
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
                <div className="flex flex-start items-center space-x-3">
                  <Calendar />
                  <p className="">Faaliyet Tarihleri*</p>
                </div>
                <div className="w-full">
                  <DateRange
                    className="min-w-full"
                    editableDateInputs={true}
                    onChange={(item) => setDate([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <span className="text-red-400 text-sm">
                      {formik.errors.date}
                    </span>
                  )}
                </div>
                <div className="flex flex-start items-center space-x-3">
                  <People />
                  <p className="">Aranan Gönüllü Sayısı</p>
                </div>
                <div className="w-full">
                  <Input
                    variant="outlined"
                    label="Sayı*"
                    name="needOfVolunteer"
                    type="number"
                    min={0}
                    value={formik.values.needOfVolunteer}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.needOfVolunteer &&
                    formik.errors.needOfVolunteer && (
                      <span className="text-red-400 text-sm">
                        {formik.errors.needOfVolunteer}
                      </span>
                    )}
                </div>
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
              value={formik.values.otherSkills}
              onChange={formik.handleChange}
            />
          </div>

          <p className="text-gray-400 font-bold my-5">Konuşulan Diller</p>
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
            value={formik.values.notes}
            onChange={formik.handleChange}
          />

          <div className="flex justify-end gap-x-3">
            <Button disabled>Kaydet</Button>

            <Button color="pink" type="submit">
              Yayınla
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
