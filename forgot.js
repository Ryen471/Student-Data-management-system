import { auth } from "./firebase.js";
import { sendPasswordResetEmail }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


document.getElementById("button").addEventListener("click", async () => {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent! Check your email inbox.");

    window.location.href = "studentlog.html";
  } catch (error) {
    alert("Error sending reset email: " + error.message);
  }
});