document.addEventListener("DOMContentLoaded", () => {

    console.log("REGISTER JS LOADED");

    const transcript = localStorage.getItem("voiceTranscript");
    console.log("Transcript:", transcript);

    if (!transcript) return;

    const text = transcript.toLowerCase();

    // ---------- MOBILE FIX ----------
    // Remove all non-digit characters
    const digitsOnly = transcript.replace(/\D/g, "");

    if (digitsOnly.length >= 10) {
        document.getElementById("mobile").value =
            digitsOnly.slice(-10);
    }

    // ---------- SKILL ----------
    if (text.includes("plumber"))
        document.getElementById("skill").value = "plumbing";

    if (text.includes("painter"))
        document.getElementById("skill").value = "painting";

    if (text.includes("electrician"))
        document.getElementById("skill").value = "electrical";

    if (text.includes("carpenter"))
        document.getElementById("skill").value = "carpentry";

    // ---------- LOCATION ----------
    const locMatch = text.match(/live in (.+)/);
    if (locMatch) {
        document.getElementById("location").value =
            locMatch[1].trim();
    }

    // ---------- NAME SMART LOGIC ----------
    // Assume name is first word(s) before "i am"
    const nameMatch = text.match(/^(.*?) i am/);

    if (nameMatch) {
        document.getElementById("fullname").value =
            nameMatch[1].trim();
    } else {
        // fallback → first 1-2 words
        const words = text.split(" ");
        document.getElementById("fullname").value =
            words.slice(0, 2).join(" ");
    }

    localStorage.removeItem("voiceTranscript");
});