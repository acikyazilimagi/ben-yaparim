import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/src/context/UserContext";
import { CallContext } from "src/context/CallContext";
import Router from "next/router";
import { Button, Textarea, Input, Checkbox } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import Edit from "@/components/icons/Edit";
import Spinner from "@/components/icons/Spinner";
import { getAllCalls } from "@/src/firebase/calls";
import places from "../places.json" assert { type: "json" };
import skills from "../skills.json" assert { type: "json" };
import { updateUser } from "@/src/firebase/users";

const renderCallContent = ({calls, isOpen} = {}) => {
  const renderedCalls = calls?.filter(function (call) {
    return isOpen ? call.isActive : !call.isActive 
  })
  return renderedCalls?.map((call, i) => {
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
  const [checkedSkills, setCheckedSkills] = useState([]);

  const stkTabsData = [
    {
      label: "Açık Çağrılar",
      value: "acik",
      content: renderCallContent({calls: calls, isOpen: true}),
    },
    {
      label: "Kapalı Çağrılar",
      value: "kapali",
      content: renderCallContent({calls: calls, isOpen: false}),
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
    setCities(places);
  }, []);

  useEffect(() => {
    setUpdatedFields({
      ...updatedField,
      checkedSkills: checkedSkills,
    });
  }, [checkedSkills]);

  const handleSkillCheck = (event) => {
    let updatedList = [...checkedSkills];
    if (event.target.checked) {
      updatedList = [...checkedSkills, event.target.value];
    } else {
      updatedList.splice(checkedSkills.indexOf(event.target.value), 1);
    }
    setCheckedSkills(updatedList);
  };

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
  if (profileData?.role === "admin") {
    return (
      <div className="m-10 lg:mx-36">
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
        <p className="text-xl font-bold text-gray-600 my-16">Genel Bilgiler</p>
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
              <div>
                {profileData?.checkedSkills?.join(", ")}
                {", "}
                {profileData?.otherSkills && profileData?.otherSkills}
              </div>
            </div>
          </div>
        </div>
        <Button
          color="pink"
          className="my-10"
          onClick={() => Router.push("/stk/open-call")}
        >
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
          <div className="max-h-[80%] w-fit items-center text-center z-30 mt-2 space-y-10 m-auto overflow-y-auto overflow-x-hidden p-10 no-scrollbar">
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
                <option value="" selected disabled hidden>
                  İl Seçiniz
                </option>
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
                <option value="" selected disabled hidden>
                  İlçe Seçiniz
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
            </div>
            <Input
              variant="outlined"
              label="Telefon"
              name="phone"
              value={updatedField?.phone}
              onChange={(e) => handleProfileInputChange(e)}
            />
            <p className="text-gray-400 font-bold my-5">Faaliyet Alanları</p>
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
