// AI Assistant Page - Clean Implementation
// Voice recognition, chat functionality, job recommendations

class AIAssistant {
    constructor() {
        this.isProcessing = false;
        this.voiceRecognition = null;
        this.isListening = false;
        
        // Mock job database
        this.jobs = [
            {
                id: 1,
                title: 'Carpenter for Home Furniture',
                location: 'Delhi NCR',
                salary: '₹800-1000/day',
                match: 95
            },
            {
                id: 2,
                title: 'House Painting - 2BHK',
                location: 'Delhi',
                salary: '₹600-800/day',
                match: 90
            },
            {
                id: 3,
                title: 'Plumbing Work - New Building',
                location: 'Bangalore',
                salary: '₹900-1200/day',
                match: 85
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initVoiceRecognition();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        // Send message
        const sendBtn = document.getElementById('sendBtn');
        const input = document.getElementById('chatInput');
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Voice buttons
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceModeBtn = document.getElementById('voiceModeBtn');
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoice());
        }
        
        if (voiceModeBtn) {
            voiceModeBtn.addEventListener('click', () => this.toggleVoice());
        }
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('chatInput');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
            });
        }
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        
        if (!text || this.isProcessing) return;

        // Add user message
        this.addMessage(text, 'user');
        input.value = '';
        input.style.height = 'auto';

        // Process with AI
        this.isProcessing = true;
        this.showTyping();

        setTimeout(() => {
            const response = this.processQuery(text);
            this.hideTyping();
            this.addMessage(response.text, 'ai');
            this.isProcessing = false;
        }, 1200);
    }

    processQuery(query) {
        const q = query.toLowerCase();

        // Job search
        if (q.includes('job') || q.includes('work') || q.includes('find')) {
            return {
                text: `I found ${this.jobs.length} jobs matching your search. Here are the top matches:\n\n${this.jobs.map((j, i) => `${i + 1}. ${j.title} - ${j.match}% match\n   ${j.location} • ${j.salary}`).join('\n\n')}\n\nWould you like more details about any of these jobs?`
            };
        }

        // Match score
        if (q.includes('match') || q.includes('score')) {
            const avg = Math.round(this.jobs.reduce((sum, j) => sum + j.match, 0) / this.jobs.length);
            return {
                text: `Your average match score is ${avg}%. Your top matches are:\n\n${this.jobs.map((j, i) => `${i + 1}. ${j.title} - ${j.match}%`).join('\n')}\n\nThese jobs align well with your skills!`
            };
        }

        // Help
        if (q.includes('help') || q.includes('how')) {
            return {
                text: `I can help you with:\n\n• Finding jobs matching your skills\n• Calculating your match scores\n• Explaining KaamConnect features\n• Registration and profile setup\n• Voice commands in multiple languages\n\nWhat would you like to know?`
            };
        }

        // Profile
        if (q.includes('profile') || q.includes('register')) {
            return {
                text: `To create your profile:\n\n1. Click "Register" in the navigation\n2. Choose Worker or Employer\n3. Fill in your details\n4. Get verified by NGO partners\n5. Start applying!\n\nYou can also use voice to create your profile if you prefer.`
            };
        }

        // Default
        return {
            text: `I'm here to help! Try asking:\n\n• "Show me carpenter jobs"\n• "What's my match score?"\n• "How do I register?"\n• "Help me find work"\n\nYou can also use voice commands - just click the microphone icon!`
        };
    }

    addMessage(text, sender) {
        const container = document.getElementById('chatMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${sender === 'ai' 
                        ? '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>'
                        : '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>'
                    }
                </svg>
            </div>
            <div class="message-bubble">
                ${text.replace(/\n/g, '<br>')}
            </div>
        `;
        
        container.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        const container = document.getElementById('chatMessages');
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message ai-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
            </div>
            <div class="message-bubble" style="padding: 1rem 1.5rem;">
                <div style="display: flex; gap: 0.5rem;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--text-tertiary); animation: typingDot 1.4s ease-in-out infinite;"></div>
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--text-tertiary); animation: typingDot 1.4s ease-in-out 0.2s infinite;"></div>
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: var(--text-tertiary); animation: typingDot 1.4s ease-in-out 0.4s infinite;"></div>
                </div>
            </div>
        `;
        
        container.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    scrollToBottom() {
        const container = document.getElementById('chatMessages');
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }

    // Voice Recognition
    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.voiceRecognition = new SpeechRecognition();
            this.voiceRecognition.continuous = false;
            this.voiceRecognition.interimResults = false;
            this.voiceRecognition.lang = 'en-US';

            this.voiceRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatInput').value = transcript;
                this.stopVoice();
                setTimeout(() => this.sendMessage(), 500);
            };

            this.voiceRecognition.onerror = () => {
                this.stopVoice();
            };

            this.voiceRecognition.onend = () => {
                this.stopVoice();
            };
        }
    }

    toggleVoice() {
        if (this.isListening) {
            this.stopVoice();
        } else {
            this.startVoice();
        }
    }

    startVoice() {
        if (!this.voiceRecognition) {
            alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        this.isListening = true;
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceModeBtn = document.getElementById('voiceModeBtn');
        
        if (voiceBtn) voiceBtn.style.background = 'var(--error)';
        if (voiceModeBtn) {
            voiceModeBtn.style.background = 'var(--error)';
            voiceModeBtn.style.borderColor = 'var(--error)';
            voiceModeBtn.style.color = 'white';
        }
        
        try {
            this.voiceRecognition.start();
        } catch (error) {
            console.error('Voice error:', error);
            this.stopVoice();
        }
    }

    stopVoice() {
        this.isListening = false;
        const voiceBtn = document.getElementById('voiceBtn');
        const voiceModeBtn = document.getElementById('voiceModeBtn');
        
        if (voiceBtn) voiceBtn.style.background = '';
        if (voiceModeBtn) {
            voiceModeBtn.style.background = '';
            voiceModeBtn.style.borderColor = '';
            voiceModeBtn.style.color = '';
        }
        
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();
        }
    }
}

// Initialize
let aiAssistant;

document.addEventListener('DOMContentLoaded', () => {
    aiAssistant = new AIAssistant();
    
    // Add typing animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes typingDot {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.5;
            }
            30% {
                transform: translateY(-8px);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
});

window.aiAssistant = aiAssistant;