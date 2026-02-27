// AI Assistant JavaScript for KaamConnect (backend-integrated)

let voiceMode = false;
let isRecording = false;
let recognition;
let jobsCache = [];

window.toggleVoiceMode = toggleVoiceMode;
window.startVoiceInput = startVoiceInput;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.quickAction = quickAction;
window.viewJobDetails = viewJobDetails;

document.addEventListener('DOMContentLoaded', async () => {
    initializeVoiceRecognition();
    await loadRecommendations();
});

function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN';
    }
}

function toggleVoiceMode() {
    voiceMode = !voiceMode;
    const voiceModeText = document.getElementById('voiceModeText');
    if (voiceModeText) {
        voiceModeText.textContent = voiceMode ? 'Voice Active' : 'Voice Off';
    }
}

function speak(text) {
    if (!voiceMode || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
}

function startVoiceInput() {
    if (!recognition) {
        addMessage('Voice recognition is not supported in this browser.', 'bot');
        return;
    }

    const voiceBtn = document.getElementById('voiceInputBtn');

    if (isRecording) {
        recognition.stop();
        isRecording = false;
        voiceBtn?.classList.remove('voice-recording');
        return;
    }

    recognition.onstart = () => {
        isRecording = true;
        voiceBtn?.classList.add('voice-recording');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = transcript;
            sendMessage();
        }
    };

    recognition.onerror = () => {
        voiceBtn?.classList.remove('voice-recording');
        isRecording = false;
    };

    recognition.onend = () => {
        voiceBtn?.classList.remove('voice-recording');
        isRecording = false;
    };

    recognition.start();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'chat-message user-message' : 'chat-message bot-message';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = String(text).replace(/\n/g, '<br>');

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (sender === 'bot') {
        speak(text);
    }
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator-wrapper';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="message-avatar">🤖</div><div class="typing-bubble">Typing...</div>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input?.value?.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    showTypingIndicator();

    setTimeout(async () => {
        hideTypingIndicator();
        await processMessage(message);
    }, 600);
}

async function processMessage(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.match(/find|search|job|work|looking/)) {
        await handleJobSearch(lowerMessage);
        return;
    }

    if (lowerMessage.includes('profile')) {
        if (!Api.getToken()) {
            addMessage('Please login to view your profile.', 'bot');
            return;
        }
        try {
            const response = await Api.get('/api/users/me');
            const user = response?.data || response;
            addMessage(`Name: ${user.fullname}\nSkill: ${user.skill}\nLocation: ${user.location}`, 'bot');
        } catch (error) {
            addMessage(error?.message || 'Unable to fetch profile.', 'bot');
        }
        return;
    }

    addMessage('Ask me to find jobs or show your profile.', 'bot');
}

async function handleJobSearch(query) {
    try {
        const response = await Api.get('/api/jobs', { keyword: query });
        const jobs = Array.isArray(response) ? response : (response?.data || []);
        jobsCache = jobs;

        if (!jobs.length) {
            addMessage('No jobs found for your query.', 'bot');
            return;
        }

        addMessage(`I found ${jobs.length} jobs for you.`, 'bot');
        showJobRecommendations(jobs.slice(0, 3));
    } catch (error) {
        addMessage(error?.message || 'Unable to search jobs right now.', 'bot');
    }
}

function showJobRecommendations(jobs) {
    jobs.forEach((job, index) => {
        setTimeout(() => {
            addMessage(`${index + 1}. ${job.title || job.jobTitle}\n${job.location || '-'} • ${job.salary || job.paymentAmount || '-'}`, 'bot');
        }, index * 200);
    });
}

async function loadRecommendations() {
    const recommendationsContainer = document.getElementById('jobRecommendations');
    if (!recommendationsContainer) return;

    try {
        const response = await Api.get('/api/jobs');
        const jobs = Array.isArray(response) ? response : (response?.data || []);
        jobsCache = jobs;

        recommendationsContainer.innerHTML = jobs.slice(0, 5).map(job => `
            <div class="job-rec-item" onclick="viewJobDetails(${job.id})">
                <div class="job-rec-title">${job.title || job.jobTitle || 'Untitled Job'}</div>
                <div class="job-rec-info">
                    <span>📍 ${job.location || '-'}</span>
                    <span>💰 ${job.salary || job.paymentAmount || '-'}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        recommendationsContainer.innerHTML = '<p>Unable to load recommendations.</p>';
    }
}

function viewJobDetails(jobId) {
    const job = jobsCache.find((j) => j.id === jobId);
    if (!job) return;
    addMessage(`Tell me more about ${job.title || job.jobTitle}`, 'user');
    addMessage(`${job.description || 'No description'}\nLocation: ${job.location || '-'}\nSalary: ${job.salary || job.paymentAmount || '-'}`, 'bot');
}

function quickAction(action) {
    const actions = {
        'find-carpenter-jobs': 'Find carpenter jobs',
        'jobs-near-me': 'Find jobs near me',
        'urgent-jobs': 'Find urgent jobs',
        'update-profile': 'Show my profile'
    };

    const message = actions[action];
    if (!message) return;

    const input = document.getElementById('chatInput');
    if (input) {
        input.value = message;
        sendMessage();
    }
}
