
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDWmZb9Mh-7qityCN8q80e2nGDrliwzvW8",
  authDomain: "licenta-88287.firebaseapp.com",
  projectId: "licenta-88287",
  storageBucket: "licenta-88287.appspot.com",
  messagingSenderId: "580786294346",
  appId: "1:580786294346:web:3f9f267615c1baadb1a0b3",
  measurementId: "G-RDB12DS170"
};


export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db= getFirestore(app);