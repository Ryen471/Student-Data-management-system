import { auth, db } from "./firebase.js";
import { onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    collection,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let usernameSet = false;
let lastSeenNoticeTime = localStorage.getItem("lastSeenNoticeTime");


onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "portal.html";
        return;
    }

    if (!usernameSet) {
        const username = user.email.split("@")[0];
        document.getElementById("welcomeText").innerText =
            `Welcome, ${username}`;
        usernameSet = true;
    }

    loadNotices();
});


function loadNotices() {
    const noticeBox = document.getElementById("notice");
    const noticeText = document.getElementById("notice-text");
    const indicator = document.getElementById("notice-indicator");

    const modal = document.getElementById("noticeModal");
    const popupText = document.getElementById("popup-notice-text");
    const closeBtn = document.getElementById("closeNotice");

    const q = query(
        collection(db, "notices"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            noticeText.innerText = "No notice available";
            popupText.innerHTML = "<p>No notice available</p>";
            indicator.style.display = "none";
            return;
        }


        const latest = snapshot.docs[0].data();
        const latestTime = latest.createdAt?.seconds;

        noticeText.innerHTML = `<strong>${latest.title}</strong>`;

        if (!lastSeenNoticeTime || latestTime > lastSeenNoticeTime) {
            indicator.style.display = "inline";
        } else {
            indicator.style.display = "none";
        }


        popupText.innerHTML = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            const time = data.createdAt?.seconds || 0;

            const div = document.createElement("div");
            div.className = "notice-item";

            div.innerHTML = `
                <div class="notice-title">${data.title}</div>
                <div class="notice-msg">${data.msg}</div>
            `;

            div.onclick = () => {
                div.classList.toggle("active");

                if (!lastSeenNoticeTime || time > lastSeenNoticeTime) {
                    localStorage.setItem("lastSeenNoticeTime", time);
                    lastSeenNoticeTime = time;
                    indicator.style.display = "none";
                }
            };

            popupText.appendChild(div);
        });
    });


    noticeBox.onclick = () => modal.style.display = "block";


    closeBtn.onclick = () => modal.style.display = "none";

    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
}