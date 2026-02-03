import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmIBuR8ZM4uRsc1C9mtYo0MTwY76HM2dk",
  authDomain: "student-data-management-d6fd0.firebaseapp.com",
  projectId: "student-data-management-d6fd0",
  storageBucket: "student-data-management-d6fd0.firebasestorage.app",
  messagingSenderId: "765325009664",
  appId: "1:765325009664:web:66923e9a89be59043449e5",
  measurementId: "G-KD0744GM41"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db };

