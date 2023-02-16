import {
  collection,
  query,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/src/firebase-config";
import { getUser, updateUserAppliedCalls } from "./users";

export const addCall = async (callData) => {
  try {
    await addDoc(collection(db, "calls"), callData);
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
      data.push({ ...doc.data(), id: doc.id });
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

export const getApplicantsMetaData = async (applicants) => {
  try {
    return await Promise.all(
      applicants?.map(async (applicant) => {
        const user = await getUser(applicant.uid);
        return { ...user, applicant };
      })
    );
  } catch (err) {
    console.log(err);
  }
};

export const addApplicantToCallDoc = async (callID, applicantID) => {
  try {
    const callDoc = doc(db, "calls", callID);
    const call = await getCall(callID);

    const callApplicants = call?.applicants || [];

    await setDoc(
      callDoc,
      {
        applicants: [
          ...callApplicants,
          { uid: applicantID, approvedStatus: "pending" },
        ],
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateApplicantStatus = async (callID, applicantID, status) => {
  try {
    const callDoc = doc(db, "calls", callID);
    const call = await getCall(callID);
    const callApplicants = call?.applicants || [];

    const updatedApplicants = callApplicants.map((applicant) => {
      if (applicant.uid === applicantID) {
        return { ...applicant, approvedStatus: status };
      }
      return applicant;
    });
    await updateUserAppliedCalls(applicantID, callID, status);

    await setDoc(callDoc, { applicants: updatedApplicants }, { merge: true });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const closeCall = async (callID) => {
  try {
    const closeCall = await updateDoc(doc(db, "calls", callID),{
      isActive: false,
    });
    console.log('closed call')
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
