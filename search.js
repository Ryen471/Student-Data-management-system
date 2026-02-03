import { db } from "./firebase.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");

let allStudents = [];

async function loadStudents() {
    const snap = await getDocs(collection(db, "students"));
    allStudents = [];

    snap.forEach(docu => {
        allStudents.push({ docId: docu.id, ...docu.data() });
    });

    allStudents.sort((a, b) => a.studentId - b.studentId);
    renderTable(allStudents);
}

function renderTable(data) {
    studentTable.innerHTML = "";

    data.forEach((s, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.studentId}</td>
            <td>${s.name}</td>
            <td>${s.department}</td>
            <td>${s.year}</td>
            <td>${s.mobile}</td>
            <td>
                <button onclick="viewStudent('${s.docId}')">View</button>
                <button onclick="updateStudent('${s.docId}')">Update</button>
            </td>
        `;
        studentTable.appendChild(tr);
    });
}

window.filterTable = function () {

    const text = searchInput.value.toLowerCase();

    const city = document.querySelector('select[name="city"]')?.value || "";
    const cls = document.querySelector('select[name="class"]')?.value || "";
    const dept = document.querySelector('select[name="Department"]')?.value || "";

    const filtered = allStudents.filter(s => {

        const matchText =
            text === "" ||
            s.name.toLowerCase().includes(text) ||
            s.studentId.toString().includes(text);


        const cityMap = {
            "Maharashtra": "Indian",
            "Outside Maharashtra": "Outside Maharashtra",
            "International": "NRI"
        };

        const matchCity =
            city === "" ||
            (s.residency && s.residency === cityMap[city]);
        const matchClass =
            cls === "" ||
            (s.year && s.year === cls);

        const matchDept =
            dept === "" ||
            (s.department && s.department.toLowerCase() === dept.toLowerCase());

        return matchText && matchCity && matchClass && matchDept;
    });

    renderTable(filtered);
};

window.viewStudent = function (id) {
    localStorage.setItem("viewStudentId", id);
    window.location.href = "view.html";
};

window.updateStudent = function (id) {
    const s = allStudents.find(x => x.docId === id);
    localStorage.setItem("editStudent", JSON.stringify(s));
    window.location.href = "add.html";
};

loadStudents();