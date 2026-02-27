export function initForm() {
    const typeSelect = document.getElementById("type");
    const inputArea = document.getElementById("inputArea");

    if (!typeSelect || !inputArea) return;

    typeSelect.addEventListener("change", () => {
        const type = typeSelect.value;

        // reset trước
        inputArea.innerHTML = "";

        if (type === "text") {
            inputArea.innerHTML = `
                <textarea id="content" placeholder="Nhập đoạn văn..." rows="4"></textarea>
            `;
        }

        else if (type === "link") {
            inputArea.innerHTML = `
                <input id="content" placeholder="Dán link vào đây">
            `;
        }

        else if (type === "image") {
            inputArea.innerHTML = `
                <input type="file" id="imageFile" accept="image/*">
            `;
        }
    });
}