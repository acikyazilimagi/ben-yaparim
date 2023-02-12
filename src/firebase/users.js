import {
    collection,
    query,
    getDocs,
    getDoc,
    setDoc,
    collection,
  } from "firebase/firestore";
  
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
        data.push(doc.data);
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getUser = async (id) => {
    try {
      const docRef = doc(db, "users", id);
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
  