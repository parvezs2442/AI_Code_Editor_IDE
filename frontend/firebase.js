

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "ai-code-editor-14af2.firebaseapp.com",
  projectId: "ai-code-editor-14af2",
  storageBucket: "ai-code-editor-14af2.firebasestorage.app",
  messagingSenderId: "666603293685",
  appId: "1:666603293685:web:1ed40d8bc9ad190e9a6ebc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
