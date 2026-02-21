// Post Job JavaScript

function handleJobPost(event) {
    event.preventDefault();
    
    const jobData = {
        title: document.getElementById('jobTitle').value,
        category: document.getElementById('jobCategory').value,
        description: document.getElementById('jobDescription').value,
        location: document.getElementById('jobLocation').value,
        duration: document.getElementById('jobDuration').value,
        paymentType: document.getElementById('paymentType').value,
        paymentAmount: document.getElementById('paymentAmount').value,
        requiredSkills: document.getElementById('requiredSkills').value,
        workersNeeded: document.getElementById('workersNeeded').value,
        urgent: document.getElementById('urgentJob').checked
    };
    
    console.log('Job post data:', jobData);
    
    alert('Job Posted Successfully!\n\nYour job posting has been submitted for review.\n\nOur AI will start matching qualified workers immediately.\n\nYou will receive notifications when workers apply.');
    
    // Reset form
    document.getElementById('jobPostForm').reset();
    
    // Redirect to jobs page
    setTimeout(() => {
        window.location.href = 'jobs.html';
    }, 2000);
    
    return false;
}
