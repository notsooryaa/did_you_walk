import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvJ1us5_7IM_-CLs3r0q5SDtbAmunFEKA",
  authDomain: "walk-tracker-cbbbb.firebaseapp.com",
  projectId: "walk-tracker-cbbbb",
  storageBucket: "walk-tracker-cbbbb.appspot.com",
  messagingSenderId: "946967382908",
  appId: "1:946967382908:web:057dd2ad1e798d145cf2f9"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };