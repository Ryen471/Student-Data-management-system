import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    collection,
    query,
    where,
    getDocs
} from
    "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const nameEl = document.getElementById("name");
const rollEl = document.getElementById("roll");
const dobEl = document.getElementById("dob");
const genderEl = document.getElementById("gender");
const bloodEl = document.getElementById("bloodGroup");
const aadharEl = document.getElementById("aadhar");
const parentsEl = document.getElementById("parentsName");

const admDateEl = document.getElementById("admDate");
const courseEl = document.getElementById("course");
const deptEl = document.getElementById("department");
const classEl = document.getElementById("class");

const mobileEl = document.getElementById("mobile");
const emergencyEl = document.getElementById("emergency");
const emailEl = document.getElementById("email");

const cityEl = document.getElementById("city");
const stateEl = document.getElementById("state");
const talukaEl = document.getElementById("taluka");
const pincodeEl = document.getElementById("pincode");


onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Student not logged in");
        window.location.href = "portal.html";
        return;
    }

    loadStudentData(user.email);
});

async function loadStudentData(email) {
    const q = query(
        collection(db, "students"),
        where("email", "==", email)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        alert("Student data not found");
        return;
    }

    const s = snap.docs[0].data();


    nameEl.innerText = `Student Name: ${s.name || ""}`;
    rollEl.innerText = s.studentId || "";


    dobEl.innerText = s.dob || "";
    genderEl.innerText = s.gender || "";
    bloodEl.innerText = s.blood || "";
    aadharEl.innerText = s.aadhar || "";
    parentsEl.innerText = `${s.father || ""} / ${s.mother || ""}`;

    admDateEl.innerText = s.admissionDate || "";
    courseEl.innerText = s.course || "";
    deptEl.innerText = s.department || "";
    classEl.innerText = `${s.year || ""} (${s.degree || ""})`;


    mobileEl.innerText = s.mobile || "";
    emergencyEl.innerText = s.emergency || "";
    emailEl.innerText = s.email || "";


    cityEl.innerText = s.city || "";
    stateEl.innerText = s.state || "";
    talukaEl.innerText = s.taluka || "";
    pincodeEl.innerText = s.pincode || "";
}