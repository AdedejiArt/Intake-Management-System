// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNzbXP5EhrabJr-S6d_pUvQvADJBfwwNM",
  authDomain: "legaltaskmanager.firebaseapp.com",
  projectId: "legaltaskmanager",
  storageBucket: "legaltaskmanager.appspot.com",
  messagingSenderId: "679440747021",
  appId: "1:679440747021:web:53454b4d6fecf8c69fe344"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const storage = getStorage(app)