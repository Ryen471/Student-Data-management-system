import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function addActivity(text) {
    await addDoc(collection(db, "activities"), {
        text,
        time: serverTimestamp()
    });
}

const form = document.getElementById("studentForm");

const editData = localStorage.getItem("editStudent");
let editDocId = null;

if (editData) {
    const s = JSON.parse(editData);
    editDocId = s.docId;

    document.getElementById("std-name").value = s.name || "";
    document.getElementById("father-ipt-id").value = s.father || "";
    document.getElementById("mother-ipt-id").value = s.mother || "";
    document.getElementById("std-email-id").value = s.email || "";
    document.getElementById("mobile-id").value = s.mobile || "";
    document.getElementById("dob-id").value = s.dob || "";
    document.getElementById("aadhar-id").value = s.aadhar || "";
    document.getElementById("blood-group").value = s.blood || "";
    document.getElementById("admission-date").value = s.admissionDate || "";
    document.getElementById("emergency-id").value = s.emergency || "";

    document.getElementById("country-status").value = s.residency || "";
    document.getElementById("std-address").value = s.address || "";
    document.getElementById("state-id").value = s.state || "";
    document.getElementById("district-id").value = s.district || "";
    document.getElementById("taluka-id").value = s.taluka || "";
    document.getElementById("city-id").value = s.city || "";
    document.getElementById("pincode-id").value = s.pincode || "";

    document.getElementById("ssc-marks").value = s.ssc || "";
    document.getElementById("hsc-marks").value = s.hsc || "";
    document.getElementById("degree-level").value = s.degree || "";
    document.getElementById("dept-id").value = s.department || "";
    document.getElementById("course-id").value = s.course || "";
    document.getElementById("year-id").value = s.year || "";

    if (s.gender === "Male") document.getElementById("male-id").checked = true;
    if (s.gender === "Female") document.getElementById("female-id").checked = true;

    document.getElementById("submitBtn").innerText = "Update Student";
}

async function getNextStudentId() {
    const snap = await getDocs(collection(db, "students"));
    return snap.size + 1;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gender =
        document.querySelector('input[name="gender"]:checked')?.value || "";


    const name = document.getElementById("std-name").value.trim();
    const email = document.getElementById("std-email-id").value.trim();
    const mobile = document.getElementById("mobile-id").value.trim();
    const aadhar = document.getElementById("aadhar-id").value.trim();
    const ssc = document.getElementById("ssc-marks").value.trim();
    const hsc = document.getElementById("hsc-marks").value.trim();
    const dept = document.getElementById("dept-id").value;
    const course = document.getElementById("course-id").value;
    const year = document.getElementById("year-id").value;

    if (!name || !email || !mobile) {
        alert("Please fill all required fields");
        return;
    }

    if (!gender) {
        alert("Please select gender");
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert("Invalid email format");
        return;
    }

    if (!/^\d{10}$/.test(mobile)) {
        alert("Mobile number must be 10 digits");
        return;
    }

    if (aadhar && !/^\d{12}$/.test(aadhar)) {
        alert("Aadhar number must be 12 digits");
        return;
    }

    if (ssc && isNaN(ssc)) {
        alert("SSC marks must be numeric");
        return;
    }

    if (hsc && isNaN(hsc)) {
        alert("HSC marks must be numeric");
        return;
    }

    if (!dept || !course || !year) {
        alert("Please select Department, Course and Year");
        return;
    }



    const studentData = {
        name,
        father: document.getElementById("father-ipt-id").value.trim(),
        mother: document.getElementById("mother-ipt-id").value.trim(),
        email,
        mobile,
        dob: document.getElementById("dob-id").value,
        gender,
        aadhar,
        blood: document.getElementById("blood-group").value,
        admissionDate: document.getElementById("admission-date").value,
        emergency: document.getElementById("emergency-id").value.trim(),
        residency: document.getElementById("country-status").value,
        address: document.getElementById("std-address").value.trim(),
        state: document.getElementById("state-id").value.trim(),
        district: document.getElementById("district-id").value.trim(),
        taluka: document.getElementById("taluka-id").value.trim(),
        city: document.getElementById("city-id").value.trim(),
        pincode: document.getElementById("pincode-id").value.trim(),
        ssc,
        hsc,
        degree: document.getElementById("degree-level").value,
        department: dept,
        course,
        year
    };

    try {
        if (editDocId) {
            await updateDoc(doc(db, "students", editDocId), studentData);
            await addActivity(`Student updated: ${studentData.name}`);
            localStorage.removeItem("editStudent");
            alert("Student Updated Successfully");
        } else {
            studentData.studentId = await getNextStudentId();
            await addDoc(collection(db, "students"), studentData);
            await addActivity(`New student added: ${studentData.name}`);
            alert("Student Added Successfully");
        }

        window.location.href = "search.html";
    } catch (err) {
        alert("Error: " + err.message);
    }
});