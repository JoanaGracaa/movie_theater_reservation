// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyA3JTUkMKpUm9zACJdoaGFElqhxhk9wloI",
  authDomain: "site-job-founder.firebaseapp.com",
  projectId: "site-job-founder",
  storageBucket: "site-job-founder.appspot.com",
  messagingSenderId: "427971884853",
  appId: "1:427971884853:web:77c028649a1745d43a3e7c"
};


// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);

const auth = getAuth(fireBaseApp)
const db = getFirestore(fireBaseApp)
const storage = getStorage(fireBaseApp)

export {auth, db, storage}