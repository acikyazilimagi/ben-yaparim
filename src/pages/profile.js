import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { UserContext } from "@/src/context/UserContext";
import { CallContext } from "src/context/CallContext";
import Router from "next/router";
import { Button, Input } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import { getUserAppliedCalls, updateUser } from "@/src/firebase/users";
import { getCall } from "@/src/firebase/calls";

import { auth } from "@/src/firebase-config";

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

const Profile = () => {
  const { currentUser } = auth;
  const { updatedField, setUpdatedFields, profileData, setProfileData } =
    useContext(UserContext);
  const { callInput, setCallInput, createNewCall } = useContext(CallContext);
  const [profileModalStatus, toggleProfileModal] = useState(false);

  const [appliedCalls, setAppliedCalls] = useState([]);

  useEffect(() => {
    if (currentUser?.uid) {
      //TODO: MOVE THIS INTO FIREBASE FOLDER
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
    toggleProfileModal(false);
    updateUser(profileData?.uid, updatedField);
    setProfileData({ ...profileData, ...updatedField });
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
      <div className="m-10 lg:mx-36 space-y-10">
        <div>
          <div className="flex items-center">
            <p className="text-5xl font-bold mr-10">Gönüllü Profilim</p>
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
                <p></p>
              </div>
              <div className="flex space-x-5">
                <p className="font-bold">Cinsiyet </p>
                <p></p>
              </div>
              <div className="flex space-x-5">
                <p className="font-bold">Yaş Grubu</p>
                <p></p>
              </div>
              <div className="flex space-x-5">
                <p className="font-bold">Kan Grubu</p>
                <p></p>
              </div>
            </div>
            <div className="flex flex-col space-y-5"></div>
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
      </div>
    );
  }
};

export default Profile;
