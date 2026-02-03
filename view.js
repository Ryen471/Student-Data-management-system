import { db } from "./firebase.js";
import {
    doc,
    getDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


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

const deleteBtn = document.getElementById("deleteBtn");


const studentDocId = localStorage.getItem("viewStudentId");

if (!studentDocId) {
    alert("No student selected");
    window.location.href = "search.html";
}


async function loadStudent() {
    try {
        const ref = doc(db, "students", studentDocId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            alert("Student not found");
            window.location.href = "search.html";
            return;
        }

        const s = snap.data();

        nameEl.innerText = `Student Name: ${s.name || ""}`;
        rollEl.innerText = s.studentId || "";

        dobEl.innerText = s.dob || "";
        genderEl.innerText = s.gender || "Not specified";
        bloodEl.innerText = s.blood || "";
        aadharEl.innerText = s.aadhar || "";
        parentsEl.innerText = `${s.father || ""} ${s.mother || ""}`;


        admDateEl.innerText = s.admissionDate || "";
        courseEl.innerText = s.course || "";
        deptEl.innerText = s.department || "";
        classEl.innerText = s.year || "";


        mobileEl.innerText = s.mobile || "";
        emergencyEl.innerText = s.emergency || "";
        emailEl.innerText = s.email || "";


        cityEl.innerText = s.city || "";
        stateEl.innerText = s.state || "";
        talukaEl.innerText = s.taluka || "";
        pincodeEl.innerText = s.pincode || "";

    } catch (err) {
        alert("Error loading student");
        console.error(err);
    }
}

loadStudent();

deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, "students", studentDocId));
        localStorage.removeItem("viewStudentId");
        alert("Student deleted successfully");
        window.location.href = "search.html";
    } catch (err) {
        alert("Error deleting student");
        console.error(err);
    }
});