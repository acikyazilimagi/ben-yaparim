import {
  collection,
  query,
  updateDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  addDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { getUser, updateUserAppliedCalls } from "./users";

export const getApplicants = async () => {
  try {
    const applicantsRef = collection(db, "applicants");
    const q = query(applicantsRef);
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return await Promise.all(
      data.map(async (applicant) => {
        const user = await getUser(applicant.uid);
        return { ...user, applicant };
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const getApplicant = async (id) => {
  try {
    const docRef = doc(db, "applicants", id);
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

export const addApplicant = async (id) => {
  try {
    const { currentUser } = auth;
    await setDoc(
      doc(db, "applicants", id),
      {
        callID: id,
        uid: currentUser?.uid,
        approvedStatus: false,
      },
      { merge: true }
    );
  } catch (error) {
    console.log(error);
  }
};

export const updateApplicantApprovedStatus = async (callID, userID) => {
  try {
    //TODO: MOVE THIS INTO FIREBASE
    const { currentUser } = auth;
    const collectionRef = collection(db, "applicants");
    const q = query(collectionRef, where("uid", "==", currentUser?.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await updateDoc(doc(db, "applicants", document.id), {
        approvedStatus: true,
      });
    });

    updateUserAppliedCalls(userID, callID, "approved");
  } catch (error) {
    console.log(error);
  }
};
