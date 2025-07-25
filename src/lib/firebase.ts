import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "studio-w1rp4",
  appId: "1:967303337304:web:632c012dbe7dc43406812d",
  storageBucket: "studio-w1rp4.firebasestorage.app",
  apiKey: "AIzaSyCUAjQXelwGmeh0H8EbEpnbymoIHlpgB7M",
  authDomain: "studio-w1rp4.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "967303337304",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
