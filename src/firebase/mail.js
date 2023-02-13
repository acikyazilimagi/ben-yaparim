import { collection, addDoc } from "firebase/firestore";
import { db } from "@/src/firebase-config";

export async function sendMail (recipient, mailSubject, mailBody){
  try{
    await addDoc(collection(db, 'email'), {
      to: recipient,
      message: {
        subject: mailSubject,
        html: mailBody,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
