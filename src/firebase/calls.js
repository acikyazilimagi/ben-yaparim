import {
  collection,
  query,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/src/firebase-config";

export const addCall = async (callData) => {
  let response;
  try {
    response = await addDoc(collection(db, "calls"), callData);
    console.log("res", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAllCalls = async () => {
  try {
    const callsRef = collection(db, "calls");
    const q = query(callsRef);
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data);
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCall = async (id) => {
  try {
    const docRef = doc(db, "calls", id);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
};
