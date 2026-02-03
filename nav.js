import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        alert("Logged out successfully!");
        window.location.href = "portal.html";
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  });
}