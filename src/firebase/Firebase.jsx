import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEjBlsf5vjOdm8-7mceRUIVGK_RRImJ2A",
  authDomain: "taskmanagementapp-backend.firebaseapp.com",
  projectId: "taskmanagementapp-backend",
  storageBucket: "taskmanagementapp-backend.appspot.com",
  messagingSenderId: "316293709375",
  appId: "1:316293709375:web:16e60a8a35314c9023428a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
