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
} from "@/src/firebase/calls";

import { updateUserAppliedCalls } from "../firebase/users";
import Location from "@/src/components/icons/Location";
import Calendar from "@/src/components/icons/Calendar";
import People from "@/src/components/icons/People";
import Envelope from "@/src/components/icons/Envelope";
import ShareOptions from "@/src/components/Share/share";

import { formatDate } from "@/src/helpers";
import { auth } from "../firebase-config";

export default function CallDetail() {
  const [showModal, toggleModal] = useState(false);
  const [applicantModalStatus, setApplicantModalStatus] = useState(false);
  const { profileData } = useContext(UserContext);

  const { currentUser } = auth;

  const router = useRouter();
  const { id } = router.query;
  const [call, setCall] = useState([]);
  const [applicants, setApplicants] = useState();

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

  const handleApplicationCall = () => {
    if (!!currentUser) {
      addApplicantToCallDoc(id, profileData?.uid).then((res) => {
        res ? toggleModal(true) : toast.error(err.message);
      });
      updateUserAppliedCalls(null, id, "pending");
    } else {
      Router.push("/register");
    }
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
          <div className="max-w-3xl z-30 mt-2 py-[10%] bg-background items-center text-center">
            <div className="flex gap-x-2 justify-center my-2">
              <p className="font-bold text-3xl text-red-800">Ben Yaparım!</p>
              <p className="font-bold text-3xl">diyen sevgili gönüllümüz,</p>
            </div>
            <p className="text-2xl">
              Çağrımıza yaptığınız başvuru için çok teşekkür ederiz. Başvurunuzu
              değerlendirip size en kısa sürede dönüş yapacağız.
            </p>
            <p className="text-2xl font-bold mt-5">
              Lütfen E-posta kutunuzu (spam kutusunu da) sık sık kontrol edin.
            </p>
            <p className="text-2xl">Sağlıklı günler dileriz.</p>
          </div>
        </Modal>

        <Modal
          show={applicantModalStatus}
          close={() => {
            setApplicantModalStatus(false);
          }}
        >
          <div className="w-96 h-96 z-30 mt-2 bg-background items-center text-center overflow-y-auto overflow-x-hidden">
            {applicants?.map((user) => (
              <Collapse
                name={user.name}
                surname={user.surname}
                location="Ankara"
                key={user.uid}
                id={user.uid}
                email={user.email}
                callId={id}
              />
            ))}
          </div>
        </Modal>

        <div className="flex justify-end mx-24"><ShareOptions id={id}/></div>

        <div className="border border-gray-200 m-[6%] px-[2%] pb-10 xl:flex justify-start">
          <div className="w-1/2 mr-[5%]">
            <div className="my-5 flex justify-between">
              <h1 className="text-4xl mt-4 font-bold">{call?.title}</h1>
            </div>
            <p className="max-w-xl my-10">{call?.description}</p>
            <p className="max-w-xl my-8">{call?.precondition}</p>
            <div className="my-10">
              <p className="mt-4 font-bold">Aranan Yekinlikler</p>
              <div className="mt-2 flex gap-x-2">
                {call?.checkedSkills?.map((skill) => (
                  <ColorTag text={skill} color="#FFDCDC" />
                ))}
              </div>
            </div>

            <div className="my-20 flex justify-between">
              <div>
                <p className="text-xl mt-6 font-bold text-gray-600">
                  Dil Bilgisi
                </p>
                <div className="mt-2 flex gap-x-2">
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
                      {call.location} {call.town}{" "}
                    </p>
                  </div>
                </div>
              </li>

              <li className="flex w-full border-b-2 py-4">
                <div className="flex min-w-full justify-between">
                  <div className="flex space-x-2 text-l font-bold text-gray-600">
                    <Calendar className="w-6 h-6" />
                    <p>Faaliyet Tarihi</p>
                  </div>
                  <div className="flex space-x-2 text-l font-bold">
                    {formatDate(call?.date?.startDate)} -{" "}
                    {formatDate(call?.date?.endDate)}
                  </div>
                </div>
              </li>
              <li className="flex w-full border-b-2 py-4">
                <div className="flex min-w-full justify-between">
                  <div className="flex space-x-2 text-l font-bold text-gray-600">
                    <People className="w-6 h-6" />
                    <p>Aranan Gönüllü Sayısı</p>
                  </div>
                  <div className="flex space-x-2 text-l font-bold">
                    <p>{call?.needOfVolunteer}</p>
                  </div>
                </div>
              </li>
              <li className="flex w-full border-b-2 py-4">
                <div
                  className="flex min-w-full justify-between cursor-pointer"
                  onClick={() => {
                    profileData?.role === "admin" && seeAllApplicants();
                  }}
                >
                  <div className="flex space-x-2 text-l font-bold text-gray-600">
                    <Envelope className="w-6 h-6" />
                    <p>Başvuran Gönüllü Sayısı</p>
                  </div>
                  <div className="flex space-x-2 text-l font-bold">
                    <p>
                      {call?.applicants?.length > 0
                        ? call?.applicants?.length
                        : "İlk adımı sen at!"}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            {profileData?.role === "volunteer" && (
              <button
                onClick={handleApplicationCall}
                className="bg-pink-600 text-white p-3 text-sm rounded-full my-5 font-bold"
              >
                BEN YAPARIM!
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs mx-[6%]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Netus et malesuada
        fames ac turpis. Porta nibh venenatis cras sed. Nisi lacus sed viverra
        tellus in hac habitasse. Eros in cursus turpis massa. Iaculis nunc sed
        augue lacus viverra. Egestas maecenas pharetra convallis posuere morbi
        leo urna molestie. Elit eget gravida cum sociis natoque. Nunc pulvinar
        sapien et ligula ullamcorper. Quisque id diam vel quam. Commodo
        ullamcorper a lacus vestibulum sed arcu non odio euismod. Odio ut sem
        nulla pharetra diam. Cras ornare arcu dui vivamus. Leo vel fringilla est
        ullamcorper eget nulla facilisi etiam. Ornare arcu dui vivamus arcu
        felis bibendum ut tristique. Ipsum a arcu cursus vitae congue mauris
        rhoncus aenean vel. Risus sed vulputate odio ut. Purus sit amet volutpat
        consequat mauris nunc congue. Mattis enim ut tellus elementum sagittis
        vitae et. Diam sit amet nisl suscipit. Id diam vel quam elementum.
        Scelerisque in dictum non consectetur.
      </p>
    </>
  );
}
