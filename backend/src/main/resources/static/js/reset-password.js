document
.getElementById("resetForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const mobile =
        document.getElementById("mobile").value.trim();

    const password =
        document.getElementById("password").value;

    try {

        await Api.post("/api/auth/reset-password", {
            mobile,
            password
        });

        alert("Password updated successfully");
        window.location.href = "login.html";

    } catch (err) {
        alert(err.message || "Failed to reset password");
    }
});