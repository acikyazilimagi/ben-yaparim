import { useContext, useEffect, useState } from "react";
import { app } from "@/src/firebase-config";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import toast from "react-hot-toast";
import { UserContext } from "@/src/context/UserContext";
import { CallContext } from "src/context/CallContext";
import Router from "next/router";
import { Button, Textarea, Input } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import { DateRange } from "react-date-range";

const auth = getAuth(app);

export default function Profile() {
  const { stkData, updateStkInfo, updatedField, setUpdatedFields, getStkInfo } =
    useContext(UserContext);
  const { callInput, setCallInput, createNewCall, calls, getCalls } =
    useContext(CallContext);
  const [callModalStatus, toggleCallModal] = useState(false);
  const [profileModalStatus, toggleProfileModal] = useState(false);

  const handleInputChange = (e) => {
    setCallInput({ ...callInput, [e.target.name]: e.target.value });
  };

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

  const createCall = () => {
    createNewCall();
    toggleCallModal(false);
    setCallInput({});
    getCalls();
  };

  useEffect(() => {
    onAuthStateChanged(auth, (stkData) => {
      if (stkData) {
        console.log(auth.currentUser);
      } else {
        Router.push("/");
      }
    });
  }, [stkData]);

  const logoutSTK = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="m-10 lg:mx-36 space-y-10">
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
            <p>{stkData?.displayName}</p>
          </div>
          <div className="flex space-x-5">
            <p className="font-bold">Website</p>
            <p>{stkData?.website}</p>
          </div>
          <div className="flex space-x-5">
            <p className="font-bold">E-mail </p>
            <p>{stkData?.email}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex space-x-5">
            <p className="font-bold">Adres </p>
            <p>{stkData?.address}</p>
          </div>
          <div className="flex space-x-5">
            <p className="font-bold">Telefon </p>
            <p>{stkData?.phone}</p>
          </div>
          <div className="flex space-x-5">
            <p className="font-bold">Faaliyet Alanları</p>
            <p>faaliyet alanları</p>
          </div>
        </div>
      </div>
      <Button color="pink" onClick={toggleCallModal}>
        + Yeni Çağrı Oluştur
      </Button>
      <CallTabs calls={calls} />
      <Modal
        show={callModalStatus}
        close={() => {
          toggleCallModal(false);
        }}
      >
        <div className="w-fit z-30 mt-2 bg-background space-y-3">
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
          <Input
            variant="outlined"
            label="Gönüllü Sayısı"
            name="needOfVolunteer"
            type="number"
            value={callInput.needOfVolunteer}
            onChange={(e) => handleInputChange(e)}
          />
          <Input
            variant="outlined"
            label="Konum"
            name="location"
            value={callInput.location}
            onChange={(e) => handleInputChange(e)}
          />
          <Textarea
            variant="outlined"
            label="Notlar"
            name="notes"
            value={callInput.notes}
            onChange={(e) => handleInputChange(e)}
          />
          <div>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={date}
            />
          </div>

          <Button variant="outlined" onClick={createCall}>
            Çağrı Oluştur
          </Button>
        </div>
      </Modal>
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
          <Input
            variant="outlined"
            label="E-mail"
            name="email"
            value={updatedField?.email}
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
    </div>
  );
}
