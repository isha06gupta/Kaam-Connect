(function () {

async function init() {

    
    try {

        // ===== PROFILE =====
        const meRes = await Api.get("/api/users/me");

        console.log("API RESPONSE:", meRes);

        // backend returns:
        // { success:true, message:"...", data:{user} }

        const me = meRes.data || meRes;

        document.getElementById("workerProfileSummary").textContent =
            `${me.fullname} • ${me.mobile} • ${me.location || "N/A"}`;

        // ===== APPLIED JOBS =====
        const appliedRes = await Api.get("/api/jobs/applied");

        const jobs = appliedRes.data || [];

        const html = jobs.length
            ? jobs.map(j =>
                `<div>• ${j.title} (${j.location})</div>`
            ).join("")
            : "<p>No applied jobs yet.</p>";

        document.getElementById("appliedJobsList").innerHTML = html;
        document.getElementById("workHistoryList").innerHTML = html;

    } catch (e) {
        console.error("Dashboard Error:", e);
        showToast("Failed loading dashboard", "error");
    }
}

document.addEventListener("DOMContentLoaded", init);

})();