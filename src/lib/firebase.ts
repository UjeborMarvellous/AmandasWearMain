import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVw2ZgSJxcLpqw9d3lKYK-K8pcABebt38",
  authDomain: "amandaswears-195d6.firebaseapp.com",
  projectId: "amandaswears-195d6",
  storageBucket: "amandaswears-195d6.firebasestorage.app",
  messagingSenderId: "950755656840",
  appId: "1:950755656840:web:bf10440ec2aa8235b48b3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword };