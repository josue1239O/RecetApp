import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "recetapp-bfa4a",
  appId: "1:563753976685:web:1939e7d797ee59a3a4d064",
  storageBucket: "recetapp-bfa4a.firebasestorage.app",
  apiKey: "AIzaSyAbvi59BhkG-6kaBsDrsA53aApHZwSmDr8",
  authDomain: "recetapp-bfa4a.firebaseapp.com",
  messagingSenderId: "563753976685",
  measurementId: "G-0W2MTVHVS3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  setDoc,
  deleteDoc
};
