import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const db = getFirestore();
const container = document.getElementById("complaintContainer");

const q = query(
    collection(db, "complaints"),
    orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
    container.innerHTML = "";

    if (snapshot.empty) {
        container.innerHTML = "<p>No complaints found</p>";
        return;
    }

    snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const div = document.createElement("div");
        div.className = "complaint-box";

        div.innerHTML = `
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Class:</b> ${data.class}</p>
            <p><b>Department:</b> ${data.department}</p>
            <p><b>Complaint:</b> ${data.complaint}</p>
            <small>${data.email}</small><br><br>

            <button class="delete-btn">Delete</button>
            <button class="resolve-btn">Resolve</button>
        `;


        div.querySelector(".delete-btn").addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete this complaint?")) {
                await deleteDoc(doc(db, "complaints", docSnap.id));
            }
        });


        div.querySelector(".resolve-btn").addEventListener("click", async () => {
            if (confirm("Mark this complaint as resolved?")) {

                await updateDoc(doc(db, "complaints", docSnap.id), {
                    status: "resolved",
                    resolvedAt: new Date()
                });

                emailjs.send(
                    "service_56qp39q",
                    "template_svmmmqq",
                    {
                        email: data.email,
                        student_name: data.name,
                        complaint_id: docSnap.id
                    }
                ).then(() => {
                    alert("Complaint resolved & mail sent to student");
                }).catch((error) => {
                    alert("Resolved but email failed");
                    console.error(error);
                });
            }
        });

        container.appendChild(div);
    });
});