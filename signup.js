import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


document.getElementById("signupform").addEventListener("submit", async (e) => {
    e.preventDefault();


    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="Confirmpassword"]').value;


    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        await setDoc(doc(db, "users", user.uid), {
            role: "student",
            email: email,
            createdAt: new Date().toISOString()
        });

        alert("Account created successfully! Please log in.");
        window.location.href = "studentlog.html";
    } catch (error) {
        alert("Signup failed: " + error.message);
    }
});