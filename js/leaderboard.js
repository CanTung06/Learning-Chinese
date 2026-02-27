export function renderLeaderboard(tasks) {
    let me = 0;
    let friend = 0;

    tasks.forEach(t => {
        if (t.completed) {
            if (t.assignedTo === "me") me++;
            if (t.assignedTo === "friend") friend++;
        }
    });

    const el = document.getElementById("leaderboard");

    if (!el) return;

    el.innerHTML = `
        <div>Cấn Xuân Tùng: ${me}</div>
        <div>Vương Khánh Ly: ${friend}</div>
    `;
}