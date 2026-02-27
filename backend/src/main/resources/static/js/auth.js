// Authentication + Profile integration using backend APIs

function createFormMessage(form) {
    if (!form) return null;
    let box = form.querySelector('.form-message');
    if (!box) {
        box = document.createElement('div');
        box.className = 'form-message';
        box.style.marginBottom = '1rem';
        box.style.padding = '0.75rem 1rem';
        box.style.borderRadius = '8px';
        box.style.fontSize = '0.95rem';
        box.style.display = 'none';
        form.prepend(box);
    }
    return box;
}

function showFormMessage(form, message, type = 'error') {
    const box = createFormMessage(form);
    if (!box) return;

    box.style.display = 'block';
    box.style.background = type === 'success' ? '#e8f8ee' : '#fdeaea';
    box.style.color = type === 'success' ? '#1f7a3e' : '#b42318';
    box.style.border = `1px solid ${type === 'success' ? '#b8e6c8' : '#f3b3b3'}`;
    box.textContent = message;
}

function clearFormMessage(form) {
    const box = form?.querySelector('.form-message');
    if (!box) return;
    box.style.display = 'none';
    box.textContent = '';
}

function getValidationMessage(error) {
    if (error?.payload?.errors && typeof error.payload.errors === 'object') {
        return Object.values(error.payload.errors).join(' | ');
    }
    return error?.message || 'Something went wrong. Please try again.';
}

async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    clearFormMessage(form);

    const login = document.getElementById('mobile')?.value?.trim();
    const password = document.getElementById('password')?.value || '';

    try {
        const response = await Api.post('/api/auth/login', { login, password });
        if (response?.token) {
            Api.setToken(response.token);
        }

        showFormMessage(form, response?.message || 'Login successful.', 'success');
        window.location.href = 'jobs.html';
    } catch (error) {
        showFormMessage(form, getValidationMessage(error), 'error');
    }

    return false;
}

function setupUserTypeSelector() {
    const selector = document.querySelector('.user-type-selector');
    if (!selector) return;

    const [workerBtn, employerBtn] = selector.querySelectorAll('.type-btn');
    if (!workerBtn || !employerBtn) return;

    workerBtn.id = 'workerBtn';
    employerBtn.id = 'employerBtn';

    const setActive = (type) => {
        if (type === 'worker') {
            workerBtn.classList.add('active');
            employerBtn.classList.remove('active');
        } else {
            employerBtn.classList.add('active');
            workerBtn.classList.remove('active');
        }
    };

    workerBtn.addEventListener('click', () => setActive('worker'));
    employerBtn.addEventListener('click', () => setActive('employer'));
}

async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    clearFormMessage(form);

    const workerBtn = document.getElementById('workerBtn');
    const isWorker = !workerBtn || workerBtn.classList.contains('active');

    const payload = {
        fullname: document.getElementById('fullname')?.value?.trim() || '',
        mobile: document.getElementById('mobile')?.value?.trim() || '',
        password: document.getElementById('password')?.value || '',
        skill: document.getElementById('skill')?.value || '',
        company: document.getElementById('company')?.value?.trim() || (isWorker ? 'N/A' : ''),
        location: document.getElementById('location')?.value?.trim() || ''
    };

    if (!isWorker && !payload.company) {
        showFormMessage(form, 'Company name is required for employer registration.', 'error');
        return false;
    }

    try {
        const response = await Api.post('/api/users/register', payload);
        showFormMessage(form, response?.message || 'Registration successful. Please login.', 'success');
        window.location.href = 'login.html';
    } catch (error) {
        showFormMessage(form, getValidationMessage(error), 'error');
    }

    return false;
}

async function loadProfile() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    try {
        const response = await Api.get('/api/users/me');
        const profile = response?.data || response;

        const fieldMap = ['fullname', 'mobile', 'skill', 'company', 'location'];
        fieldMap.forEach((field) => {
            const input = document.getElementById(field);
            if (input && profile[field] !== undefined && profile[field] !== null) {
                input.value = profile[field];
            }
        });
    } catch (error) {
        showFormMessage(profileForm, getValidationMessage(error), 'error');
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    const form = event.target;
    clearFormMessage(form);

    const payload = {};
    ['fullname', 'skill', 'company', 'location'].forEach((field) => {
        const value = document.getElementById(field)?.value?.trim();
        if (value) {
            payload[field] = value;
        }
    });

    try {
        const response = await Api.put('/api/users/me', payload);
        showFormMessage(form, response?.message || 'Profile updated successfully.', 'success');
        await loadProfile();
    } catch (error) {
        showFormMessage(form, getValidationMessage(error), 'error');
    }

    return false;
}

function voiceLogin() {
    const form = document.getElementById('loginForm');
    showFormMessage(form, 'Voice login API is not available yet. Please use mobile/password login.', 'error');
}

document.addEventListener('DOMContentLoaded', () => {
    setupUserTypeSelector();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
        loadProfile();
    }
});

window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.voiceLogin = voiceLogin;
