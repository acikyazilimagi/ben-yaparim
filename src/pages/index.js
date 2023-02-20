import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Card from "@/components/Card";
import { getAllCalls } from "@/src/firebase/calls";
import { UserContext } from "../context/UserContext";
import CircleDown from "@/src/components/icons/CircleDown";

export default function Home() {
  const [calls, setCalls] = useState([]);

  const { profileData } = useContext(UserContext);

  useEffect(() => {
    getAllCalls().then((data) => setCalls(data));
  }, []);

  return (
    <div className="m-10 lg:mx-36 pb-10">
      <Head>
        <title>Ben Yaparım!</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <p className="text-6xl text-center text-pink-600 mt-4 font-bold font-marker">
            BEN YAPARIM
          </p>
          <p className="text-center max-w-xl w-1/2 m-auto my-20">
            Ben Yaparım! <br /> Afet zamanlarında belli yetkinliklere sahip acil
            gönüllü ihtiyacı duyan kurumlarla, bu ihtiyacı karşılayabilecek
            gönüllü uzmanları bir araya getiren platformdur.
          </p>

          <p className="text-xl text-center text-pink-600  font-bold">
            Aktif çağrıları incele
          </p>
          <CircleDown className="w-10 h-10 m-auto mb-10" />
        </div>
       
        <div className="grid lg:grid-cols-2 gap-14 m-auto p-24 justify-center">
          {calls
            ?.filter((call) => {
              return call.isActive;
            })
            .map((call, i) => {
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
                  otherSkills={call?.otherSkills}
                  location={call?.location}
                  id={call.id}
                  role={profileData?.role === "volunteer" ? "volunteer" : "stk"}
                  status={
                    call?.applicants?.find(
                      (applicant) => applicant?.uid === profileData?.uid
                    )?.approvedStatus
                  }
                />
              );
            })}
        </div>
      </main>
    </div>
  );
}
