# InternHub - Internship Search App Template

A clean, modern, and responsive website template for an internship search platform built with HTML, CSS, and minimal JavaScript.

## 📋 Project Structure

```
internship-search-app/
├── index.html                 # Homepage with hero section
├── internships.html           # Internships listing page
├── internship-detail.html     # Single internship details page
├── auth.html                  # Login and registration page
├── css/
│   └── style.css             # Main stylesheet (all styles)
├── js/
│   └── script.js             # Minimal JavaScript for interactivity
└── README.md                 # This file
```

## 🎯 Features

### Homepage (index.html)
- Hero section with call-to-action buttons
- Features section highlighting platform benefits
- Statistics section showing key metrics
- Call-to-action section encouraging exploration
- Responsive footer with multiple sections

### Internships Listing (internships.html)
- Clean job card layout with hover effects
- Search functionality to filter by position or company
- Filter categories dropdown
- Job metadata badges (location, duration, tech stack, salary)
- Direct links to internship details page
- Favorite/bookmark functionality
- Fully responsive grid layout

### Internship Details (internship-detail.html)
- Comprehensive job information display
- Job overview with key details (salary, duration, location, type)
- Detailed responsibilities and requirements sections
- Benefits and perks section
- Company information card
- Quick apply form sidebar
- Similar positions suggestions
- Share functionality

### Authentication Pages (auth.html)
- Tabbed interface for Login and Register
- Responsive login form with email and password
- Comprehensive registration form with validation
- Password visibility toggle
- Social login buttons (Google, GitHub)
- Security information section
- Terms of Service and Privacy Policy links
- "Forgot Password" link

## 🎨 Design Features

### Modern Color Scheme
- **Primary Color:** Indigo Blue (#4f46e5)
- **Secondary Color:** Emerald Green (#10b981)
- **Dark:** Slate (#1f2937)
- **Light:** Off-white (#f9fafb)

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grid and flex layouts
- Breakpoints at 768px and 480px
- Optimized font sizes for all devices

### Interactive Components
- Smooth navigation with active links
- Card hover effects with elevation
- Form validation with visual feedback
- Password visibility toggle
- Hamburger menu with smooth animation
- Favorite button with heart toggle
- Tab switching for login/register

## 💻 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties (CSS variables), flexbox, grid, media queries
- **Vanilla JavaScript** - No frameworks or dependencies

## 📱 Responsive Breakpoints

- **Desktop:** 1200px+ (full layout)
- **Tablet:** 768px-1199px (adjusted spacing and layout)
- **Mobile:** Below 768px (single column layout)
- **Small Mobile:** Below 480px (further optimized sizing)

## 🎯 How to Use

### Opening the Website
1. Open `index.html` in any modern web browser
2. Or start a local server in the project directory:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

### Customization Guide

#### Change Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
  --primary-color: #4f46e5;      /* Change this */
  --secondary-color: #10b981;    /* Change this */
  --dark-color: #1f2937;         /* Change this */
  /* ... etc */
}
```

#### Change Font
Update the `font-family` in the `body` selector in `css/style.css`:
```css
body {
  font-family: 'Your Font', sans-serif;
}
```

#### Update Logo/Brand Name
Search and replace "InternHub" with your company name in all HTML files.

#### Add More Job Listings
Copy a job-card div from `internships.html` and customize the content:
```html
<div class="job-card" data-job-id="7">
  <div class="job-meta" style="display: flex; justify-content: space-between; align-items: start;">
    <div>
      <h3 class="job-title">Your Position Title</h3>
      <p class="job-company">Your Company Name</p>
    </div>
    <button class="favorite-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">🤍</button>
  </div>
  <!-- ... rest of card content ... -->
</div>
```

#### Modify Navigation Links
Edit the navigation menu in any HTML file to change links:
```html
<ul class="nav-menu">
  <li class="nav-item">
    <a href="your-page.html" class="nav-link">Your Link</a>
  </li>
</ul>
```

#### Update Footer Content
Customize footer sections in any HTML file to add your social links, company info, etc.

## 🔧 JavaScript Features

### Navigation
- Auto-active nav link detection based on current page
- Hamburger menu toggle for mobile
- Smooth closing of menu when a link is clicked

### Form Validation
- Email format validation
- Password length check (minimum 6 characters)
- Required field validation with visual feedback
- Form error clearing on input

### Search & Filter
- Real-time search filtering of job cards
- Case-insensitive matching
- Filter by position title or company name

### Interactive Features
- Password visibility toggle
- Favorite button with heart emoji toggle
- Tab switching for login/register forms
- URL parameter handling for job details page

## 📝 Form Fields Included

### Login Form
- Email address
- Password
- Remember me checkbox
- Forgot password link

### Registration Form
- First name
- Last name
- Email address
- University/School
- Major
- Password with confirmation
- Terms agreement checkbox

### Quick Apply Form (Job Details)
- Full name
- Email address
- Phone number
- Resume upload (PDF)
- Cover letter

## 🎓 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📦 No Dependencies

This template uses pure HTML, CSS, and vanilla JavaScript. No external libraries or frameworks are required, making it lightweight and easy to customize.

## 🚀 Next Steps for Backend Integration

To connect this template to a backend:

1. Replace inline form submissions with API calls
2. Update form actions to POST to your backend endpoints
3. Implement user authentication with JWT tokens
4. Connect job listings to a database
5. Add image uploads for resumes and profiles
6. Implement real search with database queries
7. Add user dashboard and profile pages
8. Set up email notifications

## 📄 License

Apache 2.0

## 💡 Tips & Best Practices

1. **SEO Optimization**
   - Add meta descriptions to each page
   - Update page titles appropriately
   - Add structured data/JSON-LD

2. **Performance**
   - Optimize and compress images before adding
   - Minify CSS and JavaScript in production
   - Use a CDN for faster delivery

3. **Accessibility**
   - Test with screen readers
   - Ensure proper color contrast
   - Add ARIA labels where needed

4. **Security**
   - Always validate forms on the backend
   - Use HTTPS in production
   - Sanitize user inputs
   - Implement CSRF protection

5. **User Experience**
   - Add loading spinners during form submission
   - Implement proper error messages
   - Add success confirmations
   - Test across different devices

## 🤝 Support

For questions or improvements, refer to the HTML comments in the code or check the CSS variables for customization points.

---

Happy coding! Best of luck with your internship search platform! 🚀
