// Post Job JavaScript (backend-integrated)

function createPostMessage() {
    const form = document.getElementById('jobPostForm');
    if (!form) return null;

    let box = document.getElementById('jobPostMessage');
    if (!box) {
        box = document.createElement('div');
        box.id = 'jobPostMessage';
        box.style.marginBottom = '1rem';
        box.style.padding = '0.75rem 1rem';
        box.style.borderRadius = '8px';
        box.style.fontSize = '0.95rem';
        box.style.display = 'none';
        form.prepend(box);
    }
    return box;
}

function showPostMessage(message, type = 'error') {
    const box = createPostMessage();
    if (!box) return;

    box.style.display = 'block';
    box.style.background = type === 'success' ? '#e8f8ee' : '#fdeaea';
    box.style.color = type === 'success' ? '#1f7a3e' : '#b42318';
    box.style.border = `1px solid ${type === 'success' ? '#b8e6c8' : '#f3b3b3'}`;
    box.textContent = message;
}

async function handleJobPost(event) {
    event.preventDefault();

    if (typeof requireAuth === 'function' && !requireAuth('Login required to post jobs')) {
        return false;
    }

    const form = event.target;

    const jobData = {
        title: document.getElementById('jobTitle')?.value?.trim() || '',
        category: document.getElementById('jobCategory')?.value || '',
        description: document.getElementById('jobDescription')?.value?.trim() || '',
        location: document.getElementById('jobLocation')?.value?.trim() || '',
        duration: document.getElementById('jobDuration')?.value || '',
        paymentType: document.getElementById('paymentType')?.value || '',
        paymentAmount: document.getElementById('paymentAmount')?.value?.trim() || '',
        requiredSkills: document.getElementById('requiredSkills')?.value?.trim() || '',
        workersNeeded: Number(document.getElementById('workersNeeded')?.value || 1),
        urgent: document.getElementById('urgentJob')?.checked || false
    };

    try {
        await Api.post('/api/jobs', jobData);
        if (typeof showToast === 'function') {
            showToast('Job posted successfully', 'success');
        } else {
            showPostMessage('Job posted successfully', 'success');
        }
        form.reset();
        setTimeout(() => {
            window.location.href = 'jobs.html';
        }, 500);
    } catch (error) {
        if (error?.payload?.errors) {
            const msg = Object.values(error.payload.errors).join(' | ');
            if (typeof showToast === 'function') showToast(msg, 'error');
            else showPostMessage(msg, 'error');
        } else {
            const msg = error?.message || 'Unable to post job.';
            if (typeof showToast === 'function') showToast(msg, 'error');
            else showPostMessage(msg, 'error');
        }
    }

    return false;
}

window.handleJobPost = handleJobPost;