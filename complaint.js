import { db, auth } from "./firebase.js";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.querySelector(".complaint-form");


const nameInput = document.getElementById("Std-name");
const classSelect = document.getElementById("std-class");
const courseSelect = document.getElementById("std-course");
const deptSelect = document.getElementById("std-depart");
const complaintInput = document.getElementById("student-complaint");

let realStudentData = null;


auth.onAuthStateChanged(async (user) => {
    if (!user) {
        alert("Please login again");
        return;
    }

    const q = query(
        collection(db, "students"),
        where("email", "==", user.email)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        alert("Student data not found");
        return;
    }

    snap.forEach(doc => {
        realStudentData = doc.data();


        nameInput.value = realStudentData.name;
        classSelect.value = realStudentData.year;
        courseSelect.value = realStudentData.course;
        deptSelect.value = realStudentData.department;


        nameInput.readOnly = true;
        classSelect.disabled = true;
        courseSelect.disabled = true;
        deptSelect.disabled = true;
    });
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!realStudentData) {
        alert("Student data not loaded");
        return;
    }

    try {
        await addDoc(collection(db, "complaints"), {
            name: realStudentData.name,
            class: realStudentData.year,
            course: realStudentData.course,
            department: realStudentData.department,
            complaint: complaintInput.value,
            email: auth.currentUser.email,
            createdAt: serverTimestamp(),
            status: "pending"
        });

        alert("Complaint submitted successfully");
        form.reset();

    } catch (err) {
        console.error(err);
        alert("Error submitting complaint");
    }
});