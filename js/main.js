import { checkAuth } from "./auth.js";
import { addTask, loadTasks } from "./tasks.js";
import { renderLeaderboard } from "./leaderboard.js";

window.addTask = addTask;

checkAuth(() => {
    if (document.getElementById("tasks")) {
        loadTasks(renderLeaderboard);
    }
});