import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function initForm() {
    const typeSelect = document.getElementById("type");
    const inputArea = document.getElementById("inputArea");

    if (!typeSelect || !inputArea) return;

    console.log("Form ready");

    typeSelect.addEventListener("change", function () {
        const type = this.value;

        console.log("Bạn chọn:", type);

        inputArea.innerHTML = "";

        if (type === "text") {
            const textarea = document.createElement("textarea");
            textarea.id = "content";
            textarea.placeholder = "Nhập văn bản...";
            textarea.rows = 4;

            inputArea.appendChild(textarea);
        }

        else if (type === "link") {
            const input = document.createElement("input");
            input.id = "content";
            input.placeholder = "Nhập link...";

            inputArea.appendChild(input);
        }

        else if (type === "image") {
            inputArea.innerHTML = `
                <label class="upload-box">
                    Chọn ảnh
                    <input type="file" id="imageFile" accept="image/*">
                </label>

                <p id="fileName">Chưa chọn ảnh</p>
                <div id="preview"></div>
            `;

            const fileInput = document.getElementById("imageFile");
            const fileName = document.getElementById("fileName");
            const preview = document.getElementById("preview");

            fileInput.addEventListener("change", () => {
                preview.innerHTML = ""; // ❗ xoá ảnh cũ (rất quan trọng)

                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];

                    fileName.innerText = file.name;

                    const img = document.createElement("img");
                    img.src = URL.createObjectURL(file);

                    img.classList.add("preview-img");

                    preview.appendChild(img);
                }
            });
        }
    });
}

// 🔥 CHECK EDIT MODE
window.addEventListener("load", async () => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    if (!editId) return;

    document.getElementById("formTitle").innerText = "Chỉnh sửa bài giao";

    const snap = await getDoc(doc(db, "tasks", editId));
    const task = snap.data();

    // set giá trị
    document.getElementById("type").value = task.type;
    document.getElementById("user").value = task.assignedTo;

    // convert date → dd/mm/yyyy
    const d = task.deadline.toDate();
    const dateStr = `${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}/${d.getFullYear()}`;
    document.getElementById("deadline").value = dateStr;

    // render lại input
    const event = new Event("change");
    document.getElementById("type").dispatchEvent(event);

    // đợi render xong rồi set content
    setTimeout(() => {
        if (task.type === "text" || task.type === "link") {
            document.getElementById("content").value = task.content;
        }
    }, 100);

    // 🔥 đổi nút thành Cập nhật
    const btn = document.getElementById("submitBtn");
    btn.innerText = "Cập nhật";

    // 🔥 override hành vi nút
    btn.onclick = async () => {
        const type = document.getElementById("type").value;
        const user = document.getElementById("user").value;
        const deadlineStr = document.getElementById("deadline").value;

        let content = "";
        let imageUrl = task.imageUrl;

        if (type === "image") {
            const file = document.getElementById("imageFile")?.files[0];
            if (file) {
                imageUrl = URL.createObjectURL(file);
            }
        } else {
            content = document.getElementById("content")?.value;
        }

        await updateDoc(doc(db, "tasks", editId), {
            type,
            assignedTo: user,
            deadline: new Date(
                deadlineStr.split("/")[2],
                deadlineStr.split("/")[1] - 1,
                deadlineStr.split("/")[0]
            ),
            content,
            imageUrl,

            // 🔥 QUAN TRỌNG
            failed: false,       // xoá trạng thái fail
            completed: false     // reset luôn nếu cần
        });

        alert("Đã cập nhật!");

        window.location.href = "index.html";
    };
});