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

//BEN YAPARIM! buttonunda uid gonderilmiyor cunku user.uid var
//Admin approve/reject ettiginde ise id gonderilmeli
export const updateUserAppliedCalls = async (id, callID, status) => {
  try {
    const userId = id ? id : auth?.currentUser?.uid;

    const user = await getUser(userId);

    const appliedCalls = user?.appliedCalls || [];
    /////////TODO: REVIEW HERE
    const updatedAppliedCalls = appliedCalls.map((call) => {
      if (call.id === callID) {
        return { ...call, status };
      }
      return call;
    });

    await updateDoc(doc(db, "users", userId), {
      appliedCalls: updatedAppliedCalls,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserAppliedCalls = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      return userDoc.data().appliedCalls;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
};
