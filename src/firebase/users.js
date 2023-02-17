import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { getCall } from "./calls";
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

export const getUser = async (uid) => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
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

export const updateUser = async (uid, data) => {
  try {
    const user = await updateDoc(doc(db, "users", uid), data);
    return user;
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

    const updatedCalls = appliedCalls.filter((call) => call.id !== callID);

    await updateDoc(doc(db, "users", userId), {
      appliedCalls: [...updatedCalls, { id: callID, status: status }],
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
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

export const getUserAppliedCallsData = async (appliedCalls) => {
  return await Promise.all(
    appliedCalls?.map(async (call) => {
      const callData = await getCall(call.id);
      const mergedCalls = { ...callData, ...call };
      return mergedCalls;
    })
  );
};

export const checkUserAppliedCallDates = async (applicantID, proposedCall) => {
  try {
    //We do not need to consider rejected applications
    const userAppliedCallsRef = (await getUserAppliedCalls(applicantID)).filter(
      function (call) {
        return call.status !== "rejected";
      }
    );

    //Overlapping time intervals are calculated by the following clause
    //(start1 < end2 && start1 > start2) || (start2 < end1 && start2 > start1);
    const userBlockingAppliedCalls = (
      await getUserAppliedCallsData(userAppliedCallsRef)
    ).filter(function (call) {
      return (
        (call?.date?.startDate <= proposedCall?.date?.endDate &&
          call?.date?.startDate >= proposedCall?.date?.startDate) ||
        (proposedCall?.date?.startDate <= call?.date?.endDate &&
          proposedCall?.date?.startDate >= call?.date?.startDate)
      );
    });
    return userBlockingAppliedCalls.length > 0 ? false : true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
