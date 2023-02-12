import { async } from "@firebase/util";
import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
export const addUser = async (userData) => {
  try {
    await addDoc(collection(db, "users"), userData);
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, "users", id));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUserAppliedCalls = async (id, callID) => {
  try {
    const userId = id ? id : auth?.currentUser?.uid;
    await updateDoc(doc(db, "users", userId), {
      appliedCalls: arrayUnion({ id: callID, status: "pending" }),
    });
  } catch (error) {}
};

export const getUserAppliedCalls = () => {
  try {
  } catch (error) {}
};
