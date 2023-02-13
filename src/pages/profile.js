import { useContext, useEffect, useState } from "react";
import { auth } from "@/src/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { UserContext } from "@/src/context/UserContext";
import { CallContext } from "src/context/CallContext";
import Router from "next/router";
import { Button, Textarea, Input } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import { getUserAppliedCalls } from "@/src/firebase/users";
import { getCall } from "@/src/firebase/calls";
import Edit from "@/components/icons/Edit";
import ColorTag from "@/components/Tags/color-tag";
import LanguageTag from "@/components/Tags/language-tag";
import Check from "@/src/components/icons/Check";

const renderAppliedCallContent = (calls, id) => {
  return calls?.map((call, i) => {
    return (
      <Card
        key={i}
        title={call.title}
        description={call.description}
        startDate={call?.date?.startDate}
        endDate={call.date?.endDate}
        needOfVolunteer={call.needOfVolunteer}
        location=""
        id={call.id}
        status={call.status}
      />
    );
  });
};

export default function Profile() {
  const { currentUser } = auth;
  const {
    profileData,
    updateStkInfo,
    updatedField,
    setUpdatedFields,
    getStkInfo,
  } = useContext(UserContext);
  const { callInput, setCallInput } = useContext(CallContext);
  const [profileModalStatus, toggleProfileModal] = useState(false);

  const [appliedCalls, setAppliedCalls] = useState([]);

  console.log("appliedCalls", appliedCalls);

  useEffect(() => {
    if (currentUser?.uid) {
      (async () => {
        const data = await getUserAppliedCalls(currentUser?.uid);

        await Promise.all(
          data?.map(async (call) => {
            const callData = await getCall(call.id);
            const mergedData = { ...callData, ...call };
            return mergedData;
          })
        ).then((data) => {
          setAppliedCalls(data);
        });
      })();
    }
  }, [currentUser]);

  const volunteerTabsData = [
    {
      label: "Aktif Başvurularım",
      value: "aktif",
      content: renderAppliedCallContent(appliedCalls, profileData?.id),
    },
    {
      label: "Kapanmış Başvurularım",
      value: "kapali",
      content: "",
    },
  ];

  const handleProfileInputChange = (e) => {
    setUpdatedFields({ ...updatedField, [e.target.name]: e.target.value });
  };

  const update = () => {
    updateStkInfo();
    toggleProfileModal(false);
    getStkInfo();
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

  useEffect(() => {
    onAuthStateChanged(auth, (profileData) => {
      if (profileData) {
        console.log(auth.currentUser);
      } else {
        Router.push("/");
      }
    });
  }, [profileData]);

  //TAILWIND LOADING
  if (!profileData) return <div></div>;

  if (profileData?.role === "admin") {
    Router.push("/stk/profile");
  }

  if (profileData?.role === "volunteer") {
    return (
      <div className="m-10 lg:mx-36 space-y-16">
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
        <p className="text-xl font-bold text-gray-600">Genel Bilgiler</p>
        <div className="flex flex-col lg:flex-row justify-between max-w-4xl py-5l">
          <div className="flex flex-col space-y-10">
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
              <p>{profileData?.location}, {profileData?.town}</p>
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {profileData?.checkedSkills?.map((skill) => (
                <ColorTag text={skill} color="#FFDCDC" />
              ))}
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
        >
          <div className="w-fit z-30 mt-2 bg-background space-y-3">
            <Input
              variant="outlined"
              label="İsim"
              name="name"
              value={updatedField?.name}
              onChange={(e) => handleProfileInputChange(e)}
            />
            <Input
              variant="outlined"
              label="Soyisim"
              name="surname"
              value={updatedField?.surname}
              onChange={(e) => handleProfileInputChange(e)}
            />

            <Button variant="outlined" onClick={update}>
              Profili Güncelle
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
