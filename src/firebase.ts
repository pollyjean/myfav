import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZ-Bm7AroQOccK_87cOa24pEHz2KscQbg",
  authDomain: "myfav-6ea29.firebaseapp.com",
  projectId: "myfav-6ea29",
  storageBucket: "myfav-6ea29.appspot.com",
  messagingSenderId: "302881329918",
  appId: "1:302881329918:web:b3995f93677d0654adcbaf",
  measurementId: "G-K0ZCDBEHTP",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
