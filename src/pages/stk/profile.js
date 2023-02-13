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
import { getAllCalls } from "@/src/firebase/calls";

const renderOpenCallContent = (calls) => {
  return calls?.map((call, i) => {
    return (
      <Card
        key={i}
        title={call?.title}
        description={call?.description}
        startDate={call?.date?.startDate}
        endDate={call?.date?.endDate}
        needOfVolunteer={call?.needOfVolunteer}
        applicants={call?.applicants}
        checkedCertificates={call?.checkedCertificates}
        checkedLanguages={call?.checkedLanguages}
        checkedSkills={call?.checkedSkills}
        location=""
        id={call.id}
        role="stk"
      />
    );
  });
};

export default function Profile() {
  const {
    profileData,
    updateStkInfo,
    updatedField,
    setUpdatedFields,
    getStkInfo,
  } = useContext(UserContext);
  const { callInput, setCallInput, createNewCall } = useContext(CallContext);
  const [profileModalStatus, toggleProfileModal] = useState(false);

  const [calls, setCalls] = useState([]);

  const stkTabsData = [
    {
      label: "Açık Çağrılar",
      value: "acik",
      content: renderOpenCallContent(calls),
    },
    {
      label: "Kapalı Çağrılar",
      value: "kapali",
      content: "",
    },
    {
      label: "Taslaklar",
      value: "taslaklar",
      content: "",
    },
  ];

  useEffect(() => {
    (async () => {
      const data = await getAllCalls();
      setCalls(data);
    })();
  }, []);

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

  if (profileData?.role === "volunteer") {
    Router.push("/profile");
  }

  if (profileData?.role === "admin") {
    return (
      <div className="m-10 lg:mx-36 space-y-10">
        <>
          <div className="flex items-center">
            <p className="text-5xl font-bold mr-10">Kurum Profili</p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.06 3.58988L20.41 4.93988C21.2 5.71988 21.2 6.98988 20.41 7.76988L7.18 20.9999H3V16.8199L13.4 6.40988L16.23 3.58988C17.01 2.80988 18.28 2.80988 19.06 3.58988ZM5 18.9999L6.41 19.0599L16.23 9.22988L14.82 7.81988L5 17.6399V18.9999Z"
                fill="#969EAD"
              />
            </svg>
            <button
              className="text-xs text-gray-600 mx-1 cursor-pointer"
              onClick={toggleProfileModal}
            >
              Düzenle
            </button>
          </div>
          <p className="text-xl font-bold text-gray-600">Genel Bilgiler</p>
          <div className="flex lg:flex-row justify-between max-w-2xl">
            <div className="flex flex-col space-y-5">
              <div className="flex space-x-5">
                <p className="font-bold">Kurum İsmi </p>
                <p>{profileData?.displayName}</p>
              </div>
              <div className="flex space-x-5">
                <p className="font-bold">Website</p>
                <p>{profileData?.website}</p>
              </div>
              <div className="flex space-x-5">
                <p className="font-bold">E-mail </p>
                <p>{profileData?.email}</p>
              </div>
            </div>
            <div className="flex flex-col space-y-5">
              <div className="flex space-x-5">
                <p className="font-bold">Adres </p>
                <p>{profileData?.address}</p>
              </div>
              <div className="flex space-x-5">
                <p className="font-bold">Telefon </p>
                <p>{profileData?.phone}</p>
              </div>
              <div className="flex space-x-5">
                <p className="font-bold">Faaliyet Alanları</p>
                <p>faaliyet alanları</p>
              </div>
            </div>
          </div>
          <Button color="pink" onClick={() => Router.push("/stk/open-call")}>
            + Yeni Çağrı Oluştur
          </Button>

          <CallTabs data={stkTabsData} />

          <Modal
            show={profileModalStatus}
            close={() => {
              toggleProfileModal(false);
            }}
          >
            <div className="w-fit z-30 mt-2 bg-background space-y-3">
              <Input
                variant="outlined"
                label="Kurum İsmi"
                name="displayName"
                value={updatedField?.displayName}
                onChange={(e) => handleProfileInputChange(e)}
              />
              <Input
                variant="outlined"
                label="Website"
                name="website"
                value={updatedField?.website}
                onChange={(e) => handleProfileInputChange(e)}
              />
              <Textarea
                variant="outlined"
                label="Adres"
                name="address"
                value={updatedField?.address}
                onChange={(e) => handleProfileInputChange(e)}
              />
              <Input
                variant="outlined"
                label="Telefon"
                name="phone"
                value={updatedField?.phone}
                onChange={(e) => handleProfileInputChange(e)}
              />

              <Button variant="outlined" onClick={update}>
                Profili Güncelle
              </Button>
            </div>
          </Modal>
        </>
      </div>
    );
  }
}
