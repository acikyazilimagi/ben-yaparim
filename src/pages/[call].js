import Router from "next/router";
import { useEffect, useState } from "react";

import { db } from "@/src/firebase-config";
import { collection, getDocs, doc, getDoc  } from "firebase/firestore";

export default function CallDetail({ call_details }) {
  const [details, setDetails] = useState();

  useEffect(() => {
    setDetails(call_details);
  }, []);

  return <h1>Hey</h1>;
}

export async function getStaticPaths() {
  let paths = [];

  try {
    const querySnapshot = await getDocs(collection(db, "requests"));
    
    querySnapshot.forEach((doc) => {
      paths.push({params: { call: doc?.id}})
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

    const path_string = call_details?.data()?.toString()

    return path_string ? { props: { path_string } } : { notFound: true };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}