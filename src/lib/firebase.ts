import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
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
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});
const storage = getStorage(app);


export { app, auth, db, storage };
