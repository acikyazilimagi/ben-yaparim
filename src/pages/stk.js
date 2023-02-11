import React, { useState, useContext, useEffect } from "react";
import { Button, Chip, Textarea, Input } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import Collapse from "@/components/Collapse";
import Tooltip from "@/components/Tooltip";
import { CallContext } from "src/context/CallContext";
import { DateRange } from "react-date-range";

export default function StkProfile() {
  const [showModal, toggleModal] = useState(false);
  const [showCallModal, openCreateCallModal] = useState(false);

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
    openCreateCallModal(false);
    setCallInput({});
  };
  return (
    <div>
      <div className="flex items-center">
        <img
          width={100}
          height={100}
          src="https://avatars.githubusercontent.com/u/16260732?s=200&v=4"
          alt=""
        />
        <p className="text-xl font-bold mx-10">Açık kaynak</p>
      </div>
      <p>Websitesi</p>
      <div className="flex flex-col lg:flex-row justify-between my-5">
        <div>
          <p>Faaliyet Alanları</p>
          <div className="space-x-2">
            <Chip color="indigo" value="x" />
            <Chip color="indigo" value="y" />
            <Chip color="indigo" value="z" />
          </div>
        </div>
        <div>
          <p>Kurum Adresi</p>
          <p>Adress</p>
        </div>
      </div>
      <CallTabs toggleModal={toggleModal} />
      <Modal
        show={showModal}
        close={() => {
          toggleModal(false);
        }}
      >
        <div className="max-w-2xl z-30 mt-2 bg-background">
          <Collapse />
          <Collapse />
          <Collapse />
          <Collapse />
        </div>
      </Modal>
      <div className="flex justify-end items-end">
        <Button
          variant="outlined"
          size="lg"
          className="text-black border-black"
          onClick={openCreateCallModal}
        >
          +
        </Button>
        <Tooltip text="Yeni Çağrı Oluştur" />
      </div>
      <Modal
        show={showCallModal}
        close={() => {
          openCreateCallModal(false);
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
    </div>
  );
}
