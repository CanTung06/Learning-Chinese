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