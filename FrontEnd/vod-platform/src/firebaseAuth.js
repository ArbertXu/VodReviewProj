// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPlt_x7djaM7cSsTiCs_gcinz2mVx-fL4",
  authDomain: "vodreview-7051e.firebaseapp.com",
  projectId: "vodreview-7051e",
  storageBucket: "vodreview-7051e.firebasestorage.app",
  messagingSenderId: "298695751119",
  appId: "1:298695751119:web:fbc97bb45040032b0aceba",
  measurementId: "G-SD9600N8S9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {auth, signInWithEmailAndPassword}