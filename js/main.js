import { checkAuth } from "./auth.js";
import { addTask, loadTasks } from "./tasks.js";
import { renderLeaderboard } from "./leaderboard.js";
import { initForm } from "./form.js";

window.addTask = addTask;

checkAuth(() => {

    console.log("Đã đăng nhập ✅");

    // nếu là trang thêm bài → bật form dynamic
    if (document.getElementById("type")) {
        console.log("Init form...");
        initForm();
    }

    // nếu là trang chủ → load tasks + leaderboard
    if (document.getElementById("tasks")) {
        console.log("Load tasks...");
        loadTasks(renderLeaderboard);
    }

});