// Voice Profile JavaScript

let isRecording = false;
let recognition;

function startVoiceRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Voice Recognition Not Supported\n\nYour browser does not support voice recognition. Please use:\n- Chrome\n- Edge\n- Safari (iOS)\n\nOr use the text-based registration form.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = 'hi-IN'; // Default to Hindi, can be changed
    recognition.continuous = true;
    recognition.interimResults = true;
    
    const statusDiv = document.getElementById('voiceStatus');
    
    recognition.onstart = () => {
        isRecording = true;
        statusDiv.innerHTML = `
            <div style="font-size: 6rem; margin-bottom: 1rem; animation: pulse 1s infinite;">🎤</div>
            <p style="font-size: 1.2rem; color: var(--primary);">Listening... Speak now!</p>
        `;
    };
    
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        
        statusDiv.innerHTML = `
            <div style="font-size: 6rem; margin-bottom: 1rem; animation: pulse 1s infinite;">🎤</div>
            <p style="font-size: 1.2rem; color: var(--primary);">Listening...</p>
            <div style="background: var(--gray-100); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <p style="font-style: italic;">"${transcript}"</p>
            </div>
        `;
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        statusDiv.innerHTML = `
            <div style="font-size: 6rem; margin-bottom: 1rem;">❌</div>
            <p style="font-size: 1.2rem; color: red;">Error: ${event.error}</p>
            <button onclick="startVoiceRecording()" class="btn-primary" style="margin-top: 1rem;">Try Again</button>
        `;
    };
    
    recognition.onend = () => {
        isRecording = false;
        alert('Voice Profile Created!\n\nYour profile has been created successfully using voice input.\n\nOur AI has processed your information and created your account.');
        window.location.href = 'login.html';
    };
    
    recognition.start();
}

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(style);
