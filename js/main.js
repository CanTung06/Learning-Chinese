import { checkAuth } from "./auth.js";
import { addTask, loadTasks } from "./tasks.js";
import { renderLeaderboard } from "./leaderboard.js";
import { initForm } from "./form.js";

window.addTask = addTask;

// 🔥 CHẠY FORM NGAY - KHÔNG CHỜ AUTH
window.addEventListener("load", () => {
    console.log("Page loaded ✅");

    const typeEl = document.getElementById("type");

    if (typeEl) {
        console.log("Init form...");
        initForm();
    }
});

// 🔐 AUTH chạy riêng
checkAuth(() => {
    console.log("Auth OK ✅");

    if (document.getElementById("tasks")) {
        loadTasks(renderLeaderboard);
    }
});