import { auth, db } from "./firebase.js";
import {
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// LOGIN
window.login = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        alert("Sai tài khoản!");
    }
};

// LOGOUT
window.logout = async function () {
    await signOut(auth);
    location.reload();
};

// CHECK LOGIN
onAuthStateChanged(auth, user => {
    if (user) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("app").style.display = "block";
        loadTasks();
    }
});

// ADD TASK
window.addTask = async function () {
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
};

// LOAD REALTIME
function loadTasks() {
    const container = document.getElementById("tasks");

    onSnapshot(collection(db, "tasks"), snapshot => {
        const container = document.getElementById("tasks");
        container.innerHTML = "";

        const now = new Date();
        let allTasks = [];

        snapshot.forEach(docSnap => {
            const task = docSnap.data();
            const id = docSnap.id;

            allTasks.push(task);

            const div = document.createElement("div");
            div.className = "task";

            const expired = new Date(task.deadline) < now;

            if (task.completed) div.classList.add("done");
            if (expired && !task.completed) div.classList.add("expired");

            div.innerHTML = `
                <b>${task.content}</b><br>
                👤 ${task.assignedTo}<br>
                ⏰ ${task.deadline}<br>
                ${task.completed ? "✅ Done" : "❌ Chưa làm"}
            `;

            if (!task.completed && !expired) {
                const btn = document.createElement("button");
                btn.innerText = "✔️ Hoàn thành";
                btn.onclick = () => completeTask(id);
                div.appendChild(btn);
            }

            container.appendChild(div);
        });

        renderLeaderboard(allTasks);
    });
}

// COMPLETE
async function completeTask(id) {
    const ref = doc(db, "tasks", id);

    await updateDoc(ref, {
        completed: true,
        completedAt: new Date()
    });
}

// CHANGE PASSWORD
window.changePassword = async function () {
    const user = auth.currentUser;

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const message = document.getElementById("passwordMessage");

    // reset message
    message.innerText = "";

    // validate
    if (!currentPassword || !newPassword) {
        message.innerText = "❌ Vui lòng nhập đầy đủ thông tin";
        return;
    }

    if (newPassword.length < 6) {
        message.innerText = "❌ Mật khẩu phải ≥ 6 ký tự";
        return;
    }

    try {
        // xác thực lại
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );

        await reauthenticateWithCredential(user, credential);

        // đổi mật khẩu
        await updatePassword(user, newPassword);

        message.innerText = "✅ Đổi mật khẩu thành công!";

        // clear input
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";

    } catch (e) {
        console.log(e);

        if (e.code === "auth/wrong-password") {
            message.innerText = "❌ Sai mật khẩu hiện tại";
        } else {
            message.innerText = "❌ Lỗi: " + e.message;
        }
    }
};

// LEADERBOARD
function renderLeaderboard(tasks) {
    let me = 0;
    let friend = 0;

    tasks.forEach(t => {
        if (t.completed) {
            if (t.assignedTo === "me") me++;
            if (t.assignedTo === "friend") friend++;
        }
    });

    const container = document.getElementById("leaderboard");

    container.innerHTML = `
        <div class="user-score ${me > friend ? "winner" : ""}">
            <span>👤 Tôi</span>
            <span>${me} ✅</span>
        </div>

        <div class="user-score ${friend > me ? "winner" : ""}">
            <span>👤 Bạn</span>
            <span>${friend} ✅</span>
        </div>
    `;
}