async function guardPage(requiredRole) {

    const token = localStorage.getItem("token");

    // not logged in
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const meRes = await Api.get("/api/users/me");
        const user = meRes.data || meRes;

        const role = (user.role || "").toUpperCase();

        // ROLE CHECK
        if (requiredRole && role !== requiredRole) {

            // redirect based on real role
            if (role === "EMPLOYER") {
                window.location.href = "dashboard-employer.html";
            }
            else if (role === "NGO") {
                window.location.href = "ngo-dashboard.html";
            }
            else {
                window.location.href = "dashboard-worker.html";
            }
        }

    } catch (e) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}