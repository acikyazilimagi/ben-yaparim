import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/src/context/UserContext";
import { CallContext } from "src/context/CallContext";
import Router from "next/router";
import { Button, Textarea, Input, Checkbox } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import {
  getUserAppliedCalls,
  updateUser,
  getUserAppliedCallsData,
  getUser,
} from "@/src/firebase/users";
import Edit from "@/components/icons/Edit";
import ColorTag from "@/components/Tags/color-tag";
import LanguageTag from "@/components/Tags/language-tag";
import Check from "@/src/components/icons/Check";
import places from "./places.json" assert { type: "json" };
import skills from "./skills.json" assert { type: "json" };
import spokenLanguages from "./spokenLanguages.json" assert { type: "json" };
import certificates from "./certificates.json" assert { type: "json" };

import { useFormik } from "formik";
import * as Yup from "yup";

import { auth } from "@/src/firebase-config";

const renderAppliedCallContent = ({ calls, isOpen, profileData } = {}) => {
  const renderedCalls = calls?.filter((call) => {
    return isOpen ? call.isActive : !call.isActive;
  });
  return renderedCalls?.map((call) => {
    return (
      <Card
        key={call?.id}
        title={call?.title}
        description={call?.description}
        startDate={call?.date?.startDate}
        endDate={call?.date?.endDate}
        needOfVolunteer={call?.needOfVolunteer}
        location={call?.location}
        id={call?.id}
        checkedCertificates={call?.checkedCertificates}
        checkedLanguages={call?.checkedLanguages}
        checkedSkills={call?.checkedSkills}
        status={
          call?.applicants?.find(
            (applicant) => applicant?.uid === profileData?.uid
          )?.approvedStatus
        }
        applicants={call?.applicants}
      />
    );
  });
};

const Profile = () => {
  const { currentUser } = auth;
  const { updatedField, setUpdatedFields, profileData, setProfileData } =
    useContext(UserContext);
  const { callInput, setCallInput } = useContext(CallContext);
  const [profileModalStatus, toggleProfileModal] = useState(false);

  const [appliedCalls, setAppliedCalls] = useState([]);
  const [cities, setCities] = useState([]);
  const [towns, setTowns] = useState([]);

  const [checkedSkills, setCheckedSkills] = useState([]);
  const [checkedLanguages, setCheckedLanguage] = useState([]);
  const [checkedCertificates, setCheckedCertificates] = useState([]);
  const formik = useFormik({
    initialValues: {
      name: profileData?.name,
      surname: profileData?.surname,
      location: profileData?.location,
      town: profileData?.town,
      phone: profileData?.phone,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Lütfen isminizi giriniz."),
      surname: Yup.string().required("Lütfen soyisminizi giriniz."),
      location: Yup.string().required("Lütfen ilinizi seçiniz."),
      town: Yup.string().required("Lütfen ilçenizi seçiniz."),
      phone: Yup.string()
        .required("Lütfen cep telefon numaranızı giriniz.")
        .min(
          10,
          "Cep telefon numaranızı doğru formatta girdiğinizden emin olun."
        ),
    }),
    onSubmit: async function (values) {
      toggleProfileModal(false);
      await updateUser(profileData?.uid, {
        ...values,
        checkedSkills,
        checkedCertificates,
        checkedLanguages,
      });
      const updatedProfileData = await getUser(profileData?.uid);
      setProfileData(updatedProfileData);
    },
  });

  useEffect(() => {
    if (currentUser?.uid) {
      //TODO: MOVE THIS INTO FIREBASE FOLDER
      (async () => {
        const data = await getUserAppliedCalls(currentUser?.uid);
        if (data?.length) {
          await getUserAppliedCallsData(data).then((data) => {
            setAppliedCalls(data);
          });
        }
      })();
    }
  }, [currentUser]);

  const volunteerTabsData = [
    {
      label: "Aktif Başvurularım",
      value: "aktif",
      content: renderAppliedCallContent({ calls: appliedCalls, isOpen: true, profileData }),
    },
    {
      label: "Kapanmış Başvurularım",
      value: "kapali",
      content: renderAppliedCallContent({ calls: appliedCalls, isOpen: false, profileData }),
    },
  ];

  useEffect(() => {
    cities &&
      cities.find(
        (city) => city.name === formik?.values?.location && setTowns(city.towns)
      );
  }, [formik?.values?.location]);

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

  useEffect(() => {
    setCities(places);
  }, []);

  useEffect(() => {
    setUpdatedFields({
      ...formik.values,
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

  //TAILWIND LOADING
  if (!profileData) return <div></div>;

  if (profileData?.role === "admin") {
    Router.push("/stk/profile");
  }

  if (profileData?.role === "volunteer") {
    return (
      <div className="m-10 lg:mx-36">
        <div className="flex items-center">
          <p className="text-5xl font-bold mr-10">Gönüllü Profilim</p>
          <Edit className="w-6 h-6" />
          <button
            className="text-xs text-gray-600 mx-1 cursor-pointer"
            onClick={toggleProfileModal}
          >
            Düzenle
          </button>
        </div>
        <p className="text-xl font-bold text-gray-600 my-16">Genel Bilgiler</p>
        <div className="flex flex-col lg:flex-row justify-between max-w-6xl py-5l">
          <div className="flex flex-col space-y-10 mb-10">
            <div className="flex space-x-5">
              <p className="font-bold">İsim - Soyisim </p>
              <p>
                {profileData?.name} {profileData?.surname}
              </p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">Telefon</p>
              <p>{profileData?.phone}</p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">E-mail </p>
              <p>{profileData?.email}</p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">Lokasyon </p>
              <p>
                {profileData?.location}, {profileData?.town}
              </p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">Cinsiyet </p>
              <p>{profileData?.gender}</p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">Yaş Grubu</p>
              <p> {profileData?.age}</p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">Kan Grubu</p>
              <p>{profileData?.blood}</p>
            </div>
          </div>
          <div className="flex flex-col space-y-10">
            <p className="text-xl font-bold text-gray-600">Yetkinlikler</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10 max-w-sm">
              {profileData?.checkedSkills?.map((skill) => (
                <ColorTag text={skill} color="#FFDCDC" />
              ))}
              {profileData?.otherSkills && (
                <ColorTag text={profileData?.otherSkills} color="#FFDCDC" />
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {profileData?.checkedLanguages?.map((language) => (
                <LanguageTag text={language} />
              ))}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {profileData?.checkedCertificates?.map((certificates) => (
                <div className="flex items-center">
                  <p>{certificates}</p>
                  <Check className="w-6 h-6" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <CallTabs data={volunteerTabsData} />

        <Modal
          show={profileModalStatus}
          close={() => {
            toggleProfileModal(false);
          }}
          title="Profili Düzenle"
        >
          <form
            className="max-h-[80%] w-fit items-center text-center z-30 mt-2 space-y-10 m-auto overflow-y-auto overflow-x-hidden p-10 no-scrollbar"
            onSubmit={formik.handleSubmit}
          >
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
                  className="border-gray-400 rounded-md w-full"
                >
                  <option value="" selected disabled hidden>
                    İlçe Seçiniz*
                  </option>
                  {towns &&
                    towns?.map((town) => {
                      return (
                        <option key={town?.name} value={town?.name}>
                          {town?.name}
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
                value={updatedField?.otherSkills}
                onChange={(e) => handleProfileInputChange(e)}
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
            <div className="flex justify-center">
              <Button color="pink" type="submit">
                Profili Güncelle
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
};

export default Profile;
