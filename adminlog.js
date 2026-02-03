import { getAuth, signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from "./firebase.js";

const auth = getAuth(app);
const db = getFirestore(app);


window.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("RememberMe").checked = true;
    }
});

document.getElementById("admin-loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("RememberMe").checked;

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        if (rememberMe) {
            localStorage.setItem("adminEmail", email);
        } else {
            localStorage.removeItem("adminEmail");
        }


        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === "admin") {

                window.location.href = "admin-dash.html";
            } else {
                alert("This account is not an admin!");
            }
        } else {
            alert("No role found for this user in Firestore!");
        }
    } catch (error) {
        alert("Login failed: " + error.message);
    }
});