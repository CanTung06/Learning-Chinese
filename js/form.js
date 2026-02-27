export function initForm() {
    const typeSelect = document.getElementById("type");
    const inputArea = document.getElementById("inputArea");

    if (!typeSelect || !inputArea) return;

    console.log("Form ready ✅");

    typeSelect.addEventListener("change", function () {
        const type = this.value;

        console.log("Bạn chọn:", type);

        // reset trước
        inputArea.innerHTML = "";

        // 👇 HIỆN INPUT BÊN DƯỚI
        if (type === "text") {
            const textarea = document.createElement("textarea");
            textarea.id = "content";
            textarea.placeholder = "Nhập đoạn văn...";
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
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.id = "imageFile";
            fileInput.accept = "image/*";

            inputArea.appendChild(fileInput);
        }
    });
}