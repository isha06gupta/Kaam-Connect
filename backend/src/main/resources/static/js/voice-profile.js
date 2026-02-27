// Voice Profile JavaScript

let isRecording = false;
let recognition;

function setVoiceStatus(html) {
    const statusDiv = document.getElementById('voiceStatus');
    if (statusDiv) {
        statusDiv.innerHTML = html;
    }
}

function startVoiceRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setVoiceStatus(`
            <div style="font-size: 6rem; margin-bottom: 1rem;">❌</div>
            <p style="font-size: 1.1rem; color: #b42318;">Voice recognition is not supported in this browser.</p>
            <p style="font-size: 0.95rem; color: #555;">Please use Chrome/Edge/Safari or continue with the standard register form.</p>
        `);
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.lang = 'hi-IN';
    recognition.continuous = true;
    recognition.interimResults = true;

    let transcript = '';

    recognition.onstart = () => {
        isRecording = true;
        setVoiceStatus(`
            <div style="font-size: 6rem; margin-bottom: 1rem; animation: pulse 1s infinite;">🎤</div>
            <p style="font-size: 1.2rem; color: var(--primary);">Listening... Speak now!</p>
        `);
    };

    recognition.onresult = (event) => {
        transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        setVoiceStatus(`
            <div style="font-size: 6rem; margin-bottom: 1rem; animation: pulse 1s infinite;">🎤</div>
            <p style="font-size: 1.2rem; color: var(--primary);">Listening...</p>
            <div style="background: var(--gray-100); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <p style="font-style: italic;">"${transcript}"</p>
            </div>
        `);
    };

    recognition.onerror = (event) => {
        setVoiceStatus(`
            <div style="font-size: 6rem; margin-bottom: 1rem;">❌</div>
            <p style="font-size: 1.2rem; color: #b42318;">Error: ${event.error}</p>
            <button onclick="startVoiceRecording()" class="btn-primary" style="margin-top: 1rem;">Try Again</button>
        `);
    };

    recognition.onend = () => {
        isRecording = false;
        sessionStorage.setItem('voiceProfileTranscript', transcript || '');

        setVoiceStatus(`
            <div style="font-size: 6rem; margin-bottom: 1rem;">✅</div>
            <p style="font-size: 1.1rem; color: #1f7a3e;">Voice captured successfully.</p>
            <p style="font-size: 0.95rem; color: #555;">Please complete registration to submit your profile to backend.</p>
            <a href="register.html" class="btn-primary" style="display:inline-block; margin-top: 1rem; text-decoration:none;">Continue to Register</a>
        `);
    };

    recognition.start();
}

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);
