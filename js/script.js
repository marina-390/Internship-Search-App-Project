/* ==========================================
   INTERNSHIP SEARCH APP - JAVASCRIPT
   ========================================== */

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// Set Active Nav Link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Call on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Form Validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

  inputs.forEach(input => {
    if (input.value.trim() === '') {
      input.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  // Email validation
  const emailInputs = form.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.value && !emailRegex.test(input.value)) {
      input.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  // Password validation (min 6 characters)
  const passwordInputs = form.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    if (input.value && input.value.length < 6) {
      input.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  return isValid;
}

// Form Tab Switching
function switchTab(tabName) {
  const forms = document.querySelectorAll('.auth-form-wrapper');
  const tabs = document.querySelectorAll('.form-tab');
  
  forms.forEach(form => form.classList.remove('active'));
  tabs.forEach(tab => tab.classList.remove('active'));
  
  const activeForm = document.getElementById(tabName + 'Form');
  if (activeForm) {
    activeForm.classList.add('active');
  }
  
  const activeTab = event.target;
  if (activeTab) {
    activeTab.classList.add('active');
  }
}

// Handle Student Login
function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  
  if (validateForm('loginForm')) {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Store student session in localStorage
    const studentData = {
      email: email,
      fullName: 'Student User',
      university: 'University Name',
      major: 'Computer Science',
      expectedGraduation: '2025',
      location: 'Location, Country',
      about: 'Write a brief bio about yourself.',
      skills: ['JavaScript', 'Python', 'React', 'Web Design', 'Communication', 'Problem Solving'],
      experience: [
        {
          title: 'Project Title',
          date: '2024',
          description: 'Describe your project here.'
        }
      ],
      applications: [
        { position: 'Frontend Developer Intern', status: 'Pending Review' },
        { position: 'UX Designer Intern', status: 'Accepted' }
      ],
      savedPositions: [
        { position: 'Backend Developer Intern', company: 'CloudSystems Ltd.' }
      ],
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(studentData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to student profile
    window.location.href = 'student-profile.html';
  }
}

// Handle Student Registration
function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  
  if (validateForm('registerForm')) {
    const email = document.getElementById('regEmail').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    
    if (role === 'student') {
      const studentData = {
        email: email,
        fullName: 'Student User',
        university: 'University Name',
        major: 'Computer Science',
        expectedGraduation: '2025',
        location: 'Location, Country',
        about: 'Write a brief bio about yourself.',
        skills: ['JavaScript', 'Python', 'React', 'Web Design', 'Communication', 'Problem Solving'],
        experience: [],
        applications: [],
        savedPositions: [],
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(studentData));
      localStorage.setItem('isLoggedIn', 'true');
      
      alert('Registration successful! Redirecting to your profile...');
      window.location.href = 'student-profile.html';
    } else {
      alert('Registration successful! (Employer registration coming soon)');
      form.reset();
    }
  }
}

// Password Visibility Toggle
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

// Toggle Role Fields
function toggleRoleFields() {
  const studentFields = document.getElementById('studentFields');
  const companyFields = document.getElementById('companyFields');
  const role = document.querySelector('input[name="role"]:checked').value;
  
  if (role === 'student') {
    if (studentFields) studentFields.style.display = '';
    if (companyFields) companyFields.style.display = 'none';
  } else {
    if (studentFields) studentFields.style.display = 'none';
    if (companyFields) companyFields.style.display = '';
  }
}

// Form submission handlers
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', handleLogin);
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', handleRegister);
}

// Job Card Navigation
const jobCards = document.querySelectorAll('.job-card');
jobCards.forEach(card => {
  card.addEventListener('click', function() {
    const jobId = this.getAttribute('data-job-id');
    if (jobId) {
      window.location.href = `internship-detail.html?id=${jobId}`;
    }
  });
});

// Get URL Parameters
function getUrlParameter(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Search/Filter functionality
const searchInput = document.getElementById('searchInput');
const filterBtn = document.getElementById('filterBtn');

if (searchInput && filterBtn) {
  searchInput.addEventListener('keyup', filterJobs);
  filterBtn.addEventListener('click', filterJobs);
}

function filterJobs() {
  const searchText = searchInput ? searchInput.value.toLowerCase() : '';
  const jobCards = document.querySelectorAll('.job-card');

  jobCards.forEach(card => {
    const title = card.querySelector('.job-title').textContent.toLowerCase();
    const company = card.querySelector('.job-company').textContent.toLowerCase();
    
    if (title.includes(searchText) || company.includes(searchText)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Add to Favorites (Demo)
const favoriteButtons = document.querySelectorAll('.job-card .favorite-btn');
favoriteButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    const jobTitle = this.closest('.job-card').querySelector('.job-title').textContent;
    if (this.classList.contains('active')) {
      alert(`Added "${jobTitle}" to favorites!`);
    } else {
      alert(`Removed "${jobTitle}" from favorites!`);
    }
  });
});

// Clear form errors on input
document.addEventListener('input', function(e) {
  if (e.target.matches('input, textarea, select')) {
    if (e.target.value.trim() !== '') {
      e.target.style.borderColor = '';
    }
  }
});

// Check if user is logged in and load profile
function checkAndLoadProfile() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const currentUser = localStorage.getItem('currentUser');
  
  if (!isLoggedIn || !currentUser) {
    // Not logged in, redirect to auth page if on student profile
    if (window.location.pathname.includes('student-profile.html')) {
      window.location.href = 'auth.html';
    }
    return null;
  }
  
  return JSON.parse(currentUser);
}

// Load Student Profile
function loadStudentProfile() {
  const user = checkAndLoadProfile();
  if (!user) return;
  
  // Update profile header
  const profileName = document.querySelector('.profile-info h2');
  const profileEmail = document.querySelectorAll('.profile-info p')[0];
  const profileUniversity = document.querySelectorAll('.profile-info p')[1];
  const profileGrad = document.querySelectorAll('.profile-info p')[2];
  const profileLocation = document.querySelectorAll('.profile-info p')[3];
  
  if (profileName) profileName.textContent = user.fullName;
  if (profileEmail) profileEmail.textContent = user.email;
  if (profileUniversity) profileUniversity.innerHTML = `📚 ${user.university} - ${user.major}`;
  if (profileGrad) profileGrad.innerHTML = `🎓 Expected Graduation: ${user.expectedGraduation}`;
  if (profileLocation) profileLocation.innerHTML = `📍 ${user.location}`;
  
  // Update About Section
  const aboutDisplay = document.getElementById('aboutDisplay');
  if (aboutDisplay) aboutDisplay.textContent = user.about;
  
  // Update Skills
  const skillsDisplay = document.getElementById('skillsDisplay');
  if (skillsDisplay) {
    skillsDisplay.innerHTML = '';
    user.skills.forEach(skill => {
      const skillTag = document.createElement('div');
      skillTag.className = 'skill-tag';
      skillTag.textContent = skill;
      skillsDisplay.appendChild(skillTag);
    });
  }
  
  // Add Logout button
  addLogoutButton();
}

// Add Logout Button to Navigation
function addLogoutButton() {
  const navMenu = document.querySelector('.nav-menu');
  const existingLogout = document.querySelector('.logout-link');
  
  if (navMenu && !existingLogout) {
    const logoutLi = document.createElement('li');
    logoutLi.className = 'nav-item';
    logoutLi.innerHTML = '<a href="#" class="nav-link logout-link" onclick="logoutStudent(event)">Logout</a>';
    navMenu.appendChild(logoutLi);
  }
}

// Logout Student
function logoutStudent(event) {
  event.preventDefault();
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}

// Toggle Profile Edit Mode
function enterEditMode() {
  const user = checkAndLoadProfile();
  if (!user) return;
  
  // Hide display mode, show edit mode
  document.getElementById('displayMode').style.display = 'none';
  document.getElementById('editMode').style.display = 'block';
  document.getElementById('editProfileBtn').style.display = 'none';
  
  // Populate form with current user data
  document.getElementById('editFullName').value = user.fullName;
  document.getElementById('editEmail').value = user.email;
  document.getElementById('editUniversity').value = user.university;
  document.getElementById('editMajor').value = user.major;
  document.getElementById('editGraduation').value = user.expectedGraduation;
  document.getElementById('editLocation').value = user.location;
  document.getElementById('editAbout').value = user.about;
  document.getElementById('editSkills').value = user.skills.join(', ');
}

// Cancel Edit Mode
function cancelEditMode() {
  document.getElementById('displayMode').style.display = 'block';
  document.getElementById('editMode').style.display = 'none';
  document.getElementById('editProfileBtn').style.display = 'inline-block';
}

// Save Profile Changes
function saveProfileChanges(event) {
  event.preventDefault();
  
  const user = checkAndLoadProfile();
  if (!user) return;
  
  // Get values from form
  user.fullName = document.getElementById('editFullName').value;
  user.email = document.getElementById('editEmail').value;
  user.university = document.getElementById('editUniversity').value;
  user.major = document.getElementById('editMajor').value;
  user.expectedGraduation = document.getElementById('editGraduation').value;
  user.location = document.getElementById('editLocation').value;
  user.about = document.getElementById('editAbout').value;
  
  // Parse skills from comma-separated string
  const skillsText = document.getElementById('editSkills').value;
  user.skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  alert('Profile saved successfully!');
  
  // Exit edit mode and reload display
  cancelEditMode();
  loadStudentProfile();
}

// Enable Profile Editing
function enableProfileEditing() {
  // This function is no longer needed - replaced with enterEditMode
}

// Download CV
function downloadCV() {
  const user = checkAndLoadProfile();
  if (!user) return;
  
  // Create a simple CV in text format
  const cvContent = `
═══════════════════════════════════════════════════════════
                      CURRICULUM VITAE
═══════════════════════════════════════════════════════════

NAME: ${user.fullName}
EMAIL: ${user.email}
LOCATION: ${user.location}

───────────────────────────────────────────────────────────
EDUCATION
───────────────────────────────────────────────────────────
University: ${user.university}
Major: ${user.major}
Expected Graduation: ${user.expectedGraduation}

───────────────────────────────────────────────────────────
ABOUT
───────────────────────────────────────────────────────────
${user.about}

───────────────────────────────────────────────────────────
SKILLS
───────────────────────────────────────────────────────────
${user.skills.join(', ')}

───────────────────────────────────────────────────────────
EXPERIENCE & PROJECTS
───────────────────────────────────────────────────────────
${user.experience.map(exp => `
${exp.title} (${exp.date})
${exp.description}
`).join('\n')}

═══════════════════════════════════════════════════════════
Downloaded on: ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════════════════
  `.trim();
  
  // Create a blob and download
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvContent));
  element.setAttribute('download', `${user.fullName.replace(/\s+/g, '_')}_CV.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// Initialize profile page on load
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('student-profile.html')) {
    loadStudentProfile();
  }
  setActiveNavLink();
});
