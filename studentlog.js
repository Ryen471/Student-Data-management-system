import { auth, db } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



window.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("studentEmail");
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("RememberMe").checked = true;
    }
});


document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("RememberMe").checked;

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        if (rememberMe) {
            localStorage.setItem("studentEmail", email);
        } else {
            localStorage.removeItem("studentEmail");
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User data not found in database");
            return;
        }

        const userData = userSnap.data();

        if (userData.role === "student") {

            sessionStorage.setItem("studentLoggedIn", "true");
            sessionStorage.setItem("studentName", userData.name || "Student");

            window.location.href = "std-dash.html";
        } else {
            alert("This account is not a student");
        }

    } catch (error) {
        alert("Login failed: " + error.message);
    }
});




onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.email);
    } else {
        console.log("No user logged in");
    }
});