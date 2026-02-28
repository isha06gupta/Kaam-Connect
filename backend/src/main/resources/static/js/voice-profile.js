let recognition;
let transcript = "";
let isRecording = false;

function setVoiceStatus(html){
    document.getElementById("voiceStatus").innerHTML = html;
}

function startVoiceRecording(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    transcript = "";

    recognition.onstart = () => {
        isRecording = true;

        setVoiceStatus(`
            <div style="font-size:6rem;">🎤</div>
            <p>Recording...</p>

            <button onclick="stopRecording()" 
                class="btn-secondary"
                style="margin-top:1rem;">
                Stop Recording
            </button>
        `);
    };

    recognition.onresult = (event) => {

        transcript = "";

        for(let i=0;i<event.results.length;i++){
            transcript += event.results[i][0].transcript;
        }

        setVoiceStatus(`
            <div style="font-size:6rem;">🎤</div>
            <p>Listening...</p>
            <div style="background:#f5f5f5;padding:1rem;">
                "${transcript}"
            </div>

            <button onclick="stopRecording()" 
                class="btn-secondary"
                style="margin-top:1rem;">
                Stop Recording
            </button>
        `);
    };

    recognition.start();
}

function stopRecording(){

    if(!recognition) return;

    recognition.stop();
    isRecording = false;

    // SAVE DATA
    localStorage.setItem("voiceTranscript", transcript);

    setVoiceStatus(`
        <div style="font-size:6rem;">✅</div>
        <p>Recording Stopped</p>

        <button id="goRegister" class="btn-primary">
            Continue to Register
        </button>
    `);

    document
        .getElementById("goRegister")
        .addEventListener("click",()=>{
            window.location.href="register.html";
        });
}