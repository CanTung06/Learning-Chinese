import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function addTask() {
    const content = document.getElementById("content").value;
    const user = document.getElementById("user").value;
    const deadline = document.getElementById("deadline").value;

    await addDoc(collection(db, "tasks"), {
        content,
        assignedTo: user,
        deadline,
        completed: false,
        createdAt: new Date()
    });
}

export function loadTasks(renderLeaderboard) {
    const container = document.getElementById("tasks");

    onSnapshot(collection(db, "tasks"), snapshot => {
        container.innerHTML = "";
        let allTasks = [];
        const now = new Date();

        snapshot.forEach(docSnap => {
            const task = docSnap.data();
            const id = docSnap.id;

            allTasks.push(task);

            const div = document.createElement("div");
            div.className = "task";

            const expired = new Date(task.deadline) < now;

            div.innerHTML = `
                <b>${task.content}</b><br>
                ${task.assignedTo} - ${task.deadline}
            `;

            if (!task.completed && !expired) {
                const btn = document.createElement("button");
                btn.innerText = "✔️";
                btn.onclick = () => completeTask(id);
                div.appendChild(btn);
            }

            container.appendChild(div);
        });

        renderLeaderboard(allTasks);
    });
}

async function completeTask(id) {
    await updateDoc(doc(db, "tasks", id), {
        completed: true,
        completedAt: new Date()
    });
}