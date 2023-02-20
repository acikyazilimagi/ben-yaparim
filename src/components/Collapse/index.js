import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { updateApplicantStatus } from "@/src/firebase/calls";
import { sendMail } from "@/src/firebase/mail";
import ColorTag from "@/components/Tags/color-tag";
import LanguageTag from "@/components/Tags/language-tag";
import { Status } from "@/src/utils/constants";
import { getUserAppliedSpecificCall } from "@/src/firebase/users";
import Badge from "../Badge/Badge";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Collapse({
  name,
  surname,
  location,
  town,
  key,
  otherSkills,
  id,
  email,
  phone,
  callId,
  certificates,
  languages,
  skills,
  applicationStatus,
}) {
  const [open, setOpen] = useState(0);
  const [status, setStatus] = useState(applicationStatus);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const getUpdatedCall = () => {
    getUserAppliedSpecificCall(id, callId).then((data) =>
      setStatus(data?.status)
    );
  };

  return (
    <div className="border border-gray-300 px-5 py-1">
      <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
        <AccordionHeader onClick={() => handleOpen(1)}>
          {name} {surname}
          <div className="ml-[40%]">
            <Badge
              status={
                status === "approved"
                  ? "success"
                  : status === "pending"
                  ? "info"
                  : "danger"
              }
              text={"Başvuru " + Status[status]}
            />
          </div>
        </AccordionHeader>
        <AccordionBody>
          <div className="flex space-x-10">
            <p>
              <span className="font-bold">Lokasyon: </span> {location}, {town}
            </p>
            <p>
              <span className="font-bold">Telefon:</span> {phone}
            </p>
            <p>
              <span className="font-bold"> Email: </span> {email}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 my-5">
            {skills?.map((skill) => (
              <ColorTag text={skill} color="#FFDCDC" />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {languages?.map((language) => (
              <LanguageTag text={language} />
            ))}
          </div>
          <hr className="my-10" />

          <div className="flex justify-center mt-3">
            <Button
              color="green"
              className="mx-2"
              onClick={() => {
                updateApplicantStatus(callId, id, "approved").then(
                  (updateResp) => {
                    updateResp &&
                      !!email &&
                      sendMail(
                        email,
                        "Çağrı Başvurunuz Onaylandı!",
                        "<p><b>Ben yaparım!</b> diyen sevgili gönüllümüz,</p><p>Çağrımıza yaptığınız başvuru için çok teşekkür ederiz. Başvurunuz değerlendirilmiş ve olumlu karşılanmıştır. Gönüllü hareketinin başlaması için planlamalar ve detaylar için sizinle en kısa sürede iletişime geçeceğiz. Telefonunuzu ve e-postalarınızı (spam kutusu dahil) sık sık kontrol etmeyi unutmayın.</p><p>Sağlıklı günler dileriz.</p>"
                      ).then((mailResp) => {
                        mailResp
                          ? toast.success("Gönüllümüze onay emaili gönderildi.")
                          : toast.error(
                              "Gönüllümüze onay emaili gönderilemedi."
                            );
                        getUpdatedCall();
                      });
                  }
                );
              }}
            >
              Onay
            </Button>
            <Button
              onClick={() => {
                updateApplicantStatus(callId, id, "rejected").then(() => {
                  toast.error("Gönüllümüzün Başvurusu Reddedildi.");
                  getUpdatedCall();
                });
              }}
              color="red"
            >
              Reddet
            </Button>
          </div>
        </AccordionBody>
      </Accordion>
    </div>
  );
}
