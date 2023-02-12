import Router from "next/router";
import { useState, useContext } from "react";

import { db } from "@/src/firebase-config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { UserContext } from "@/src/context/UserContext";

import ColorTag from "@/components/Tags/color-tag";
import LanguageTag from "@/components/Tags/language-tag";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";

export default function CallDetail({ details, call }) {
  const [showModal, toggleModal] = useState(false);

  const { stkData } = useContext(UserContext);

  const updateCall = async () => {
    const request = doc(db, "requests", call);

    try {
      await updateDoc(request, {
        applicants: arrayUnion(stkData),
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApplicationCall = () => {
    if (stkData) {
      updateCall();
      toggleModal(true);
    } else {
      Router.push("/stk/register");
    }
  };

  return (
    <>
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

      <div className="border border-gray-200 m-[6%] px-[2%] pb-10 xl:flex justify-start">
        <div className="w-1/2 mr-[5%]">
          <div className="my-5 flex justify-between">
            <h1 className="text-4xl mt-4 font-bold">{details?.title}</h1>
          </div>
          <p className="max-w-xl w-1/2 my-10">{details?.description}</p>
          <div className="my-2">
            <p className="text-xl mt-4 font-bold text-gray-600">
              Aranan Yekinlikler
            </p>
            <div className="mt-2 flex gap-x-2">
              <ColorTag text="ilk yardım" color="#FFDCDC" />
              <ColorTag text="tercümanlık" color="#9CC7FF" />
              <ColorTag text="tamir" color="#72DDC3" />
            </div>
          </div>

          <div className="my-2 flex justify-between">
            <div>
              <p className="text-xl mt-6 font-bold text-gray-600">
                Dil Bilgisi
              </p>
              <div className="mt-2 flex gap-x-2">
                <LanguageTag text="Çince" />
              </div>
            </div>
            <div>
              <p className="text-xl mt-6 font-bold text-gray-600">
                Ehliyet Bilgisi
              </p>
              <p className="mt-2">Tags</p>
            </div>
          </div>

          <div className="my-2 ">
            <p className="text-xl mt-6 font-bold text-gray-600">
              Önemli Bilgiler
            </p>
            <p className="mt-2">Tags</p>
          </div>
        </div>

        <div className="my-5 w-1/2">
          <ul className="w-full">
            <li className="flex w-full border-b-2 py-4">
              <div className="flex min-w-full justify-between">
                <div className="flex space-x-2 text-l font-bold text-gray-600">
                  <p>H</p>
                  <p>Faaliyet Lokasyonu</p>
                </div>
                <div className="flex space-x-2 text-l font-bold">
                  <p>İl,</p>
                  <p>İlçe</p>
                </div>
              </div>
            </li>
            <li className="flex w-full border-b-2 py-4">
              <div className="flex min-w-full justify-between">
                <div className="flex space-x-2 text-l font-bold text-gray-600">
                  <p>H</p>
                  <p>Faaliyet Tarihi</p>
                </div>
                <div className="flex space-x-2 text-l font-bold">
                  <p>DD/MM - DD/MM/YY</p>
                </div>
              </div>
            </li>
            <li className="flex w-full border-b-2 py-4">
              <div className="flex min-w-full justify-between">
                <div className="flex space-x-2 text-l font-bold text-gray-600">
                  <p>H</p>
                  <p>Aranan Gönüllü Sayısı</p>
                </div>
                <div className="flex space-x-2 text-l font-bold">
                  <p>250+</p>
                </div>
              </div>
            </li>
            <li className="flex w-full border-b-2 py-4">
              <div className="flex min-w-full justify-between">
                <div className="flex space-x-2 text-l font-bold text-gray-600">
                  <p>H</p>
                  <p>Başvuran Gönüllü Sayısı</p>
                </div>
                <div className="flex space-x-2 text-l font-bold">
                  <p>76</p>
                </div>
              </div>
            </li>
          </ul>
          <button
            onClick={handleApplicationCall}
            className="bg-pink-600 text-white p-3 text-sm rounded-full my-5 font-bold"
          >
            BEN YAPARIM!
          </button>
        </div>
      </div>
      <p className="text-xs mx-[6%] my-3">
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

export async function getStaticPaths() {
  let paths = [];

  try {
    const querySnapshot = await getDocs(collection(db, "requests"));

    querySnapshot.forEach((doc) => {
      paths.push({ params: { call: doc?.id } });
    });
  } catch (e) {
    console.log(e);
  }

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { call } = params;

  try {
    const docRef = doc(db, "requests", call);
    const call_details = await getDoc(docRef);

    const call_details_full = call_details.data();
    delete call_details_full.date;

    const details = call_details_full;

    return details ? { props: { details, call } } : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
