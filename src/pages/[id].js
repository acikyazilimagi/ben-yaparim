import Router, { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/src/context/UserContext";
import ColorTag from "@/components/Tags/color-tag";
import LanguageTag from "@/components/Tags/language-tag";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import Collapse from "@/components/Collapse";
import {
  addApplicantToCallDoc,
  getApplicantsMetaData,
  getCall,
  closeCall,
} from "@/src/firebase/calls";

import {
  updateUserAppliedCalls,
  checkUserAppliedCallDates,
  revokeAppliedCall,
} from "../firebase/users";
import Location from "@/src/components/icons/Location";
import Calendar from "@/src/components/icons/Calendar";
import People from "@/src/components/icons/People";
import Envelope from "@/src/components/icons/Envelope";
import ShareOptions from "@/src/components/Share/share";
import Badge from "@/components/Badge/Badge";
import { Status } from "@/src/utils/constants";
import { formatDate } from "@/src/helpers";
import { auth } from "../firebase-config";
import { Button } from "@material-tailwind/react";

export default function CallDetail() {
  const [showModal, toggleModal] = useState(false);
  const [applicantModalStatus, setApplicantModalStatus] = useState(false);
  const [closeCallModalStatus, setCloseCallModalStatus] = useState(false);
  const { profileData } = useContext(UserContext);

  const { currentUser } = auth;

  const router = useRouter();
  const { id } = router.query;
  const [call, setCall] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [applicants, setApplicants] = useState();
  const [applicationStatus, setApplicationStatus] = useState("");

  useEffect(() => {
    call?.applicants?.length === 0 && setApplicationStatus("");
    call?.applicants?.map((user) =>
      user?.uid === currentUser?.uid
        ? setApplicationStatus(user.approvedStatus)
        : setApplicationStatus("")
    );
  }, [call]);

  useEffect(() => {
    if (id) {
      (async () => {
        const data = await getCall(id);
        setCall(data);

        const applicants = await getApplicantsMetaData(data?.applicants);
        setApplicants(applicants);
      })();
    }
  }, [id]);

  useEffect(() => {
    call && setActiveStatus(call?.isActive);
  }, [call?.isActive]);

  const revokeApplication = () => {
    revokeAppliedCall(currentUser?.uid, id).then(() =>
      getCall(id).then((data) => setCall(data))
    );
  };

  const handleApplicationCall = async () => {
    if (!!currentUser) {
      if (!(await checkUserAppliedCallDates(profileData?.uid, call))) {
        toast.error(
          "Tarihleri çakışan başvurular yapamazsınız! Bu faaliyet tarihlerinde başka aktif bir başvurun var."
        );
      } else {
        if (!(await addApplicantToCallDoc(id, profileData?.uid))) {
          toast.error(err.message);
        } else {
          toggleModal(true);
          await updateUserAppliedCalls(null, id, "pending");
          const callData = await getCall(id);
          setCall(callData);
        }
      }
    } else {
      Router.push("/register");
    }
  };

  const closeCallVerify = () => {
    setCloseCallModalStatus(true);
  };

  const seeAllApplicants = () => {
    setApplicantModalStatus(true);
  };

  return (
    <>
      <div className="m-10 lg:mx-36 pb-10">
        <Modal
          show={showModal}
          close={() => {
            toggleModal(false);
          }}
        >
          <div className="lg:m-auto lg:w-3/4 z-30 mt-2 py-[10%] bg-background items-center text-center">
            <p className="font-bold text-lg lg:text-3xl my-2">
              <span className="text-red-800">Ben Yaparım! </span>diyen sevgili
              gönüllümüz,
            </p>
            <p className="text-md lg:text-3xl mt-7">
              Çağrımıza yaptığınız başvuru için çok teşekkür ederiz. Başvurunuzu
              değerlendirip size en kısa sürede dönüş yapacağız.
            </p>
            <div className="text-md lg:text-2xl mt-7">
              <p className="font-bold">
                Lütfen E-posta kutunuzu (spam kutusunu da) sık sık kontrol edin.
              </p>
              <p className="mt-7">Sağlıklı günler dileriz.</p>
            </div>
          </div>
        </Modal>

        <Modal
          show={applicantModalStatus}
          close={() => {
            setApplicantModalStatus(false);
          }}
          title={`Başvurular (${applicants?.length ? applicants?.length : 0})`}
        >
          <p className="text-lg my-5">{call?.title}</p>

          <div className="max-h-[80%] z-30 mt-2 bg-background items-center text-center overflow-y-auto overflow-x-hidden no-scrollbar">
            {applicants?.map((user) => (
              <Collapse
                name={user.name}
                surname={user.surname}
                location={user.location}
                town={user.town}
                key={user.uid}
                otherSkills={user.otherSkills}
                id={user.uid}
                email={user.email}
                phone={user.phone}
                callId={id}
                certificates={user.checkedCertificates}
                languages={user.checkedLanguages}
                skills={user.checkedSkills}
                applicationStatus={user.applicant.approvedStatus}
              />
            ))}
          </div>
        </Modal>

        <Modal
          show={closeCallModalStatus}
          close={() => {
            setCloseCallModalStatus(false);
          }}
        >
          <div className="my-5 flex flex-col lg:flex-row justify-center">
            <p className="text-xl mt-6 font-bold text-pink-600">
              Çağrıyı kapatmak istediğinize emin misiniz?
            </p>
          </div>
          <div className="my-5 flex flex-col lg:flex-row justify-center">
            <p className="text-l mt-6 font-bold text-gray-600 center">
              Kapattığın çağrıları Kurum Profili’nde ‘Kapalı Çağrılar’ altında
              görebilirsin.
            </p>
          </div>
          <div className="flex justify-center mt-3">
            <Button
              color="red"
              className="mx-2"
              size="lg"
              onClick={() => {
                if (activeStatus) {
                  setActiveStatus(false);
                  closeCall(id);
                  setCloseCallModalStatus(false);
                } else {
                  toast.error("Kapatmaya çalıştığınız çağrı aktif değil.");
                }
              }}
            >
              Çağrıyı Kapat
            </Button>
            <Button
              color="gray"
              size="lg"
              onClick={() => {
                setCloseCallModalStatus(false);
              }}
            >
              Geri Dön
            </Button>
          </div>
        </Modal>

        <div className="flex justify-end mr-[7%]">
          <ShareOptions id={id} />
        </div>

        <div className="border border-gray-200 m-[6%] p-[5%] xl:flex justify-between">
          <div className="mr-5">
            <div className="my-5 flex justify-between">
              <h1 className="text-4xl mt-4 font-bold">{call?.title}</h1>
            </div>
            <p className="max-w-xl my-10">{call?.description}</p>
            <p className="max-w-xl my-8">{call?.precondition}</p>
            <div className="my-10">
              <p className="mt-4 font-bold">Aranan Yekinlikler</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {call?.checkedSkills?.map((skill) => (
                  <ColorTag text={skill} color="#FFDCDC" />
                ))}
                {call?.otherSkills && (
                  <ColorTag text={call?.otherSkills} color="#FFDCDC" />
                )}
              </div>
            </div>

            <div className="my-20 flex flex-col lg:flex-row justify-between">
              <div>
                <p className="text-xl mt-6 font-bold text-gray-600">
                  Dil Bilgisi
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {call?.checkedLanguages?.map((language) => (
                    <LanguageTag text={language} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xl mt-6 font-bold text-gray-600">
                  Ehliyet Bilgisi
                </p>
                <p className="mt-2">
                  {call?.checkedCertificates?.includes("Ehliyet")
                    ? "Ehliyet gerekir."
                    : "Ehliyet gerekmez."}
                </p>
              </div>
            </div>

            <div className="my-2 ">
              <p className="text-xl mt-6 font-bold text-gray-600">
                Önemli Bilgiler
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {call?.checkedFacilities?.map((facility) => (
                  <ul>
                    <li className="mt-2">
                      {facility.includes("Yol")
                        ? "Yol karşılanacaktır."
                        : "Yol karşılanmayacaktır."}
                    </li>
                    <li className="mt-2">
                      {facility.includes("Konaklama")
                        ? "Konaklanma karşılanacaktır."
                        : "Konaklanma karşılanmayacaktır."}
                    </li>
                    <li className="mt-2">
                      {facility.includes("Yemek")
                        ? "Yemek karşılanacaktır."
                        : "Yemek karşılanmayacaktır."}
                    </li>
                  </ul>
                ))}
              </div>
              <p className="max-w-xl my-3">{call?.notes}</p>
            </div>
          </div>

          <div className="my-24 w-1/2">
            <ul className="w-full">
              <li className="flex w-full border-b-2 py-4">
                <div className="flex min-w-full justify-between">
                  <div className="flex items-center space-x-2 text-l font-bold text-gray-600">
                    <Location className="w-6 h-6" />
                    <p>Faaliyet Lokasyonu</p>
                  </div>
                  <div className="flex space-x-2 text-l font-bold">
                    <p>
                      {call?.location} {call?.town}{" "}
                    </p>
                  </div>
                </div>
              </li>

              <li className="flex w-full border-b-2 py-4">
                <div className="flex min-w-full justify-between">
                  <div className="flex space-x-2 font-bold text-gray-600">
                    <Calendar className="w-6 h-6" />
                    <p>Faaliyet Tarihi</p>
                  </div>
                  <div className="flex space-x-2 font-bold">
                    {formatDate(call?.date?.startDate)} -{" "}
                    {formatDate(call?.date?.endDate)}
                  </div>
                </div>
              </li>
              <li className="flex w-full border-b-2 py-4">
                <div className="flex min-w-full justify-between">
                  <div className="flex space-x-2 font-bold text-gray-600">
                    <People className="w-6 h-6" />
                    <p>Aranan Gönüllü Sayısı</p>
                  </div>
                  <div className="flex space-x-2 font-bold">
                    <p>{call?.needOfVolunteer}</p>
                  </div>
                </div>
              </li>
              <li className="flex w-full border-b-2 py-4">
                <div className="flex min-w-full justify-between items-center">
                  <div className="flex space-x-2 text- font-bold text-gray-600">
                    <Envelope className="w-6 h-6" />
                    <p>Başvuran Gönüllü Sayısı</p>
                  </div>
                  <div className="flex space-x-2 font-bold">
                    <p className="mx-3">
                      {call?.applicants?.length > 0
                        ? call?.applicants?.length
                        : "İlk adımı sen at!"}
                    </p>
                  </div>
                  {profileData?.role === "admin" && (
                    <Button color="pink" onClick={seeAllApplicants}>
                      Başvuruları incele
                    </Button>
                  )}
                </div>
              </li>
            </ul>
            {profileData?.role === "admin" && (
              <div className="flex w-full border-b-4 py-4">
                <Button
                  color={activeStatus ? "pink" : "gray"}
                  onClick={closeCallVerify}
                  size="lg"
                  ripple="true"
                  disabled={!activeStatus}
                >
                  {activeStatus ? "Çağrıyı kapat" : "Çağrı kapandı"}
                </Button>
              </div>
            )}
            {profileData?.role !== "admin" && !applicationStatus && (
              <Button
                onClick={handleApplicationCall}
                color={activeStatus ? "pink" : "gray"}
                className="mt-2"
                disabled={!activeStatus}
              >
                {activeStatus ? "BEN YAPARIM!" : "Çağrı Kapatıldı"}
              </Button>
            )}

            {applicationStatus && (
              <div className="flex my-10 items-center">
                <p className="text-gray-600 font-bold mr-5">Başvuru durumu</p>
                <Badge
                  status={
                    applicationStatus === "approved"
                      ? "success"
                      : applicationStatus === "pending"
                      ? "info"
                      : "danger"
                  }
                  text={Status[applicationStatus]}
                />
              </div>
            )}

            {profileData?.role === "volunteer" && applicationStatus && (
              <Button color="red" onClick={revokeApplication}>
                Başvurunu geri al
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
