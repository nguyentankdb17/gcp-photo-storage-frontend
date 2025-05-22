// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCxYmKQCBS-r8OtWc3pgMCIwZtFlsqFFQE",
    authDomain: "imagestorageauth.firebaseapp.com",
    projectId: "imagestorageauth",
    storageBucket: "imagestorageauth.firebasestorage.app",
    messagingSenderId: "394324927707",
    appId: "1:394324927707:web:6f9055cc3ef06a224258fe",
    measurementId: "G-DQD7FR15L2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// // Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAyV0vl_7l8rA622_Y9_SpZE2lU9ImunlI",
//     authDomain: "photo-cloud-storage-8ee3b.firebaseapp.com",
//     projectId: "photo-cloud-storage-8ee3b",
//     storageBucket: "photo-cloud-storage-8ee3b.firebasestorage.app",
//     messagingSenderId: "375143708925",
//     appId: "1:375143708925:web:d0f52d26142336cd89e694",
//     measurementId: "G-6J95KV88RZ",
// };

// // Initialize Firebase
// // // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
