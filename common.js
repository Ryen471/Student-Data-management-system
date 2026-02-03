document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");


    if (logoutBtn && !logoutBtn.hasAttribute("data-firebase")) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "portal.html";
        });
    }
});
