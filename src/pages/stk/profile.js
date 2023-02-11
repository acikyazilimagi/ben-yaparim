import React, { useState, useContext, useEffect } from "react";
import Router from "next/router";

import { Button, Chip } from "@material-tailwind/react";
import CallTabs from "@/components/CallTabs";
import Modal from "@/components/Modal";
import Collapse from "@/components/Collapse";
import Tooltip from "@/components/Tooltip";
import toast from "react-hot-toast";

import { CallContext } from "src/context/CallContext";
import { UserContext } from "@/src/context/UserContext";

import { app } from "@/src/firebase-config";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const auth = getAuth(app);

export default function StkProfile() {
  const [showModal, toggleModal] = useState(false);

  const { value, setValue } = useContext(UserContext);

  useEffect(() => {
    onAuthStateChanged(auth, (value) => {
      if (value) {
        console.log(auth.currentUser);
      } else {
        Router.push("/");
      }
    });
  }, [value]);

  return (
    <div>
      <h1>{value?.email}</h1>

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
          onClick={() => Router.push("/stk/open-call")}
        >
          +
        </Button>
        <Tooltip text="Yeni Çağrı Oluştur" />
      </div>
    </div>
  );
}
