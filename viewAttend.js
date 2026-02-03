import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const classDropdown = document.getElementById("Class-dropdown");
const deptDropdown = document.getElementById("Department-dropdown");
const dateInput = document.getElementById("search-date");
const tableBody = document.getElementById("reportData");

window.getLedgerReport = async function () {
    const year = classDropdown.value;
    const department = deptDropdown.value;
    const date = dateInput.value;

    if (!year || !department || !date) {
        alert("Select Date, Class and Department");
        return;
    }

    tableBody.innerHTML = "";

    const monthYear = date.slice(0, 7);

    const q = query(
        collection(db, "attendance"),
        where("year", "==", year),
        where("department", "==", department),
        where("monthYear", "==", monthYear)
    );

    const snap = await getDocs(q);

    let studentMap = {};
    let lectureSet = new Set();

    snap.forEach(doc => {
        const d = doc.data();

        lectureSet.add(d.date + "_" + d.subject);

        if (!studentMap[d.studentId]) {
            studentMap[d.studentId] = {
                name: d.name,
                present: 0
            };
        }

        if (d.status === "P") {
            studentMap[d.studentId].present++;
        }
    });

    const totalLectures = lectureSet.size;

    if (totalLectures === 0) {
        tableBody.innerHTML =
            "<tr><td colspan='10'>No data found</td></tr>";
        return;
    }

    Object.keys(studentMap)
        .sort((a, b) => a - b)
        .forEach(id => {
            const s = studentMap[id];
            const percent = ((s.present / totalLectures) * 100).toFixed(2);

            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${id}</td>
        <td>${s.name}</td>
        <td colspan="7">${s.present} / ${totalLectures}</td>
        <td>${percent}%</td>
      `;
            tableBody.appendChild(tr);
        });
};