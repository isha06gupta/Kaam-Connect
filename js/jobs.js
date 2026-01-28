// Jobs page JavaScript

// Sample job data
const jobsData = [
    {
        id: 1,
        title: "Carpenter Needed for Furniture Making",
        company: "Home Decor Solutions",
        location: "Mumbai, Maharashtra",
        category: "carpentry",
        type: "Daily Wage",
        salary: "₹800-1000/day",
        duration: "1 Week",
        badge: "URGENT",
        description: "Need experienced carpenter for custom furniture making. Must have own tools.",
        posted: "2 hours ago"
    },
    {
        id: 2,
        title: "House Painting Work",
        company: "Paint Masters",
        location: "Delhi NCR",
        category: "painting",
        type: "Daily Wage",
        salary: "₹600-800/day",
        duration: "3 Days",
        badge: null,
        description: "Residential house painting required. 2-3 painters needed.",
        posted: "1 day ago"
    },
    {
        id: 3,
        title: "Plumber for New Construction",
        company: "BuildPro Contractors",
        location: "Bangalore, Karnataka",
        category: "plumbing",
        type: "Weekly",
        salary: "₹900-1200/day",
        duration: "1 Month",
        badge: "VERIFIED",
        description: "Plumbing work for new residential building. Experience required.",
        posted: "3 days ago"
    },
    {
        id: 4,
        title: "Electrician - Commercial Project",
        company: "PowerTech Solutions",
        location: "Pune, Maharashtra",
        category: "electrical",
        type: "Full-time",
        salary: "₹15,000-20,000/month",
        duration: "Ongoing",
        badge: "FEATURED",
        description: "Licensed electrician needed for commercial building project.",
        posted: "5 days ago"
    },
    {
        id: 5,
        title: "Construction Helper",
        company: "Metro Construction",
        location: "Hyderabad, Telangana",
        category: "construction",
        type: "Daily Wage",
        salary: "₹500-650/day",
        duration: "2 Weeks",
        badge: null,
        description: "Multiple helpers needed for construction site. No experience required.",
        posted: "1 week ago"
    },
    {
        id: 6,
        title: "Housekeeping Staff",
        company: "Clean Home Services",
        location: "Chennai, Tamil Nadu",
        category: "housekeeping",
        type: "Part-time",
        salary: "₹8,000-10,000/month",
        duration: "Ongoing",
        badge: null,
        description: "Need reliable housekeeping staff for residential apartments.",
        posted: "2 days ago"
    }
];

// Initialize jobs
document.addEventListener('DOMContentLoaded', () => {
    renderJobs(jobsData);
});

// Render jobs
function renderJobs(jobs) {
    const jobsGrid = document.getElementById('jobsGrid');
    if (!jobsGrid) return;
    
    jobsGrid.innerHTML = '';
    
    jobs.forEach((job, index) => {
        const jobCard = createJobCard(job, index);
        jobsGrid.appendChild(jobCard);
    });
}

// Create job card
function createJobCard(job, index) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="job-header">
            <span class="job-category">${job.category}</span>
            ${job.badge ? `<span class="job-badge">${job.badge}</span>` : ''}
        </div>
        <h3 class="job-title">${job.title}</h3>
        <p class="job-company">${job.company}</p>
        <div class="job-details">
            <div class="job-detail">
                <span class="job-detail-icon">📍</span>
                <span>${job.location}</span>
            </div>
            <div class="job-detail">
                <span class="job-detail-icon">💼</span>
                <span>${job.type}</span>
            </div>
            <div class="job-detail">
                <span class="job-detail-icon">🕐</span>
                <span>${job.posted}</span>
            </div>
        </div>
        <p class="job-description">${job.description}</p>
        <div class="job-footer">
            <div class="job-salary">${job.salary}</div>
            <button class="job-apply" onclick="applyJob(${job.id})">Apply Now</button>
        </div>
    `;
    
    return card;
}

// Search jobs
function searchJobs() {
    const keyword = document.getElementById('searchKeyword').value.toLowerCase();
    const location = document.getElementById('searchLocation').value.toLowerCase();
    const category = document.getElementById('searchCategory').value;
    
    let filtered = jobsData;
    
    if (keyword) {
        filtered = filtered.filter(job => 
            job.title.toLowerCase().includes(keyword) || 
            job.description.toLowerCase().includes(keyword)
        );
    }
    
    if (location) {
        filtered = filtered.filter(job => 
            job.location.toLowerCase().includes(location)
        );
    }
    
    if (category) {
        filtered = filtered.filter(job => job.category === category);
    }
    
    renderJobs(filtered);
}

// Apply to job
function applyJob(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (job) {
        alert(`Applying to: ${job.title}\n\nIn a real application, this would:\n1. Check if you're logged in\n2. Show application form\n3. Send your profile to employer\n4. Notify you of status updates`);
    }
}
