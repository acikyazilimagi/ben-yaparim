import {
  collection,
  query,
  updateDoc,
  getDocs,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";

export const getApplicants = async () => {
  try {
    const applicantsRef = collection(db, "applicants");
    const q = query(applicantsRef);
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

export const addApplicant = async (applicantData) => {
  try {
    await addDoc(collection(db, "applicants"), applicantData);
  } catch (error) {
    console.log(error);
  }
};

export const updateApplicantApprovedStatus = async (applicantId, status) => {
  try {
    const docRef = doc(db, "applicants", applicantId);
    await updateDoc(docRef, {
      approvedStatus: status,
    });
    return { approvedStatus };
  } catch (error) {
    console.log(error);
  }
};
