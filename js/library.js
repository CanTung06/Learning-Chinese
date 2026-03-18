import { db } from "./firebase.js";
import { checkAuth } from "./auth.js";
import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

checkAuth(() => {
    loadLibrary();
});

function loadLibrary() {
    const container = document.getElementById("libraryTasks");

    onSnapshot(collection(db, "tasks"), snapshot => {
        container.innerHTML = "";

        snapshot.forEach(docSnap => {
            const task = docSnap.data();
            const div = document.createElement("div");
            div.className = "task";

            const deadline = task.deadline.toDate();
            const expired = deadline < new Date();

            const nameMap = {
                me: "Cấn Xuân Tùng",
                friend: "Vương Khánh Ly"
            };

            const displayName = nameMap[task.assignedTo] || task.assignedTo;

            div.innerHTML = `
                <b>${displayName}</b> - ${deadline.toLocaleDateString("vi-VN")}<br>
            `;

            // Nội dung
            if (task.type === "image") {
                div.innerHTML += `<img src="${task.imageUrl}" width="120">`;
            } else if (task.type === "link") {
                div.innerHTML += `<a href="${task.content}" target="_blank">${task.content}</a>`;
            } else {
                div.innerHTML += `${task.content}`;
            }

            // Trạng thái
            if (task.completed) {
                div.innerHTML += `<br>✔️ Hoàn thành`;
                div.classList.add("done");
            }
            else if (task.failed || expired) {
                div.innerHTML += `<br>❌ Không hoàn thành`;
                div.classList.add("expired");
            }
            else {
                div.innerHTML += `<br>⏳ Đang chờ`;
            }

            container.appendChild(div);
        });
    });
}