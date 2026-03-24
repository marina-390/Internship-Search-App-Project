# InternHub - Internship Search App Template

A clean, minimal, and responsive website template for an internship search platform. Includes registration with role selection (student/company), internship listing/details templates, and student/company profile pages with CV download.

## 📋 Project Structure

```
internship-search-app/
├── index.html                 # Homepage
├── auth.html                  # Login/Register (student & company roles)
├── internships.html           # Internship listing template
├── internship-detail.html     # Internship details template
├── student-profile.html       # Student profile + CV download
├── company-profile.html       # Company profile + job management
├── css/
│   └── style.css             # Complete stylesheet
├── js/
│   └── script.js             # Interactivity & validation
└── README.md                 # This file
```

## 🎯 Key Features

### Authentication (auth.html)
**Login & Register with Role Selection:**
- 🎓 **Student Role** - Register as student looking for internships
- 💼 **Company Role** - Register as employer posting positions
- Dynamic form fields based on selected role
- Built-in form validation
- Social login options (Google, GitHub)

**Student Registration Fields:**
- First/Last Name
- Email
- University/School
- Major
- Expected Graduation Year
- Password

**Company Registration Fields:**
- First/Last Name
- Email
- Company Name
- Job Title
- Company Size
- Company Website
- Password

### Internship Listing (internships.html)
- **Template job card** - Easy to duplicate and customize
- Search & filter functionality
- Job metadata badges (location, duration, skills)
- Salary information
- Favorite/bookmark button
- Responsive grid layout

### Internship Details (internship-detail.html)
- **Template layout** with all common sections:
  - Job overview (salary, duration, location, type)
  - About the role
  - Responsibilities
  - Requirements
  - Company information
- Quick apply form with PDF resume upload
- Share on social media
- Save position button

### Student Profile (student-profile.html)
- 📥 **CV/Resume Download** - Main feature
- 📤 Upload new CV/Resume
- Profile information (name, university, graduation year)
- Skills section (grid layout)
- Experience & projects timeline
- Education details
- Applications tracker
- Saved positions list
- Edit profile button

### Company Profile (company-profile.html)
- Company information display
- Active job postings management
- Edit/close position buttons
- Recent applications list
- Analytics dashboard (applications, views, etc.)
- Post new job button
- Company details section

## 🎨 Design

### Color Scheme
- Primary: Indigo (#4f46e5)
- Secondary: Emerald (#10b981)
- Dark: Slate (#1f2937)
- Light: Off-white (#f9fafb)

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: Below 768px

### Modern Features
- Smooth hover effects
- Form validation with feedback
- Hamburger menu for mobile
- Password visibility toggle
- Tab switching
- Card elevation on hover
- Clean typography

## 💻 Technologies

- **HTML5** - Semantic markup
- **CSS3** - Variables, flexbox, grid, media queries
- **JavaScript** - Vanilla JS, no frameworks
- **No Dependencies** - Lightweight & fast

## 🚀 Getting Started

### Run Locally
```bash
# Navigate to project folder
cd "Internship search app"

# Start Python server
python3 -m http.server 8000

# Visit http://localhost:8000
```

### Quick Customization

**Change Brand Name**
- Replace "InternHub" in all HTML files

**Update Colors**
```css
/* In css/style.css */
:root {
  --primary-color: #YOUR_COLOR;
  --secondary-color: #YOUR_COLOR;
  /* ... etc */
}
```

**Add Job Template**
Copy job-card from internships.html and customize:
```html
<div class="job-card" data-job-id="2">
  <div class="job-meta" style="display: flex; justify-content: space-between; align-items: start;">
    <div>
      <h3 class="job-title">Your Position</h3>
      <p class="job-company">Company Name</p>
    </div>
    <button class="favorite-btn">🤍</button>
  </div>
  <!-- Add more content -->
</div>
```

**Update Navigation**
Edit nav menu in any page:
```html
<ul class="nav-menu">
  <li><a href="your-page.html">Link</a></li>
</ul>
```

## 📝 Forms

### Login Form
- Email
- Password
- Remember me

### Registration (both roles)
- See "Key Features" section above

### Application Form
- Full name
- Email
- Phone
- Resume (PDF upload)
- Cover letter

## 🔧 JavaScript Features

- Auto-active navigation links
- Mobile hamburger menu
- Form validation (email, password)
- Real-time job search/filter
- Role-based form field toggling
- Password visibility toggle
- Favorite button toggle
- Input error feedback

## 🎯 Integration Ready

This is a **frontend-only template**. To connect to backend:

1. Replace form submissions with API calls
2. Implement JWT authentication
3. Connect to database (jobs, users, applications)
4. Add file uploads for resumes
5. Set up email notifications
6. Create admin dashboards
7. Implement payment processing

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📱 Responsive

- Mobile-first design
- Touch-friendly buttons
- Flexible layouts
- Optimized for all devices

## ✨ Key Design Decisions

1. **Minimal & Clean** - Focus on essential elements
2. **Template-Based** - Easy to duplicate sections
3. **No Bloat** - Only what you need
4. **Accessible** - Semantic HTML, readable contrast
5. **Fast** - No external dependencies
6. **Customizable** - CSS variables for easy theming

## 🎓 Browser Compatibility

Works on all modern browsers supporting:
- CSS Grid & Flexbox
- CSS Variables
- ES6 JavaScript
- HTML5 Forms

## 📄 Files

| File | Purpose |
|------|---------|
| index.html | Landing page |
| auth.html | Login/Register with roles |
| internships.html | Job listing page |
| internship-detail.html | Job details template |
| student-profile.html | Student account + CV download |
| company-profile.html | Company account + job mgmt |
| css/style.css | All styling (1000+ lines) |
| js/script.js | All interactivity |

## 💡 Pro Tips

1. Use data attributes for dynamic content
2. Update CSS variables for consistent theming
3. Keep form validation rules centralized
4. Use semantic HTML for accessibility
5. Test on mobile while developing

## 🚀 Ready to Build!

This template is production-ready for frontend. Connect to your backend API and you're good to go!

---

**Happy building!** 🎉
