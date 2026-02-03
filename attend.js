import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("attendanceTable");
const subjectDropdown = document.getElementById("subject-dropdown");
const classDropdown = document.getElementById("Class-dropdown");
const deptDropdown = document.getElementById("Department-dropdown");
const dateInput = document.getElementById("search-date");

const teacherId = "teacher_01";
let students = [];

dateInput.value = new Date().toISOString().split("T")[0];


async function loadStudents() {
    table.innerHTML = "";
    students = [];

    if (!classDropdown.value || !deptDropdown.value) return;

    const snap = await getDocs(collection(db, "students"));

    snap.forEach(doc => {
        const s = doc.data();
        if (s.year === classDropdown.value && s.department === deptDropdown.value) {
            students.push(s);
        }
    });

    students.sort((a, b) => a.studentId - b.studentId);
    renderTable();
}


function renderTable() {
    table.innerHTML = "";

    students.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${s.studentId}</td>
      <td>${s.name}</td>
      <td>
        <input type="radio" name="att_${s.studentId}" value="P" checked> P
        <input type="radio" name="att_${s.studentId}" value="A"> A
      </td>
    `;
        table.appendChild(tr);
    });
}

classDropdown.addEventListener("change", loadStudents);
deptDropdown.addEventListener("change", loadStudents);


window.saveAttendance = async function () {
    const date = dateInput.value;
    const subject = subjectDropdown.value;
    const year = classDropdown.value;
    const department = deptDropdown.value;

    if (!date || !subject || !year || !department) {
        alert("Fill all fields");
        return;
    }

    const monthYear = date.slice(0, 7);


    const q = query(
        collection(db, "attendance"),
        where("date", "==", date),
        where("subject", "==", subject),
        where("year", "==", year),
        where("department", "==", department)
    );

    const snap = await getDocs(q);
    for (let d of snap.docs) {
        await deleteDoc(d.ref);
    }


    for (let s of students) {
        const status = document.querySelector(
            `input[name="att_${s.studentId}"]:checked`
        ).value;

        await addDoc(collection(db, "attendance"), {
            studentId: s.studentId,
            name: s.name,
            subject,
            year,
            department,
            date,
            monthYear,
            status,
            teacherId
        });
    }

    alert("Attendance saved successfully (No duplicate lectures)");
};