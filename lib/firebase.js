// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpPmsLkDg56F2TbKpaUYgyVzlt2xEDvAM",
  authDomain: "dogr-40e52.firebaseapp.com",
  projectId: "dogr-40e52",
  storageBucket: "dogr-40e52.appspot.com",
  messagingSenderId: "104679912117",
  appId: "1:104679912117:web:6b9b2e7a8032460c4e44fc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
