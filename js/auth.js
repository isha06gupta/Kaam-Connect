// Authentication JavaScript

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    
    // Simulate login (in real app, this would call backend API)
    console.log('Login attempt:', { mobile, password });
    
    // Store user session
    localStorage.setItem('kaamconnect_user', JSON.stringify({
        mobile: mobile,
        loggedIn: true,
        timestamp: new Date().toISOString()
    }));
    
    alert('Login Successful!\n\nWelcome to KaamConnect. Redirecting to dashboard...');
    
    // Redirect to jobs page
    window.location.href = 'jobs.html';
    
    return false;
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const location = document.getElementById('location').value;
    
    const userType = document.getElementById('workerBtn').classList.contains('active') ? 'worker' : 'employer';
    
    let additionalData = {};
    if (userType === 'worker') {
        additionalData.skill = document.getElementById('skill').value;
    } else {
        additionalData.company = document.getElementById('company').value;
    }
    
    // Simulate registration (in real app, this would call backend API)
    console.log('Registration data:', {
        fullname,
        mobile,
        password,
        location,
        userType,
        ...additionalData
    });
    
    alert('Registration Successful!\n\nYour account has been created. Please login to continue.');
    
    // Redirect to login
    window.location.href = 'login.html';
    
    return false;
}

// Select user type
function selectUserType(type) {
    const workerBtn = document.getElementById('workerBtn');
    const employerBtn = document.getElementById('employerBtn');
    const workerFields = document.getElementById('workerFields');
    const employerFields = document.getElementById('employerFields');
    
    if (type === 'worker') {
        workerBtn.classList.add('active');
        employerBtn.classList.remove('active');
        workerFields.style.display = 'block';
        employerFields.style.display = 'none';
        document.getElementById('skill').required = true;
        document.getElementById('company').required = false;
    } else {
        employerBtn.classList.add('active');
        workerBtn.classList.remove('active');
        employerFields.style.display = 'block';
        workerFields.style.display = 'none';
        document.getElementById('company').required = true;
        document.getElementById('skill').required = false;
    }
}

// Voice login
function voiceLogin() {
    alert('Voice Login Feature\n\nThis feature would use voice recognition to authenticate users:\n1. Speak your registered mobile number\n2. Speak your voice password\n3. System verifies and logs you in\n\nThis helps users with limited literacy access the platform.');
}

// Add user type selector styles
const style = document.createElement('style');
style.textContent = `
    .user-type-selector {
        display: flex;
        gap: 1rem;
    }
    
    .type-btn {
        flex: 1;
        padding: 1rem;
        background: var(--gray-100);
        border: 2px solid var(--gray-300);
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .type-btn.active {
        background: var(--primary);
        border-color: var(--primary);
        color: var(--white);
    }
    
    .type-btn:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
