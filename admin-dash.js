import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    deleteDoc,
    doc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const totalCountEl = document.getElementById("totalCount");
const activityList = document.getElementById("activitylist");

const noticeTitle = document.getElementById("noticeTitle");
const noticeMsg = document.getElementById("noticeMsg");
const postNoticeBtn = document.getElementById("postNoticeBtn");
const noticeList = document.getElementById("noticeList");


onSnapshot(collection(db, "students"), (snapshot) => {
    totalCountEl.innerText = snapshot.size;
});


export async function addActivity(text) {
    await addDoc(collection(db, "activities"), {
        text,
        time: serverTimestamp()
    });
}

const activityRef = query(
    collection(db, "activities"),
    orderBy("time", "desc")
);

onSnapshot(activityRef, (snapshot) => {
    activityList.innerHTML = "";

    snapshot.forEach((docSnap) => {
        const a = docSnap.data();

        const li = document.createElement("li");
        li.innerText = `${a.text} (${new Date(
            a.time?.toDate()
        ).toLocaleString()})`;

        activityList.appendChild(li);
    });
});


postNoticeBtn.addEventListener("click", async () => {
    const title = noticeTitle.value.trim();
    const msg = noticeMsg.value.trim();

    if (!title || !msg) {
        alert("Please fill all notice fields");
        return;
    }

    await addDoc(collection(db, "notices"), {
        title,
        msg,
        createdAt: serverTimestamp()
    });


    await addActivity("New notice posted");

    noticeTitle.value = "";
    noticeMsg.value = "";
});

const noticeRef = query(
    collection(db, "notices"),
    orderBy("createdAt", "desc")
);

onSnapshot(noticeRef, (snapshot) => {
    noticeList.innerHTML = "";

    snapshot.forEach((docSnap) => {
        const n = docSnap.data();

        const li = document.createElement("li");
        li.style.borderBottom = "1px solid #ddd";
        li.style.padding = "8px";

        li.innerHTML = `
      <strong>${n.title}</strong>
      <p>${n.msg}</p>
      <small>${new Date(n.createdAt?.toDate()).toLocaleString()}</small>
      <br>
      <button class="delete-notice delete-btn">Delete</button>
    `;

        li.querySelector(".delete-notice").addEventListener("click", async () => {
            if (confirm("Delete this notice?")) {
                await deleteDoc(doc(db, "notices", docSnap.id));


                await addActivity("Notice deleted");
            }
        });

        noticeList.appendChild(li);
    });
});


noticeList.style.maxHeight = "300px";
noticeList.style.overflowY = "auto";

activityList.style.maxHeight = "300px";
activityList.style.overflowY = "auto";