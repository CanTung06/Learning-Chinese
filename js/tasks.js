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

            const deadlineDate = task.deadline.toDate();
            const now = new Date();
            const expired = deadlineDate < now;

            // AUTO SET FAILED
            // if (expired && !task.completed && !task.failed) {
            //     updateDoc(doc(db, "tasks", id), {
            //         failed: true
            //     });
            // }

            // ❗ Chỉ hiển thị task chưa hoàn thành và chưa fail
            allTasks.push(task);

            if (task.completed || task.failed) {
                return;
            }

            const div = document.createElement("div");
            div.className = "task";

            const nameMap = {
                me: "Cấn Xuân Tùng",
                friend: "Vương Khánh Ly"
            };

            const displayName = nameMap[task.assignedTo] || task.assignedTo;

            div.innerHTML = `
                <span class="task-name ${task.assignedTo}">
                    ${displayName}
                </span> - ${deadlineDate.toLocaleDateString("vi-VN")}<br>
            `;

            // Nội dung
            if (task.type === "image") {
                div.innerHTML += `<img src="${task.imageUrl}" width="120">`;
            } else if (task.type === "link") {
                div.innerHTML += `<a href="${task.content}" target="_blank">${task.content}</a>`;
            } else {
                div.innerHTML += `${task.content}`;
            }

            const btn = document.createElement("button");
            btn.innerText = "✔️";
            btn.onclick = () => completeTask(id);
            div.appendChild(btn);

            // Nút xoá
            const deleteBtn = document.createElement("span");
            deleteBtn.innerText = "🗑 Xoá";
            deleteBtn.className = "delete-btn";

            deleteBtn.onclick = async () => {
                if (confirm("Bạn có muốn xoá bài này không?")) {
                    await deleteDoc(doc(db, "tasks", id));
                }
            };

            div.appendChild(deleteBtn);

            // Nút sửa
            const editBtn = document.createElement("span");
            editBtn.innerText = "✏️ Sửa";
            editBtn.className = "edit-btn";

            editBtn.onclick = () => {
                window.location.href = `add.html?id=${id}`;
            };

            div.appendChild(editBtn);

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