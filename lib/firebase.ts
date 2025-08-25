// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB752l-nqWOrJ0qemqOyJ4npoZfqJcjqjg",
  authDomain: "gobrew-45ef1.firebaseapp.com",
  projectId: "gobrew-45ef1",
  storageBucket: "gobrew-45ef1.appspot.com",
  messagingSenderId: "149103166569",
  appId: "1:149103166569:web:e7c36ee002af5915038ef8",
  measurementId: "G-PRFHYQJWHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


export const auth = getAuth(app);
export { db, storage };
