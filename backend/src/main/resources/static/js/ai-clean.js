// AI Assistant Page - Backend-integrated implementation

class AIAssistant {
    constructor() {
        this.isProcessing = false;
        this.voiceRecognition = null;
        this.isListening = false;
        this.jobs = [];

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.initVoiceRecognition();
        this.autoResizeTextarea();
        await this.loadJobs();
    }

    setupEventListeners() {
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
                textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
            });
        }
    }

    async loadJobs(filters = {}) {
        try {
            const response = await Api.get('/api/jobs', filters);
            const jobs = Array.isArray(response) ? response : (response?.data || []);
            this.jobs = jobs;
        } catch (error) {
            this.jobs = [];
            this.addMessage(error?.message || 'Unable to load jobs from backend.', 'ai');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();

        if (!text || this.isProcessing) return;

        this.addMessage(text, 'user');
        input.value = '';
        input.style.height = 'auto';

        this.isProcessing = true;
        this.showTyping();

        try {
            const response = await this.processQuery(text);
            this.hideTyping();
            this.addMessage(response.text, 'ai');
        } catch (error) {
            this.hideTyping();
            this.addMessage(error?.message || 'Error while processing your request.', 'ai');
        } finally {
            this.isProcessing = false;
        }
    }

    async processQuery(query) {
        const q = query.toLowerCase();

        if (q.includes('job') || q.includes('work') || q.includes('find')) {
            const keyword = query.split(' ').filter((w) => w.length > 2).slice(-2).join(' ');
            await this.loadJobs({ keyword });

            if (!this.jobs.length) {
                return { text: 'I could not find matching jobs right now.' };
            }

            const jobText = this.jobs.slice(0, 5).map((job, i) => {
                const title = job.title || job.jobTitle || 'Untitled Job';
                const location = job.location || 'Unknown location';
                const salary = job.salary || job.paymentAmount || 'Not specified';
                return `${i + 1}. ${title}\n   ${location} • ${salary}`;
            }).join('\n\n');

            return { text: `I found ${this.jobs.length} job(s). Top matches:\n\n${jobText}` };
        }

        if (q.includes('match') || q.includes('score')) {
            await this.loadJobs();
            if (!this.jobs.length) {
                return { text: 'No jobs available to calculate match score right now.' };
            }

            return {
                text: `I found ${this.jobs.length} available jobs. To get accurate match scores, please complete your profile and check each job listing.`
            };
        }

        if (q.includes('profile')) {
            if (!Api.getToken()) {
                return { text: 'Please login first. Then you can view or update profile from your profile page.' };
            }

            const profileResponse = await Api.get('/api/users/me');
            const profile = profileResponse?.data || profileResponse;
            return {
                text: `Your profile:\nName: ${profile.fullname || '-'}\nMobile: ${profile.mobile || '-'}\nSkill: ${profile.skill || '-'}\nCompany: ${profile.company || '-'}\nLocation: ${profile.location || '-'}`
            };
        }

        return {
            text: 'You can ask me to: find jobs, show your profile, or explain how to apply.'
        };
    }

    addMessage(text, sender) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        messageDiv.innerHTML = `
            <div class="message-avatar"></div>
            <div class="message-bubble">${String(text).replace(/\n/g, '<br>')}</div>
        `;

        container.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message ai-message';
        typingDiv.innerHTML = '<div class="message-avatar"></div><div class="message-bubble">Typing...</div>';
        container.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTyping() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    scrollToBottom() {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    initVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.voiceRecognition = new SpeechRecognition();
        this.voiceRecognition.lang = 'hi-IN';
        this.voiceRecognition.continuous = false;
        this.voiceRecognition.interimResults = false;

        this.voiceRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById('chatInput');
            if (input) {
                input.value = transcript;
                this.sendMessage();
            }
        };

        this.voiceRecognition.onend = () => {
            this.isListening = false;
        };
    }

    toggleVoice() {
        if (!this.voiceRecognition) {
            this.addMessage('Voice input is not supported in your browser.', 'ai');
            return;
        }

        if (this.isListening) {
            this.voiceRecognition.stop();
            this.isListening = false;
            return;
        }

        this.voiceRecognition.start();
        this.isListening = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
});
