// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXlkLqwfkOlbg2z_5VrYgulYg1KWO-Phc",
  authDomain: "web-app-a2fc5.firebaseapp.com",
  projectId: "web-app-a2fc5",
  storageBucket: "web-app-a2fc5.firebasestorage.app",
  messagingSenderId: "620783267369",
  appId: "1:620783267369:web:ece6561df740d6e3853638",
  measurementId: "G-K5QMR2WNGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app)

export default db;