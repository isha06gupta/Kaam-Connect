// AI Assistant JavaScript for KaamConnect

let voiceMode = false;
let isRecording = false;
let recognition;
let userProfile = {
    skills: ['carpentry', 'painting'],
    location: 'Delhi',
    experience: 5,
    availability: 'weekdays'
};

// Define global functions first (before any other code)
window.toggleVoiceMode = toggleVoiceMode;
window.startVoiceInput = startVoiceInput;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.quickAction = quickAction;
window.viewJobDetails = viewJobDetails;

// Sample job database with more detailed information
const jobDatabase = [
    {
        id: 1,
        title: "Carpenter for Home Furniture",
        company: "Home Decor Solutions",
        category: "carpentry",
        location: "Delhi NCR",
        salary: "₹800-1000/day",
        duration: "1 Week",
        urgent: true,
        description: "Need experienced carpenter for custom furniture making",
        skills: ["carpentry", "furniture"],
        matchScore: 95
    },
    {
        id: 2,
        title: "House Painting - 2BHK",
        company: "Paint Masters",
        category: "painting",
        location: "Delhi",
        salary: "₹600-800/day",
        duration: "3 Days",
        urgent: false,
        description: "Interior painting work for 2BHK apartment",
        skills: ["painting", "interior"],
        matchScore: 90
    },
    {
        id: 3,
        title: "Construction Site Helper",
        company: "Metro Construction",
        category: "construction",
        location: "Gurgaon",
        salary: "₹500-650/day",
        duration: "2 Weeks",
        urgent: true,
        description: "Multiple helpers needed for construction site",
        skills: ["construction", "labor"],
        matchScore: 75
    },
    {
        id: 4,
        title: "Plumber - Emergency Service",
        company: "Quick Fix Services",
        category: "plumbing",
        location: "Delhi",
        salary: "₹900-1200/day",
        duration: "As needed",
        urgent: true,
        description: "On-call plumber for residential emergencies",
        skills: ["plumbing", "repair"],
        matchScore: 70
    },
    {
        id: 5,
        title: "Electrician for Office Setup",
        company: "PowerTech Solutions",
        category: "electrical",
        location: "Noida",
        salary: "₹1000-1500/day",
        duration: "1 Week",
        urgent: false,
        description: "Electrical wiring for new office space",
        skills: ["electrical", "wiring"],
        matchScore: 68
    }
];

// AI Response Templates
const responseTemplates = {
    greeting: [
        "Hello! How can I help you find work today?",
        "Namaste! Looking for a job? I'm here to help!",
        "Hi there! Ready to find your next opportunity?"
    ],
    jobSearch: [
        "I found some great jobs for you! Let me show you the best matches.",
        "Here are the jobs that match your profile:",
        "Perfect! I've got some opportunities you might like:"
    ],
    noJobs: [
        "I couldn't find exact matches, but here are some similar opportunities:",
        "Let me show you some related jobs that might interest you:",
        "No exact matches yet, but check out these alternatives:"
    ],
    help: [
        "I can help you with:\n• Finding jobs\n• Profile updates\n• Verification process\n• Payment issues\n• General questions",
        "Need help? I can assist with job search, profile management, verification, and more!"
    ]
};

// Initialize assistant
document.addEventListener('DOMContentLoaded', () => {
    initializeVoiceRecognition();
    loadRecommendations();
    // Show welcome tips after 2 seconds
    setTimeout(() => {
        if (document.getElementById('chatMessages').children.length === 1) {
            showQuickTips();
        }
    }, 2000);
});

// Initialize speech recognition
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN'; // Default Hindi, can be changed
    }
}

// Toggle voice mode
function toggleVoiceMode() {
    voiceMode = !voiceMode;
    const toggleBtn = document.getElementById('voiceModeToggle');
    const voiceIcon = document.getElementById('voiceIcon');
    const voiceModeText = document.getElementById('voiceModeText');
    
    if (voiceMode) {
        toggleBtn.classList.add('active');
        voiceIcon.textContent = '🔊';
        voiceModeText.textContent = 'Voice Active';
        speak("Voice mode activated. I will now speak my responses.");
    } else {
        toggleBtn.classList.remove('active');
        voiceIcon.textContent = '🎤';
        voiceModeText.textContent = 'Voice Mode';
    }
}

// Text-to-speech
function speak(text) {
    if (voiceMode && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}

// Start voice input
function startVoiceInput() {
    if (!recognition) {
        alert('Voice recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
    }
    
    const voiceBtn = document.getElementById('voiceInputBtn');
    
    if (isRecording) {
        recognition.stop();
        isRecording = false;
        voiceBtn.classList.remove('voice-recording');
        return;
    }
    
    recognition.onstart = () => {
        isRecording = true;
        voiceBtn.classList.add('voice-recording');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chatInput').value = transcript;
        sendMessage();
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('voice-recording');
        isRecording = false;
    };
    
    recognition.onend = () => {
        voiceBtn.classList.remove('voice-recording');
        isRecording = false;
    };
    
    recognition.start();
}

// Handle keyboard enter
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond
    setTimeout(() => {
        hideTypingIndicator();
        processMessage(message);
    }, 1000 + Math.random() * 1000);
}

// Add message to chat
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'chat-message user-message' : 'chat-message bot-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🤖';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = formatMessage(text);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Speak if voice mode is on
    if (sender === 'bot') {
        speak(text);
    }
}

// Format message text
function formatMessage(text) {
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    // Convert bullet points
    text = text.replace(/•/g, '•');
    return text;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator-wrapper';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
    avatar.textContent = '🤖';
    
    const bubble = document.createElement('div');
    bubble.className = 'typing-bubble';
    bubble.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(bubble);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Process user message with AI
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting detection
    if (lowerMessage.match(/hello|hi|hey|namaste|namaskar/)) {
        const response = responseTemplates.greeting[Math.floor(Math.random() * responseTemplates.greeting.length)];
        addMessage(response, 'bot');
        setTimeout(() => showQuickTips(), 500);
        return;
    }
    
    // Job search detection
    if (lowerMessage.match(/find|search|job|work|looking for|chahiye|dhundho/)) {
        handleJobSearch(lowerMessage);
        return;
    }
    
    // Help detection
    if (lowerMessage.match(/help|assist|guide|madad|sahayata/)) {
        const response = responseTemplates.help[Math.floor(Math.random() * responseTemplates.help.length)];
        addMessage(response, 'bot');
        return;
    }
    
    // Profile questions
    if (lowerMessage.match(/profile|update|edit|change/)) {
        addMessage("To update your profile:\n1. Go to your dashboard\n2. Click 'Edit Profile'\n3. Update your skills, location, or experience\n4. Save changes\n\nOr you can tell me what you'd like to update and I'll guide you!", 'bot');
        return;
    }
    
    // Verification questions
    if (lowerMessage.match(/verify|verification|ngo|trust|authentic/)) {
        addMessage("To get verified:\n1. Visit the NGO Portal\n2. Submit your documents (Aadhaar, skill certificates)\n3. NGO will verify within 24-48 hours\n4. You'll get a verified badge ✅\n\nVerified profiles get 3x more job offers!", 'bot');
        return;
    }
    
    // Payment questions
    if (lowerMessage.match(/payment|pay|money|salary|paisa|paise/)) {
        addMessage("Payment Process:\n• Money is held securely when you're hired\n• Complete the work as agreed\n• Employer confirms completion\n• Payment released to your account within 24 hours\n\nAll payments are protected by KaamConnect!", 'bot');
        return;
    }
    
    // Default response with job suggestions
    addMessage("I'm not sure I understand that completely. But I can help you find jobs! Let me show you some current opportunities...", 'bot');
    setTimeout(() => {
        showJobRecommendations(getRecommendedJobs(3));
    }, 500);
}

// Handle job search
function handleJobSearch(message) {
    let category = null;
    let location = null;
    let urgent = message.match(/urgent|immediate|turant|abhi/);
    
    // Extract category
    if (message.match(/carpenter|carpentry|badhai/)) category = 'carpentry';
    else if (message.match(/paint|painting|rang/)) category = 'painting';
    else if (message.match(/plumb|plumbing|nal/)) category = 'plumbing';
    else if (message.match(/electric|bijli/)) category = 'electrical';
    else if (message.match(/construct|building|nirman/)) category = 'construction';
    
    // Extract location
    if (message.match(/delhi|dilli/)) location = 'delhi';
    else if (message.match(/mumbai|bombay/)) location = 'mumbai';
    else if (message.match(/bangalore|bengaluru/)) location = 'bangalore';
    else if (message.match(/near me|nearby|yaha|paas/)) location = userProfile.location.toLowerCase();
    
    // Search jobs
    let jobs = jobDatabase;
    
    if (category) {
        jobs = jobs.filter(job => job.category === category);
    }
    
    if (location) {
        jobs = jobs.filter(job => job.location.toLowerCase().includes(location));
    }
    
    if (urgent) {
        jobs = jobs.filter(job => job.urgent === true);
    }
    
    // Sort by match score
    jobs.sort((a, b) => b.matchScore - a.matchScore);
    
    if (jobs.length > 0) {
        const response = responseTemplates.jobSearch[Math.floor(Math.random() * responseTemplates.jobSearch.length)];
        addMessage(response, 'bot');
        setTimeout(() => {
            showJobRecommendations(jobs.slice(0, 3));
        }, 500);
    } else {
        addMessage("I couldn't find exact matches for your search. Let me show you some related opportunities:", 'bot');
        setTimeout(() => {
            showJobRecommendations(getRecommendedJobs(3));
        }, 500);
    }
}

// Get recommended jobs based on user profile
function getRecommendedJobs(count = 5) {
    let jobs = [...jobDatabase];
    
    // Filter by user skills
    jobs = jobs.filter(job => 
        userProfile.skills.some(skill => job.category === skill || job.skills.includes(skill))
    );
    
    // If no matches, show all
    if (jobs.length === 0) {
        jobs = [...jobDatabase];
    }
    
    // Sort by match score
    jobs.sort((a, b) => b.matchScore - a.matchScore);
    
    return jobs.slice(0, count);
}

// Show job recommendations in chat
function showJobRecommendations(jobs) {
    jobs.forEach((job, index) => {
        setTimeout(() => {
            const jobCard = `
                <div class="job-card-inline">
                    <h4>${job.title} ${job.urgent ? '🔥' : ''}</h4>
                    <p><strong>Company:</strong> ${job.company}</p>
                    <p><strong>Location:</strong> ${job.location} | <strong>Salary:</strong> ${job.salary}</p>
                    <p><strong>Duration:</strong> ${job.duration}</p>
                    <p style="margin-top: 0.5rem;">${job.description}</p>
                    <div style="margin-top: 0.5rem;">
                        <span class="job-match-badge">${job.matchScore}% Match</span>
                    </div>
                </div>
            `;
            
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message bot-message';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = '💼';
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.innerHTML = jobCard;
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(bubble);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, index * 300);
    });
    
    // Add apply prompt
    setTimeout(() => {
        addMessage("Would you like to apply to any of these jobs? Just say 'apply to [job number]' or click on the job card!", 'bot');
    }, jobs.length * 300 + 500);
}

// Load recommendations in sidebar
function loadRecommendations() {
    const recommendationsContainer = document.getElementById('jobRecommendations');
    const jobs = getRecommendedJobs(5);
    
    recommendationsContainer.innerHTML = jobs.map(job => `
        <div class="job-rec-item" onclick="viewJobDetails(${job.id})">
            <div class="job-rec-title">${job.title}</div>
            <div class="job-rec-info">
                <span>📍 ${job.location}</span>
                <span>💰 ${job.salary}</span>
            </div>
            <span class="job-match-badge">${job.matchScore}% Match</span>
        </div>
    `).join('');
}

// View job details
function viewJobDetails(jobId) {
    const job = jobDatabase.find(j => j.id === jobId);
    if (job) {
        addMessage(`Tell me more about: ${job.title}`, 'user');
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                showJobRecommendations([job]);
            }, 1000);
        }, 300);
    }
}

// Quick actions
function quickAction(action) {
    const actions = {
        'find-carpenter-jobs': 'Find me carpenter jobs in my area',
        'jobs-near-me': 'Show me all jobs near me',
        'urgent-jobs': 'Show urgent jobs available now',
        'update-profile': 'How do I update my profile?',
        'payment-help': 'How does payment work?',
        'verification': 'How do I get verified?'
    };
    
    const message = actions[action];
    if (message) {
        addMessage(message, 'user');
        setTimeout(() => {
            showTypingIndicator();
            setTimeout(() => {
                hideTypingIndicator();
                processMessage(message);
            }, 1000);
        }, 300);
    }
}

// Show quick tips
function showQuickTips() {
    const tips = [
        "💡 Try saying 'Find me carpenter jobs in Delhi'",
        "💡 You can use voice commands in Hindi or English!",
        "💡 Ask me 'How do I get verified?' for more job opportunities"
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    addMessage(randomTip, 'bot');
}

// Simulate user login and profile loading
function loadUserProfile() {
    // In a real app, this would fetch from backend
    const storedUser = localStorage.getItem('kaamconnect_user');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        // Update user profile based on stored data
        console.log('User profile loaded:', user);
    }
}