import { app } from "@/src/firebase-config";
import { getAuth, signOut } from "firebase/auth";

import toast from "react-hot-toast";

const auth = getAuth(app);

export default function Profile() {
  
  const logoutSTK = async () => {
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1>Hello User</h1>
      <button
        className="primary bg-purple-400 hover:bg-purple-600"
        onClick={() => logoutSTK()}
      >
        Çıkış yap
      </button>
    </div>
  );
}
