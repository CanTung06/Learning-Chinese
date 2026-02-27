import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// validate ngày dd/mm/yyyy
function isValidDate(dateStr) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateStr);
}

// convert dd/mm/yyyy → Date
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
}

export async function addTask() {
    const type = document.getElementById("type").value;
    const user = document.getElementById("user").value;
    const deadlineStr = document.getElementById("deadline").value;

    if (!type || !user || !deadlineStr) {
        alert("Vui lòng nhập đầy đủ!");
        return;
    }

    if (!isValidDate(deadlineStr)) {
        alert("Nhập đúng định dạng dd/mm/yyyy");
        return;
    }

    const deadline = parseDate(deadlineStr);

    let content = "";
    let imageUrl = "";

    if (type === "image") {
        const file = document.getElementById("imageFile")?.files[0];

        if (!file) {
            alert("Chọn ảnh!");
            return;
        }

        imageUrl = URL.createObjectURL(file);
    } else {
        content = document.getElementById("content")?.value;

        if (!content) {
            alert("Nhập nội dung!");
            return;
        }
    }

    await addDoc(collection(db, "tasks"), {
        type,
        content,
        imageUrl,
        assignedTo: user,
        deadline,
        completed: false,
        createdAt: new Date()
    });

    alert("Đã thêm!");

    // 🔥 RESET FORM
    document.getElementById("type").selectedIndex = 0;
    document.getElementById("user").selectedIndex = 0;
    document.getElementById("deadline").value = "";

    // xoá input động (text / link / image)
    document.getElementById("inputArea").innerHTML = "";
};

// LOAD TASK
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

            const now = new Date();
            const deadlineDate = new Date(task.deadline);
            const expired = deadlineDate < now;

            // AUTO SET FAILED
            if (expired && !task.completed && !task.failed) {
                updateDoc(doc(db, "tasks", id), {
                    failed: true
                });
            }

            div.innerHTML = `
                <b>${task.assignedTo}</b> - ${deadlineDate.toLocaleDateString()}<br>
            `;

            // HIỂN THỊ NỘI DUNG
            if (task.type === "image") {
                div.innerHTML += `<img src="${task.imageUrl}" width="120">`;
            } else {
                div.innerHTML += `${task.content}`;
            }

            // TRẠNG THÁI
            if (task.completed) {
                div.innerHTML += `<br>Hoàn thành`;
                div.classList.add("done");
            }
            else if (task.failed || expired) {
                div.innerHTML += `<br>Không hoàn thành`;
                div.classList.add("expired");
            }
            else {
                const btn = document.createElement("button");
                btn.innerText = "✔️";
                btn.onclick = () => completeTask(id);
                div.appendChild(btn);
            }
            // 🔥 NÚT XOÁ
            const deleteBtn = document.createElement("span");
            deleteBtn.innerText = "🗑 Xoá";
            deleteBtn.className = "delete-btn";

            deleteBtn.onclick = async () => {
                const confirmDelete = confirm("Bạn có muốn xoá bài này không?");
                
                if (confirmDelete) {
                    await deleteDoc(doc(db, "tasks", id));
                }
            };

            div.appendChild(deleteBtn);

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