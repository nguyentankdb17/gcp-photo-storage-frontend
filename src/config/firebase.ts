// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwqTTteyMUwXlUYThoOaRcCzWEWVtBVdg",
    authDomain: "scenic-parity-455100-d4.firebaseapp.com",
    projectId: "scenic-parity-455100-d4",
    storageBucket: "scenic-parity-455100-d4.firebasestorage.app",
    messagingSenderId: "432052083194",
    appId: "1:432052083194:web:bac7f00c0acf80b352ac43",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
