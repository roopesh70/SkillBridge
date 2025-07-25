import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  projectId: "studio-w1rp4",
  appId: "1:967303337304:web:632c012dbe7dc43406812d",
  storageBucket: "studio-w1rp4.appspot.com",
  apiKey: "AIzaSyCUAjQXelwGmeh0H8EbEpnbymoIHlpgB7M",
  authDomain: "studio-w1rp4.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "967303337304",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence not available in this browser.');
    }
  });


export { app, auth, db, storage };
