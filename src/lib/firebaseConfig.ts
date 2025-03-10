import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIAXfoActPeHxl-6XeY0PNxb19L1LUhBU",
  authDomain: "auth-amandas.firebaseapp.com",
  projectId: "auth-amandas",
  storageBucket: "auth-amandas.firebasestorage.app",
  messagingSenderId: "640948085047",
  appId: "1:640948085047:web:0ada9f724ae15b719c3ab2",
  measurementId: "G-HTM7C6EY9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);
export { auth, googleProvider, signInWithPopup };