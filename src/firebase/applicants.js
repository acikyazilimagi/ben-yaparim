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
import { getUser } from "./users";

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
    await addDoc(collection(db, "applicants"), {
      callID: id,
      uid: currentUser?.uid,
      approvedStatus: false,
    });
  } catch (error) {
    console.log(error);
  }
};


export const updateApplicantApprovedStatus = async (id) => {
  try {
    const { currentUser } = auth;
    const collectionRef = collection(db, "applicants");
    const q = query(collectionRef, where("uid", "==", currentUser?.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await updateDoc(doc(db, "applicants", document.id), {
        approvedStatus: true,
      });//update user applied call status
    });
  } catch (error) {
    console.log(error);
  }
};
