import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/src/context/UserContext";
import { CallContext } from "src/context/CallContext";
import Router from "next/router";
import { Button, Textarea, Input } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import Edit from "@/components/icons/Edit";
import Spinner from "@/components/icons/Spinner";
import { getAllCalls } from "@/src/firebase/calls";
import places from "../places.json" assert { type: "json" };
import { updateUser } from "@/src/firebase/users";

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
  const { profileData, updatedField, setUpdatedFields, setProfileData } =
    useContext(UserContext);
  const { callInput, setCallInput } = useContext(CallContext);
  const [profileModalStatus, toggleProfileModal] = useState(false);

  const [calls, setCalls] = useState([]);
  const [cities, setCities] = useState([]);
  const [towns, setTowns] = useState([]);

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
    toggleProfileModal(false);
    updateUser(profileData?.id, updatedField);
    setProfileData({ ...profileData, ...updatedField });
  };

  useEffect(() => {
    cities &&
      cities.find(
        (city) => city.name === updatedField?.location && setTowns(city.towns)
      );
  }, [updatedField?.location]);

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

  //TAILWIND LOADING
  if (!profileData) return <div></div>;

  if (profileData?.role === "volunteer") {
    Router.push("/profile");
  }

  console.log("profileData", profileData);

  if (profileData?.role === "admin") {
    return (
      <div className="m-10 lg:mx-36 space-y-16">
        <div className="flex items-center">
          <p className="text-5xl font-bold mr-10">Kurum Profili</p>
          <Edit className="w-6 h-6" />
          <button
            className="text-xs text-gray-600 mx-1 cursor-pointer"
            onClick={toggleProfileModal}
          >
            Düzenle
          </button>
        </div>
        <p className="text-xl font-bold text-gray-600">Genel Bilgiler</p>
        <div className="flex flex-col lg:flex-row justify-between max-w-4xl py-5">
          <div className="flex flex-col space-y-10">
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
          <div className="flex flex-col space-y-10">
            <div className="flex space-x-5">
              <p className="font-bold">Adres </p>
              <p>
                {profileData?.location}, {profileData?.town}
              </p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">Telefon </p>
              <p>{profileData?.phone}</p>
            </div>
            <div className="flex space-x-5">
              <p className="font-bold">Faaliyet Alanları</p>
              <p>{profileData?.checkedSkills?.join(", ")}</p>
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
          title="Profili Düzenle"
        >
          <div className="w-fit z-30 mt-10 bg-background space-y-10 m-auto overflow-y-auto overflow-x-hidden">
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
            <div className="flex justify-between space-x-2">
              <select
                name="location"
                onChange={handleProfileInputChange}
                className="border-gray-400 rounded-md w-full mr-2"
              >
                {places.map((city) => {
                  return (
                    <option key={city.name} value={city.name}>
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
                      <option key={town.name} value={town.name}>
                        {town.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <Input
              variant="outlined"
              label="Telefon"
              name="phone"
              value={updatedField?.phone}
              onChange={(e) => handleProfileInputChange(e)}
            />

            <div className="flex justify-center">
              <Button color="pink" className="mt-5" onClick={update}>
                Profili Güncelle
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
