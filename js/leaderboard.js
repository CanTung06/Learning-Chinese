export function renderLeaderboard(tasks) {

    function calculateStreak(user) {
        // Lọc task theo user
        const userTasks = tasks
            .filter(t => t.assignedTo === user)
            .sort((a, b) => a.deadline.toDate() - b.deadline.toDate());

        let streak = 0;

        for (let task of userTasks) {
            const deadline = task.deadline.toDate();
            const now = new Date();
            const expired = deadline < now;

            if (task.completed) {
                streak++;
            }
            else if (expired) {
                streak = 0;
            }
        }

        return streak;
    }

    const meStreak = calculateStreak("me");
    const friendStreak = calculateStreak("friend");

    const el = document.getElementById("leaderboard");
    if (!el) return;

    el.innerHTML = `
        <div>Cấn Xuân Tùng: ${meStreak}</div>
        <div>Vương Khánh Ly: ${friendStreak}</div>
    `;
}