// Authentication + Profile integration

let selectedRegisterRole = 'worker';

/* -------------------------------
   FORM MESSAGE HELPERS
--------------------------------*/

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
    box.style.border =
        `1px solid ${type === 'success' ? '#b8e6c8' : '#f3b3b3'}`;

    box.textContent = message;
}

function clearFormMessage(form) {
    const box = form?.querySelector('.form-message');
    if (!box) return;
    box.style.display = 'none';
}

/* -------------------------------
   VALIDATION MESSAGE
--------------------------------*/

function getValidationMessage(error) {
    if (error?.payload?.errors) {
        return Object.values(error.payload.errors).join(' | ');
    }
    return error?.message || 'Something went wrong.';
}

/* -------------------------------
   ROLE BASED REGISTER PAGE
--------------------------------*/

function getRegisterRole() {
    const role = new URLSearchParams(window.location.search).get('role');
    return role === 'employer' ? 'employer' : 'worker';
}

function setupRegisterRoleForm() {

    const form = document.getElementById('registerForm');
    if (!form) return;

    selectedRegisterRole = getRegisterRole();

    const heading = document.getElementById('registerHeading');
    const skillField = document.getElementById('skillField');
    const skillInput = document.getElementById('skill');
    const companyField = document.getElementById('companyField');
    const companyInput = document.getElementById('company');
    const companyLabel = document.getElementById('companyLabel');

    const isEmployer = selectedRegisterRole === 'employer';

    if (heading) {
        heading.textContent =
            isEmployer ? 'Employer Registration' : 'Worker Registration';
    }

    if (skillField && skillInput) {
        skillField.style.display = isEmployer ? 'none' : '';
        skillInput.required = !isEmployer;
        if (isEmployer) skillInput.value = '';
    }

    if (companyField && companyInput) {
        companyField.style.display = isEmployer ? '' : 'none';
        companyInput.required = isEmployer;
        if (!isEmployer) companyInput.value = '';
    }

    if (companyLabel) {
        companyLabel.textContent =
            isEmployer ? 'Company Name' : 'Company Name (Optional)';
    }
}

/* -------------------------------
   LOGIN HANDLER
--------------------------------*/

async function handleLogin(event) {

    event.preventDefault();

    const form = event.target;
    clearFormMessage(form);

    const login =
        document.getElementById('mobile')?.value?.trim();

    const password =
        document.getElementById('password')?.value || '';

    try {

        const response = await Api.post('/api/auth/login', {
            login,
            password
        });

        if (response?.token) {
            Api.setToken(response.token);
        }

        showFormMessage(form,
            response?.message || 'Login successful',
            'success'
        );

        // ===== ROLE BASED REDIRECT =====
        const meRes = await Api.get('/api/users/me');
        const user = meRes.data || meRes;

        const isEmployer =
            user.company &&
            user.company.toLowerCase() !== 'n/a';

        window.location.href =
            isEmployer
                ? 'dashboard-employer.html'
                : 'dashboard-worker.html';

    } catch (error) {
        showFormMessage(form,
            getValidationMessage(error),
            'error'
        );
    }

    return false;
}

/* -------------------------------
   REGISTER HANDLER
--------------------------------*/

async function handleRegister(event) {

    event.preventDefault();

    const form = event.target;
    clearFormMessage(form);

    const isEmployer = selectedRegisterRole === 'employer';

    const payload = {
        fullname: document.getElementById('fullname').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        password: document.getElementById('password').value,
        skill: isEmployer
            ? 'general'
            : document.getElementById('skill').value,
        company: document.getElementById('company').value.trim() ||
                 (isEmployer ? '' : 'N/A'),
        location: document.getElementById('location').value.trim(),
        role: isEmployer ? 'employer' : 'worker'   // ✅ CRITICAL FIX
    };

    if (isEmployer && !payload.company) {
        showFormMessage(form,
            'Company name required for employer.',
            'error');
        return false;
    }

    try {

        const response =
            await Api.post('/api/users/register', payload);

        showFormMessage(form,
            response?.message ||
            'Registration successful. Please login.',
            'success'
        );

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 800);

    } catch (error) {

        showFormMessage(form,
            getValidationMessage(error),
            'error');
    }

    return false;
}