const TRANSLATIONS = {
  en: {
    nav: {
      internships: 'Internships',
      loginRegister: 'Login / Register',
      profile: 'Profile',
      logout: 'Logout',
      adminPanel: 'Admin Panel'
    },
    footer: {
      aboutHeading: 'About InternHub',
      aboutUs: 'About Us',
      team: 'Our Team',
      contact: 'Contact',
      studentsHeading: 'For Students',
      careerResources: 'Career Resources',
      resumeBuilder: 'Resume Builder',
      interviewTips: 'Interview Tips',
      employersHeading: 'For Employers',
      postJob: 'Post Job',
      browseCandidates: 'Browse Candidates',
      support: 'Support',
      legalHeading: 'Legal',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookiePolicy: 'Cookie Policy',
      copyright: '© 2026 InternHub. All rights reserved. | Helping students find their next opportunity'
    },
    hero: {
      title: 'Find Your Perfect Internship',
      subtitle: 'Discover exciting internship opportunities with leading companies and launch your career',
      btnBrowse: 'Browse Internships',
      btnPost: 'Post Internship'
    },
    logoStrip: {
      label: 'Trusted by interns from the leading educational institutions'
    },
    carousel: {
      step1: 'Step 01', step1Title: 'Apply', step1Desc: 'Browse hundreds of positions and submit your application in minutes',
      step2: 'Step 02', step2Title: 'Interview', step2Desc: 'Connect with top companies and showcase your skills',
      step3: 'Step 03', step3Title: 'Get Hired', step3Desc: 'Land your dream internship and launch your career'
    },
    cta: {
      label: 'Get started today',
      headline: 'Ready to launch your career?',
      description: 'Join thousands of students already finding great internships through InternHub. It only takes two minutes to create your profile.',
      studentTitle: "I'm a Student", studentDesc: 'Find internships that match your skills',
      employerTitle: "I'm an Employer", employerDesc: 'Post positions and find great interns',
      signinTitle: 'Sign In', signinDesc: 'Continue where you left off'
    },
    auth: {
      pageTitle: 'Join InternHub', pageSubtitle: 'Start your internship journey today',
      tabLogin: 'Login', tabRegister: 'Register',
      loginHeading: 'Welcome Back',
      emailLabel: 'Email Address', emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password', passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      btnSignIn: 'Sign In', forgotPassword: 'Forgot Password?',
      divider: 'or',
      noAccount: "Don't have an account?", signupLink: 'Sign up here',
      registerHeading: 'Create Your Account',
      roleLabel: 'I am a...', roleStudent: '🎓 Student', roleEmployer: '💼 Company/Employer',
      firstNameLabel: 'First Name', firstNamePlaceholder: 'First name',
      lastNameLabel: 'Last Name', lastNamePlaceholder: 'Last name',
      eduLevelLabel: 'Education Level', eduLevelPlaceholder: 'Select level...',
      eduUniversity: 'University / Applied Sciences', eduCollege: 'College / Vocational',
      eduHighSchool: 'High School / Secondary', eduOther: 'Other',
      majorLabel: 'Major', majorPlaceholder: 'e.g., Computer Science',
      jobTitleLabel: 'Your Job Title', jobTitlePlaceholder: 'e.g., HR Manager, Recruiter',
      companyNameLabel: 'Company Name', companyNamePlaceholder: 'Your company name',
      companyWebsiteLabel: 'Company Website', companyWebsitePlaceholder: 'https://www.yourcompany.com',
      yTunnusLabel: 'Y-Tunnus', yTunnusNote: '(Finnish Business ID, required)',
      yTunnusPlaceholder: '123456-7', yTunnusFormat: 'Format: 6-7 digits - 1 digit',
      passwordRegPlaceholder: 'At least 8 characters',
      passwordRequirements: 'Password: Min 8 chars, 2 numbers (0-9), and 2 special symbols (!!, @#, etc.)',
      confirmPasswordLabel: 'Confirm Password', confirmPasswordPlaceholder: 'Confirm your password',
      agreePrefix: 'I agree to the', termsLink: 'Terms of Service', privacyLink: 'Privacy Policy',
      btnCreateAccount: 'Create Account',
      hasAccount: 'Already have an account?', signinLink: 'Sign in here',
      emailConfirmTitle: 'Check your email!',
      emailConfirmMsg: 'We sent a confirmation link to',
      emailConfirmNote: "Click the link to activate your account. Check your spam folder if you don't see it.",
      btnResend: 'Resend confirmation email', btnBackSignin: 'Back to Sign In',
      benefitsTitle: 'Why Join InternHub?',
      benefit1Title: 'Save Your Progress', benefit1Desc: 'Save your applications and track your progress across multiple internship opportunities.',
      benefit2Title: 'Manage Favorites', benefit2Desc: "Bookmark positions you're interested in and organize them into lists for easy access.",
      benefit3Title: 'Build Your Profile', benefit3Desc: 'Create a professional profile that employers can view when reviewing your applications.',
      forgotHeading: 'Reset Password', forgotDesc: "Enter your email address and we'll send you a reset link.",
      forgotEmailPlaceholder: 'your@email.com', btnSendReset: 'Send Reset Link', btnCancel: 'Cancel'
    },
    internships: {
      positionLabel: 'Position / Company', positionPlaceholder: 'e.g. Developer, Google...',
      locationLabel: 'Location', locationPlaceholder: 'Helsinki, Remote...',
      categoryLabel: 'Category', categoryDefault: 'All Categories',
      startLabel: 'Start After', endLabel: 'End Before',
      favorites: 'My Favourites', btnFilter: 'Apply Filters',
      noResultsTitle: 'No internships found', noResultsDesc: 'Try adjusting your search filters'
    },
    detail: {
      backLink: '← Back to Internships',
      overviewTitle: 'Job Overview',
      salaryLabel: 'SALARY', durationLabel: 'DURATION', locationLabel: 'LOCATION',
      aboutTitle: 'About Us', descTitle: 'Description',
      responsibilitiesTitle: 'Responsibilities', requirementsTitle: 'Requirements',
      btnApply: 'Apply Now', btnSave: 'Save Position',
      companyCardTitle: 'Company Profile',
      emailLabel: 'Email:', websiteLabel: 'Website:',
      hqLabel: 'Headquarters:', yTunnusLabel: 'Business ID (Y-Tunnus):',
      applicantsTitle: '📋 Received Applications', applicantsEmpty: 'No applications yet.',
      applyFormFirstName: 'First Name', applyFormLastName: 'Last Name',
      applyFormEmail: 'Email Address', applyFormPhone: 'Phone Number',
      applyFormCvTitle: '📄 CV / Resume', applyFormCvEmpty: 'No CV uploaded yet.',
      applyFormCvUpload: 'Upload different CV (PDF)',
      applyFormLetterLabel: 'Cover Letter / Why should we hire you?',
      applyFormLetterPlaceholder: 'Write something to the employer...',
      btnSubmit: 'Submit Application'
    },
    studentProfile: {
      btnEdit: 'Edit Profile', btnSave: 'Save', btnCancel: 'Cancel',
      personalTitle: 'Personal Information',
      firstNameLabel: 'First Name', lastNameLabel: 'Last Name',
      birthDateLabel: 'Date of Birth', phoneLabel: 'Phone', cityLabel: 'City',
      aboutTitle: 'About Me', aboutPlaceholder: 'Tell about yourself...',
      categoriesTitle: 'Desired Job Categories', categoriesSearch: 'Search categories...',
      linksTitle: 'Links', btnAddLink: '+ Add Link',
      educationTitle: 'Education History', btnAddEducation: '+ Add Education',
      openToOffers: 'Open to offers',
      requestsTitle: 'Internship Requests', btnAddRequest: '+ Add',
      cvTitle: '📄 CV / Resume', cvEmpty: 'No CV uploaded yet.', btnUploadCv: 'Upload CV (PDF)',
      applicationsTitle: '📋 My Applications', applicationsEmpty: 'No applications yet.',
      savedTitle: '❤️ Saved Internships', savedEmpty: 'No saved internships yet.',
      langTitle: '🌐 Interface Language',
      dangerTitle: '⚠ Danger Zone',
      dangerDesc: 'Permanently delete your account and all personal data (GDPR Art. 17).',
      btnDeleteAccount: 'Delete My Account',
      deleteModalTitle: 'Delete Account',
      deleteModalIntro: 'This will permanently delete:',
      deleteItem1: 'Your profile and personal data',
      deleteItem2: 'All applications',
      deleteItem3: 'All internship requests',
      deleteItem4: 'Your CV and photo',
      deleteWarning: 'This action cannot be undone.',
      deleteConfirmText: 'Type DELETE to confirm:',
      deleteInputPlaceholder: 'Type DELETE',
      btnDeletePermanent: 'Delete permanently'
    },
    companyProfile: {
      btnEdit: 'Edit Profile', btnSave: 'Save', btnCancel: 'Cancel',
      aboutTitle: 'About Company',
      editTitle: 'Edit Company Details',
      nameLabel: 'Company Name', emailLabel: 'Company Email',
      aboutLabel: 'About Company', locationLabel: 'Location',
      businessIdLabel: 'Business ID (Y-Tunnus)', websiteLabel: 'Website',
      teamTitle: 'Our Team', btnAddMember: '➕ Add New Member',
      memberNamePlaceholder: 'Full Name', memberTitlePlaceholder: 'Job Title (e.g. CEO)',
      memberEmailPlaceholder: 'Email Address', memberPhonePlaceholder: 'Phone Number',
      btnConfirmAdd: 'Confirm Add', teamEmpty: 'No team members listed.',
      postingsTitle: 'Current Postings', postingsEmpty: 'No postings yet.',
      postSidebarTitle: 'Post New Job', postSidebarDesc: 'Create a new internship listing.',
      btnPostNew: '➕ Post New Position',
      postModalTitle: 'Create New Internship',
      postTitleLabel: 'Job Title *', postDescLabel: 'Description *',
      postResponLabel: 'Responsibilities', postReqsLabel: 'Requirements',
      postSalaryLabel: 'Salary / Compensation', postStartLabel: 'Start Date', postEndLabel: 'End Date',
      postOpenEnded: 'This position is open-ended (no fixed end date)',
      postCategoryLabel: 'Category *', postCategoryDefault: 'Select a category...',
      postVisibilityLabel: 'Visibility',
      btnPostSubmit: 'Post Position',
      appReviewTitle: 'Review Application',
      appPositionLabel: 'Position:', appApplicantLabel: 'Applicant:',
      appEmailLabel: 'Email:', appPhoneLabel: 'Phone:', appStatusLabel: 'Status:',
      appLetterLabel: 'Cover Letter', appLetterEmpty: 'No cover letter provided.',
      appCvLabel: 'CV / Resume',
      btnAccept: 'Accept', btnDecline: 'Decline', btnViewed: 'Mark Viewed', btnClose: 'Close'
    },
    common: {
      save: 'Save', cancel: 'Cancel', confirm: 'Confirm', delete: 'Delete',
      edit: 'Edit', close: 'Close', loading: 'Loading...', search: 'Search',
      yes: 'Yes', no: 'No', or: 'or', optional: '(optional)'
    },
    pages: {
      aboutUs: {
        title: 'About InternHub', subtitle: 'Empowering students to find meaningful internship opportunities',
        missionH: 'Our Mission', missionP: 'InternHub is a student-built project created by three students with a simple goal: to help other students find internships more easily during challenging times. We aim to connect students with companies that offer real opportunities to learn, grow, and gain experience.',
        visionH: 'Our Vision', visionP: 'To build a platform where every student can easily access internship opportunities that support their personal and professional growth.',
        offerH: 'What We Offer', offer1: 'Simple internship search platform', offer2: 'Career preparation tools', offer3: 'Connections with companies', offer4: 'CV and interview resources', offer5: 'Student support system',
        whyH: 'Why InternHub?', rel: '🎯 Reliable Opportunities', relP: 'We focus on sharing useful and relevant internship listings.',
        career: '🚀 Career Development', careerP: 'We help students gain skills and prepare for their future careers.',
        connect: '💼 Real Connections', connectP: 'We connect students directly with companies and professionals.',
        simple: '📱 Simple Experience', simpleP: 'Our platform is clean, fast, and easy to use for everyone.'
      },
      team: {
        title: 'Our Team', subtitle: 'We are 3 students building InternHub to help others find internships more easily',
        meetH: 'Meet the Developers',
        m1Role: 'UI/UX Designer & Frontend Developer', m1Desc: 'Focused on user interface design, user experience, and making the platform clean, simple, and visually appealing.',
        m2Role: 'Database & Backend Developer', m2Desc: 'Responsible for database structure, data handling, and ensuring the platform runs smoothly and securely.',
        m3Role: 'Logic & Full-Stack Developer', m3Desc: 'Works on core logic, functionality, and supports both frontend and backend development to keep the system working properly.',
        about: 'InternHub is a student project created by three developers. We combine design, backend, and logic skills to build a platform that helps students find internships during challenging times.'
      },
      contact: {
        title: 'Contact Us', subtitle: "We'd love to hear from you", getInTouch: 'Get in Touch',
        helpText: "Have questions or feedback? We're here to help!",
        nameLabel: 'Full Name', emailLabel: 'Email', subjectLabel: 'Subject', msgLabel: 'Message', btnSend: 'Send Message',
        contactInfo: 'Contact Information', addressH: '📍 Address', emailH: '📧 Email', phoneH: '📞 Phone', hoursH: '⏰ Business Hours',
        hoursV: 'Monday - Friday: 9:00 AM - 6:00 PM PST<br>Saturday - Sunday: Closed'
      },
      careerResources: {
        title: 'Career Resources', subtitle: 'Everything you need to succeed in your internship journey',
        c1H: '📝 Resume Writing Guide', c1P: 'Create a professional resume that stands out to employers and passes ATS systems.',
        c1L1: 'Use clear structure and formatting', c1L2: 'Focus on achievements, not duties', c1L3: 'Use strong action verbs', c1L4: 'Keep it 1 page for internships', c1Btn: 'Build Resume',
        c2H: '💼 Cover Letter Tips', c2P: 'Write personalized cover letters that increase your chances of getting interviews.',
        c2L1: 'Address the company directly', c2L2: 'Show motivation and fit', c2L3: 'Keep it short and clear', c2L4: 'Avoid generic templates',
        c3H: '🎯 Career Planning', c3P: 'Plan your career path and set clear goals for your future.',
        c3L1: 'Define short-term goals', c3L2: 'Set long-term career vision', c3L3: 'Track your progress', c3L4: 'Adjust based on experience',
        c4H: '🤝 Networking', c4P: 'Build connections that help you discover opportunities.',
        c4L1: 'Use LinkedIn actively', c4L2: 'Attend career events', c4L3: 'Reach out to professionals', c4L4: 'Follow up after meetings',
        c5H: '📚 Skill Development', c5P: 'Improve the skills employers are looking for.',
        c5L1: 'Learn technical tools', c5L2: 'Improve communication skills', c5L3: 'Take online courses', c5L4: 'Work on real projects',
        c6H: '💡 Interview Preparation', c6P: 'Prepare for interviews and increase your confidence.',
        c6L1: 'Practice common questions', c6L2: 'Research the company', c6L3: 'Prepare your story', c6L4: 'Ask good questions', c6Btn: 'View Tips'
      },
      resumeBuilder: {
        title: 'Resume Builder 🚀', fillInfo: 'Fill Your Info',
        namePh: 'Full Name', emailPh: 'Email', phonePh: 'Phone', educationPh: 'Education', experiencePh: 'Experience', skillsPh: 'Skills',
        downloadBtn: 'Download PDF', previewEdu: 'Education', previewExp: 'Experience', previewSkills: 'Skills'
      },
      interviewTips: {
        title: 'Interview Tips & Preparation', subtitle: 'Master your internship interviews with expert guidance',
        beforeH: 'Before Interview', duringH: 'During Interview', afterH: 'After Interview',
        b1H: 'Research the Company', b1P: 'Learn about mission, values, and products before the interview.',
        b2H: 'Practice Questions', b2P: 'Prepare answers like "Tell me about yourself".',
        b3H: 'Prepare Stories', b3P: 'Use STAR method: Situation, Task, Action, Result.',
        b4H: 'Mock Interviews', b4P: 'Practice with friends or mentors.',
        d1H: 'First Impression', d1P: 'Be on time, dress well, and stay confident.',
        d2H: 'Communication', d2P: 'Listen carefully and answer clearly.',
        d3H: 'Show Enthusiasm', d3P: 'Explain why you want this role.',
        d4H: 'Ask Questions', d4P: 'Ask about team and company culture.',
        a1H: 'Thank You Email', a1P: 'Send within 24 hours.',
        a2H: 'Self Review', a2P: 'Improve your future performance.',
        a3H: 'Follow Up', a3P: 'Check status politely if needed.',
        a4H: 'Negotiation', a4P: 'Focus on learning opportunities and growth.',
        commonQsH: 'Common Interview Questions',
        q1: 'Tell me about yourself', q2: 'Why this internship?', q3: 'Strengths and weaknesses', q4: 'Challenge you faced', q5: 'Where do you see yourself in 5 years?'
      },
      company: {
        title: 'Post Internship Information', subtitle: 'How the hiring system works on InternHub',
        h1H: '📌 How posting a job works', h1P: 'On InternHub, companies do not directly search for students. Instead, they create internship offers that students can apply to.',
        h1L1: 'Companies publish internship opportunities', h1L2: 'Students browse available jobs', h1L3: 'Students apply by sending their CV and details', h1L4: 'Companies receive applications only after students apply',
        h2H: '👨‍💼 What companies can do', h2L1: 'Create internship listings', h2L2: 'Receive student applications', h2L3: 'Review CVs and skills', h2L4: 'Contact selected candidates',
        h3H: '🔒 What companies cannot do', h3L1: 'Browse all students freely', h3L2: 'See private student profiles', h3L3: 'Access data without application',
        h4H: '⚙️ System logic', h4P: 'The system is based on applications. A student applies first, then the company can see their information in the application list.',
        h5H: '💡 Summary', h5P: 'InternHub is an application-based hiring platform. Companies receive talent only through student applications, ensuring privacy and structured recruitment.'
      },
      browseCandidates: {
        title: 'Internships', subtitle: 'How internship opportunities work on InternHub',
        s1H: '📌 What are internships here?', s1P: 'Internships on InternHub are opportunities created by companies. Students can browse these opportunities and apply directly.',
        s2H: '🎓 How students use this page', s2L1: 'Browse available internship listings', s2L2: 'Read job description and requirements', s2L3: 'Choose a position that matches skills', s2L4: 'Apply by submitting CV and details',
        s3H: '🏢 How companies use this system', s3L1: 'Publish internship offers', s3L2: 'Receive applications from students', s3L3: 'Review CVs and skills', s3L4: 'Contact selected candidates',
        s4H: '🔄 How the system works', s4P: 'InternHub is not a social platform for browsing people. It is an application-based system:',
        s4L1: 'Company creates internship post', s4L2: 'Student sees it in this page', s4L3: 'Student applies', s4L4: 'Company receives application',
        s5H: '🔒 Important rule', s5P: 'Students cannot be contacted or viewed before applying. All interaction happens only after an application is submitted.',
        s6H: '💡 Summary', s6P: 'This page is the main entry point for students. It connects them to internship opportunities and starts the application process.'
      },
      support: {
        title: 'Support Center', subtitle: 'We are here to help you if you need assistance',
        helpH: 'How Can We Help You?',
        c1H: '📚 Help Guide', c1P: 'Find answers to common questions about using InternHub and applying for internships.',
        c2H: '💬 Community', c2P: 'Connect with other students and share your experience.',
        c3H: '📧 Email Support', c3P: 'Contact us directly for help with your account or technical issues.',
        c4H: '📞 Quick Help', c4P: 'Get fast support for basic questions and account problems.',
        c5H: '👤 Account Help', c5P: 'Problems with login, registration, or profile? We can help you fix it.',
        c6H: '❓ General Questions', c6P: 'Learn how the platform works and how to find internships easily.',
        faqH: 'Frequently Asked Questions',
        faq1Q: 'How do I apply for an internship?', faq1A: 'You can browse available internships, open a listing, and submit your application with your resume.',
        faq2Q: 'Is InternHub free?', faq2A: 'Yes, InternHub is completely free for students.',
        faq3Q: 'Can I edit my profile later?', faq3A: 'Yes, you can update your profile anytime after logging in.',
        faq4Q: 'How do employers see my CV?', faq4A: 'When you apply for an internship, employers can view your uploaded CV and profile details.'
      },
      cookiePolicy: {
        title: 'Cookie Policy', subtitle: 'Last Updated: March 2026',
        whatH: 'What Are Cookies?', whatP: 'Cookies are small text files stored on your device when you visit a website. They are used to remember information about your session and preferences.',
        weUseH: 'Cookies We Use', weUseP: 'InternHub uses only essential cookies. We do not use advertising, tracking, or analytics cookies.',
        localP: "These values are stored in your browser's localStorage. They are necessary for the platform to function and do not require consent under GDPR (ePrivacy Directive Art. 5(3)).",
        manageH: 'Managing Your Data', manageP: 'You can clear all stored data at any time by:',
        manageL1: 'Logging out of your account', manageL2: 'Clearing localStorage and cookies in your browser settings', manageL3: 'Deleting your account via the "Danger Zone" in your profile',
        contactH: 'Contact', contactP: 'Questions about this policy:',
        thKey: 'Storage Key', thPurpose: 'Purpose', thDuration: 'Duration',
        row1Purpose: 'Remembers that you are logged in', row1Duration: 'Until logout',
        row2Purpose: 'Stores your user ID for session management', row2Duration: 'Until logout',
        row3Purpose: 'Stores your account type (student or company)', row3Duration: 'Until logout',
        row4Purpose: 'Remembers your cookie consent choice', row4Duration: 'Persistent'
      },
      privacyPolicy: { title: 'Privacy Policy', subtitle: 'Last updated: April 2026' },
      termsOfService: { title: 'Terms of Service', subtitle: 'Last Updated: April 2026' }
    }
  },

  fi: {
    nav: {
      internships: 'Harjoittelupaikat',
      loginRegister: 'Kirjaudu / Rekisteröidy',
      profile: 'Profiili',
      logout: 'Kirjaudu ulos',
      adminPanel: 'Hallintapaneeli'
    },
    footer: {
      aboutHeading: 'InternHub-tietoja',
      aboutUs: 'Meistä', team: 'Tiimimme', contact: 'Yhteystiedot',
      studentsHeading: 'Opiskelijoille',
      careerResources: 'Uraresurssit', resumeBuilder: 'CV-työkalu', interviewTips: 'Haastatteluvinkit',
      employersHeading: 'Työnantajille',
      postJob: 'Ilmoita paikka', browseCandidates: 'Selaa hakijoita', support: 'Tuki',
      legalHeading: 'Oikeudellinen',
      privacyPolicy: 'Tietosuojakäytäntö', termsOfService: 'Käyttöehdot', cookiePolicy: 'Evästekäytäntö',
      copyright: '© 2026 InternHub. Kaikki oikeudet pidätetään. | Autamme opiskelijoita löytämään seuraavan mahdollisuutensa'
    },
    hero: {
      title: 'Löydä täydellinen harjoittelupaikkasi',
      subtitle: 'Löydä jännittäviä harjoittelumahdollisuuksia johtavissa yrityksissä ja käynnistä urasi',
      btnBrowse: 'Selaa harjoittelupaikkoja',
      btnPost: 'Ilmoita harjoittelupaikka'
    },
    logoStrip: {
      label: 'Luotettu harjoittelijoiden toimesta johtavissa oppilaitoksissa'
    },
    carousel: {
      step1: 'Vaihe 01', step1Title: 'Hae', step1Desc: 'Selaa satoja paikkoja ja lähetä hakemuksesi minuuteissa',
      step2: 'Vaihe 02', step2Title: 'Haastattelu', step2Desc: 'Ota yhteyttä huippuyrityksiin ja esittele taitosi',
      step3: 'Vaihe 03', step3Title: 'Tule palkatuksi', step3Desc: 'Hanki unelmaharjoittelupaikkasi ja käynnistä urasi'
    },
    cta: {
      label: 'Aloita tänään',
      headline: 'Valmis käynnistämään urasi?',
      description: 'Liity tuhansien opiskelijoiden joukkoon, jotka löytävät hyviä harjoittelupaikkoja InternHubin kautta. Profiilin luominen kestää vain kaksi minuuttia.',
      studentTitle: 'Olen opiskelija', studentDesc: 'Löydä harjoittelupaikka, joka vastaa taitojasi',
      employerTitle: 'Olen työnantaja', employerDesc: 'Ilmoita paikkoja ja löydä hyviä harjoittelijoita',
      signinTitle: 'Kirjaudu sisään', signinDesc: 'Jatka siitä mihin jäit'
    },
    auth: {
      pageTitle: 'Liity InternHubiin', pageSubtitle: 'Aloita harjoittelumatkasi tänään',
      tabLogin: 'Kirjaudu', tabRegister: 'Rekisteröidy',
      loginHeading: 'Tervetuloa takaisin',
      emailLabel: 'Sähköpostiosoite', emailPlaceholder: 'sinä@esimerkki.fi',
      passwordLabel: 'Salasana', passwordPlaceholder: 'Syötä salasanasi',
      rememberMe: 'Muista minut',
      btnSignIn: 'Kirjaudu sisään', forgotPassword: 'Unohditko salasanan?',
      divider: 'tai',
      noAccount: 'Onko sinulla ei tiliä?', signupLink: 'Rekisteröidy tästä',
      registerHeading: 'Luo tilisi',
      roleLabel: 'Olen...', roleStudent: '🎓 Opiskelija', roleEmployer: '💼 Yritys/Työnantaja',
      firstNameLabel: 'Etunimi', firstNamePlaceholder: 'Etunimi',
      lastNameLabel: 'Sukunimi', lastNamePlaceholder: 'Sukunimi',
      eduLevelLabel: 'Koulutustaso', eduLevelPlaceholder: 'Valitse taso...',
      eduUniversity: 'Yliopisto / Ammattikorkeakoulu', eduCollege: 'Ammattikoulu',
      eduHighSchool: 'Lukio / Peruskoulu', eduOther: 'Muu',
      majorLabel: 'Pääaine', majorPlaceholder: 'esim. Tietojenkäsittely',
      jobTitleLabel: 'Toimenkuvasi', jobTitlePlaceholder: 'esim. HR-päällikkö, Rekrytoija',
      companyNameLabel: 'Yrityksen nimi', companyNamePlaceholder: 'Yrityksesi nimi',
      companyWebsiteLabel: 'Yrityksen verkkosivusto', companyWebsitePlaceholder: 'https://www.yrityksesi.fi',
      yTunnusLabel: 'Y-tunnus', yTunnusNote: '(Suomalainen yritystunnus, pakollinen)',
      yTunnusPlaceholder: '123456-7', yTunnusFormat: 'Muoto: 6-7 numeroa - 1 numero',
      passwordRegPlaceholder: 'Vähintään 8 merkkiä',
      passwordRequirements: 'Salasana: min. 8 merkkiä, 2 numeroa (0-9) ja 2 erikoismerkkiä (!!, @# jne.)',
      confirmPasswordLabel: 'Vahvista salasana', confirmPasswordPlaceholder: 'Vahvista salasanasi',
      agreePrefix: 'Hyväksyn', termsLink: 'Käyttöehdot', privacyLink: 'Tietosuojakäytäntö',
      btnCreateAccount: 'Luo tili',
      hasAccount: 'Onko sinulla jo tili?', signinLink: 'Kirjaudu tästä',
      emailConfirmTitle: 'Tarkista sähköpostisi!',
      emailConfirmMsg: 'Lähetimme vahvistuslinkin osoitteeseen',
      emailConfirmNote: 'Klikkaa linkkiä aktivoidaksesi tilisi. Tarkista roskapostikansio, jos et näe viestiä.',
      btnResend: 'Lähetä vahvistussähköposti uudelleen', btnBackSignin: 'Takaisin kirjautumiseen',
      benefitsTitle: 'Miksi liittyä InternHubiin?',
      benefit1Title: 'Tallenna edistymisesi', benefit1Desc: 'Tallenna hakemuksesi ja seuraa edistymistäsi useissa harjoittelumahdollisuuksissa.',
      benefit2Title: 'Hallitse suosikkeja', benefit2Desc: 'Lisää kiinnostavat paikat kirjanmerkkeihin ja järjestä ne listoihin helpoksi pääsyksi.',
      benefit3Title: 'Rakenna profiilisi', benefit3Desc: 'Luo ammatillinen profiili, jonka työnantajat voivat nähdä hakemuksiasi tarkastaessaan.',
      forgotHeading: 'Nollaa salasana', forgotDesc: 'Syötä sähköpostiosoitteesi ja lähetämme sinulle nollauslinkin.',
      forgotEmailPlaceholder: 'sinä@esimerkki.fi', btnSendReset: 'Lähetä nollaslinkki', btnCancel: 'Peruuta'
    },
    internships: {
      positionLabel: 'Tehtävä / Yritys', positionPlaceholder: 'esim. Kehittäjä, Google...',
      locationLabel: 'Sijainti', locationPlaceholder: 'Helsinki, Etätyö...',
      categoryLabel: 'Kategoria', categoryDefault: 'Kaikki kategoriat',
      startLabel: 'Alkaa aikaisintaan', endLabel: 'Päättyy viimeistään',
      favorites: 'Omat suosikit', btnFilter: 'Käytä suodattimia',
      noResultsTitle: 'Harjoittelupaikkoja ei löydy', noResultsDesc: 'Kokeile muuttaa hakusuodattimia'
    },
    detail: {
      backLink: '← Takaisin harjoittelupaikkoihin',
      overviewTitle: 'Työn yleiskatsaus',
      salaryLabel: 'PALKKA', durationLabel: 'KESTO', locationLabel: 'SIJAINTI',
      aboutTitle: 'Meistä', descTitle: 'Kuvaus',
      responsibilitiesTitle: 'Vastuualueet', requirementsTitle: 'Vaatimukset',
      btnApply: 'Hae nyt', btnSave: 'Tallenna paikka',
      companyCardTitle: 'Yritysprofiili',
      emailLabel: 'Sähköposti:', websiteLabel: 'Verkkosivusto:',
      hqLabel: 'Päätoimipaikka:', yTunnusLabel: 'Y-tunnus:',
      applicantsTitle: '📋 Saapuneet hakemukset', applicantsEmpty: 'Ei vielä hakemuksia.',
      applyFormFirstName: 'Etunimi', applyFormLastName: 'Sukunimi',
      applyFormEmail: 'Sähköpostiosoite', applyFormPhone: 'Puhelinnumero',
      applyFormCvTitle: '📄 CV / Ansioluettelo', applyFormCvEmpty: 'CV:tä ei ole vielä ladattu.',
      applyFormCvUpload: 'Lataa eri CV (PDF)',
      applyFormLetterLabel: 'Saatekirje / Miksi meidän pitäisi palkata sinut?',
      applyFormLetterPlaceholder: 'Kirjoita jotain työnantajalle...',
      btnSubmit: 'Lähetä hakemus'
    },
    studentProfile: {
      btnEdit: 'Muokkaa profiilia', btnSave: 'Tallenna', btnCancel: 'Peruuta',
      personalTitle: 'Henkilökohtaiset tiedot',
      firstNameLabel: 'Etunimi', lastNameLabel: 'Sukunimi',
      birthDateLabel: 'Syntymäaika', phoneLabel: 'Puhelin', cityLabel: 'Kaupunki',
      aboutTitle: 'Minusta', aboutPlaceholder: 'Kerro itsestäsi...',
      categoriesTitle: 'Toivotut tehtäväkategoriat', categoriesSearch: 'Hae kategorioita...',
      linksTitle: 'Linkit', btnAddLink: '+ Lisää linkki',
      educationTitle: 'Koulutushistoria', btnAddEducation: '+ Lisää koulutus',
      openToOffers: 'Avoin tarjouksille',
      requestsTitle: 'Harjoittelupyynnöt', btnAddRequest: '+ Lisää',
      cvTitle: '📄 CV / Ansioluettelo', cvEmpty: 'CV:tä ei ole vielä ladattu.', btnUploadCv: 'Lataa CV (PDF)',
      applicationsTitle: '📋 Omat hakemukset', applicationsEmpty: 'Ei vielä hakemuksia.',
      savedTitle: '❤️ Tallennetut harjoittelupaikat', savedEmpty: 'Ei vielä tallennettuja harjoittelupaikkoja.',
      langTitle: '🌐 Käyttöliittymän kieli',
      dangerTitle: '⚠ Vaaravyöhyke',
      dangerDesc: 'Poista tilisi ja kaikki henkilökohtaiset tietosi pysyvästi (GDPR 17 artikla).',
      btnDeleteAccount: 'Poista tilini',
      deleteModalTitle: 'Poista tili',
      deleteModalIntro: 'Tämä poistaa pysyvästi:',
      deleteItem1: 'Profiilisi ja henkilökohtaiset tietosi',
      deleteItem2: 'Kaikki hakemukset',
      deleteItem3: 'Kaikki harjoittelupyynnöt',
      deleteItem4: 'CV:si ja valokuvasi',
      deleteWarning: 'Tätä toimintoa ei voi peruuttaa.',
      deleteConfirmText: 'Kirjoita DELETE vahvistukseksi:',
      deleteInputPlaceholder: 'Kirjoita DELETE',
      btnDeletePermanent: 'Poista pysyvästi'
    },
    companyProfile: {
      btnEdit: 'Muokkaa profiilia', btnSave: 'Tallenna', btnCancel: 'Peruuta',
      aboutTitle: 'Tietoja yrityksestä',
      editTitle: 'Muokkaa yrityksen tietoja',
      nameLabel: 'Yrityksen nimi', emailLabel: 'Yrityksen sähköposti',
      aboutLabel: 'Tietoja yrityksestä', locationLabel: 'Sijainti',
      businessIdLabel: 'Y-tunnus', websiteLabel: 'Verkkosivusto',
      teamTitle: 'Tiimimme', btnAddMember: '➕ Lisää uusi jäsen',
      memberNamePlaceholder: 'Koko nimi', memberTitlePlaceholder: 'Toimenkuva (esim. toimitusjohtaja)',
      memberEmailPlaceholder: 'Sähköpostiosoite', memberPhonePlaceholder: 'Puhelinnumero',
      btnConfirmAdd: 'Vahvista lisäys', teamEmpty: 'Ei tiimin jäseniä.',
      postingsTitle: 'Nykyiset ilmoitukset', postingsEmpty: 'Ei vielä ilmoituksia.',
      postSidebarTitle: 'Ilmoita uusi työ', postSidebarDesc: 'Luo uusi harjoitteluilmoitus.',
      btnPostNew: '➕ Ilmoita uusi paikka',
      postModalTitle: 'Luo uusi harjoittelupaikka',
      postTitleLabel: 'Työnimike *', postDescLabel: 'Kuvaus *',
      postResponLabel: 'Vastuualueet', postReqsLabel: 'Vaatimukset',
      postSalaryLabel: 'Palkka / Korvaus', postStartLabel: 'Aloituspäivä', postEndLabel: 'Lopetuspäivä',
      postOpenEnded: 'Tämä paikka on avoinna toistaiseksi (ei kiinteää päättymispäivää)',
      postCategoryLabel: 'Kategoria *', postCategoryDefault: 'Valitse kategoria...',
      postVisibilityLabel: 'Näkyvyys',
      btnPostSubmit: 'Ilmoita paikka',
      appReviewTitle: 'Tarkista hakemus',
      appPositionLabel: 'Tehtävä:', appApplicantLabel: 'Hakija:',
      appEmailLabel: 'Sähköposti:', appPhoneLabel: 'Puhelin:', appStatusLabel: 'Tila:',
      appLetterLabel: 'Saatekirje', appLetterEmpty: 'Saatekirjettä ei ole toimitettu.',
      appCvLabel: 'CV / Ansioluettelo',
      btnAccept: 'Hyväksy', btnDecline: 'Hylkää', btnViewed: 'Merkitse nähdyksi', btnClose: 'Sulje'
    },
    common: {
      save: 'Tallenna', cancel: 'Peruuta', confirm: 'Vahvista', delete: 'Poista',
      edit: 'Muokkaa', close: 'Sulje', loading: 'Ladataan...', search: 'Hae',
      yes: 'Kyllä', no: 'Ei', or: 'tai', optional: '(valinnainen)'
    },
    pages: {
      aboutUs: {
        title: 'Tietoa InternHubista', subtitle: 'Autamme opiskelijoita löytämään mielekkäitä harjoittelumahdollisuuksia',
        missionH: 'Missiomme', missionP: 'InternHub on opiskelijoiden rakentama projekti, jonka kolme opiskelijaa on luonut yksinkertaisella tavoitteella: auttaa muita opiskelijoita löytämään harjoittelupaikkoja helpommin haastavina aikoina. Haluamme yhdistää opiskelijat yrityksiin, jotka tarjoavat todellisia mahdollisuuksia oppia, kasvaa ja hankkia kokemusta.',
        visionH: 'Visiomme', visionP: 'Rakentaa alusta, jossa jokaisella opiskelijalla on helppo pääsy harjoittelumahdollisuuksiin, jotka tukevat heidän henkilökohtaista ja ammatillista kasvuaan.',
        offerH: 'Mitä tarjoamme', offer1: 'Yksinkertainen harjoittelupaikkojen hakualusta', offer2: 'Uraan valmistautumisen työkalut', offer3: 'Yhteydet yrityksiin', offer4: 'CV- ja haastatteluresurssit', offer5: 'Opiskelijoiden tukijärjestelmä',
        whyH: 'Miksi InternHub?', rel: '🎯 Luotettavat mahdollisuudet', relP: 'Keskitymme jakamaan hyödyllisiä ja relevantteja harjoittelupaikkoilmoituksia.',
        career: '🚀 Uravalmennus', careerP: 'Autamme opiskelijoita hankkimaan taitoja ja valmistautumaan tulevaan uraan.',
        connect: '💼 Todelliset yhteydet', connectP: 'Yhdistämme opiskelijat suoraan yrityksiin ja ammattilaisiin.',
        simple: '📱 Yksinkertainen kokemus', simpleP: 'Alustamme on selkeä, nopea ja helppo käyttää kaikille.'
      },
      team: {
        title: 'Tiimimme', subtitle: 'Olemme 3 opiskelijaa, jotka rakentavat InternHubia auttaakseen muita löytämään harjoittelupaikkoja helpommin',
        meetH: 'Tutustu kehittäjiin',
        m1Role: 'UI/UX-suunnittelija & Frontend-kehittäjä', m1Desc: 'Vastaa käyttöliittymäsuunnittelusta, käyttäjäkokemuksesta ja siitä, että alusta on selkeä, yksinkertainen ja visuaalisesti houkutteleva.',
        m2Role: 'Tietokanta & Backend-kehittäjä', m2Desc: 'Vastaa tietokantarakenteesta, tietojen käsittelystä ja siitä, että alusta toimii sujuvasti ja turvallisesti.',
        m3Role: 'Logiikka & Full-Stack-kehittäjä', m3Desc: 'Työskentelee ydintoiminnallisuuden parissa ja tukee sekä frontend- että backend-kehitystä pitääkseen järjestelmän toimivana.',
        about: 'InternHub on opiskelijaprojekti, jonka ovat luoneet kolme kehittäjää. Yhdistämme suunnittelu-, backend- ja logiikkataitoja rakentaaksemme alustan, joka auttaa opiskelijoita löytämään harjoittelupaikkoja haastavina aikoina.'
      },
      contact: {
        title: 'Ota yhteyttä', subtitle: 'Haluamme kuulla sinulta', getInTouch: 'Ota yhteyttä',
        helpText: 'Onko sinulla kysymyksiä tai palautetta? Olemme täällä auttamassa!',
        nameLabel: 'Koko nimi', emailLabel: 'Sähköposti', subjectLabel: 'Aihe', msgLabel: 'Viesti', btnSend: 'Lähetä viesti',
        contactInfo: 'Yhteystiedot', addressH: '📍 Osoite', emailH: '📧 Sähköposti', phoneH: '📞 Puhelin', hoursH: '⏰ Aukioloajat',
        hoursV: 'Maanantai – Perjantai: 9:00 – 18:00<br>Lauantai – Sunnuntai: Suljettu'
      },
      careerResources: {
        title: 'Uraresurssit', subtitle: 'Kaikki mitä tarvitset menestyäksesi harjoittelumatkallasi',
        c1H: '📝 Ansioluettelon kirjoitusopas', c1P: 'Luo ammattimainen ansioluettelo, joka erottuu työnantajien joukossa.',
        c1L1: 'Käytä selkeää rakennetta ja muotoilua', c1L2: 'Keskity saavutuksiin, ei velvollisuuksiin', c1L3: 'Käytä vahvoja toimintaverbejä', c1L4: 'Pidä se 1 sivuna harjoittelua varten', c1Btn: 'Rakenna CV',
        c2H: '💼 Saatekirjevinkit', c2P: 'Kirjoita henkilökohtaisia saatekirjeitä, jotka lisäävät haastattelumahdollisuuksiasi.',
        c2L1: 'Puhuttele yritystä suoraan', c2L2: 'Osoita motivaatiosi ja sopivuutesi', c2L3: 'Pidä se lyhyenä ja selkeänä', c2L4: 'Vältä yleisiä malleja',
        c3H: '🎯 Urasuunnittelu', c3P: 'Suunnittele urasi polku ja aseta selkeitä tavoitteita tulevaisuudellesi.',
        c3L1: 'Määritä lyhyen aikavälin tavoitteet', c3L2: 'Aseta pitkän aikavälin uravisio', c3L3: 'Seuraa edistymistäsi', c3L4: 'Mukauta kokemuksen perusteella',
        c4H: '🤝 Verkostoituminen', c4P: 'Rakenna yhteyksiä, jotka auttavat sinua löytämään mahdollisuuksia.',
        c4L1: 'Käytä LinkedIniä aktiivisesti', c4L2: 'Osallistu uraalan tapahtumiin', c4L3: 'Ota yhteyttä ammattilaisiin', c4L4: 'Seuraa tapaamisten jälkeen',
        c5H: '📚 Taitojen kehittäminen', c5P: 'Paranna taitoja, joita työnantajat etsivät.',
        c5L1: 'Opi teknisiä työkaluja', c5L2: 'Paranna viestintätaitoja', c5L3: 'Seuraa verkkokursseja', c5L4: 'Työskentele todellisissa projekteissa',
        c6H: '💡 Haastatteluun valmistautuminen', c6P: 'Valmistaudu haastatteluihin ja lisää itseluottamustasi.',
        c6L1: 'Harjoittele yleisiä kysymyksiä', c6L2: 'Tutki yritys', c6L3: 'Valmistele tarinasi', c6L4: 'Kysy hyviä kysymyksiä', c6Btn: 'Näytä vinkit'
      },
      resumeBuilder: {
        title: 'CV-työkalu 🚀', fillInfo: 'Täytä tietosi',
        namePh: 'Koko nimi', emailPh: 'Sähköposti', phonePh: 'Puhelin', educationPh: 'Koulutus', experiencePh: 'Kokemus', skillsPh: 'Taidot',
        downloadBtn: 'Lataa PDF', previewEdu: 'Koulutus', previewExp: 'Kokemus', previewSkills: 'Taidot'
      },
      interviewTips: {
        title: 'Haastatteluvinkit ja -valmistautuminen', subtitle: 'Hallitse harjoitteluhaastattelusi asiantuntijaohjauksella',
        beforeH: 'Ennen haastattelua', duringH: 'Haastattelun aikana', afterH: 'Haastattelun jälkeen',
        b1H: 'Tutki yritys', b1P: 'Opi missiosta, arvoista ja tuotteista ennen haastattelua.',
        b2H: 'Harjoittele kysymyksiä', b2P: 'Valmistele vastauksia, kuten "Kerro itsestäsi".',
        b3H: 'Valmistele tarinoita', b3P: 'Käytä STAR-menetelmää: Tilanne, Tehtävä, Toiminta, Tulos.',
        b4H: 'Harjoitushaastattelut', b4P: 'Harjoittele ystävien tai mentoreiden kanssa.',
        d1H: 'Ensivaikutelma', d1P: 'Ole ajoissa, pukeudu hyvin ja pysy luottavaisena.',
        d2H: 'Viestintä', d2P: 'Kuuntele tarkasti ja vastaa selkeästi.',
        d3H: 'Osoita innostusta', d3P: 'Selitä, miksi haluat tähän tehtävään.',
        d4H: 'Esitä kysymyksiä', d4P: 'Kysy tiimistä ja yrityskulttuurista.',
        a1H: 'Kiitosviesti', a1P: 'Lähetä 24 tunnin sisällä.',
        a2H: 'Itsereflektio', a2P: 'Paranna tulevaa suoritustasi.',
        a3H: 'Seuranta', a3P: 'Tarkista tilanne kohteliaasti tarvittaessa.',
        a4H: 'Neuvottelu', a4P: 'Keskity oppimismahdollisuuksiin ja kasvuun.',
        commonQsH: 'Yleisiä haastattelukysymyksiä',
        q1: 'Kerro itsestäsi', q2: 'Miksi tämä harjoittelu?', q3: 'Vahvuudet ja heikkoudet', q4: 'Kohtaamasi haaste', q5: 'Missä näet itsesi 5 vuoden kuluttua?'
      },
      company: {
        title: 'Harjoittelupaikan julkaiseminen', subtitle: 'Miten rekrytointijärjestelmä toimii InternHubissa',
        h1H: '📌 Miten työpaikan julkaiseminen toimii', h1P: 'InternHubissa yritykset eivät suoraan etsi opiskelijoita. Sen sijaan he luovat harjoittelutarjouksia, joihin opiskelijat voivat hakea.',
        h1L1: 'Yritykset julkaisevat harjoittelumahdollisuuksia', h1L2: 'Opiskelijat selaavat saatavilla olevia työpaikkoja', h1L3: 'Opiskelijat hakevat lähettämällä CV:nsä ja tietonsa', h1L4: 'Yritykset saavat hakemukset vasta opiskelijoiden haettua',
        h2H: '👨‍💼 Mitä yritykset voivat tehdä', h2L1: 'Luoda harjoitteluilmoituksia', h2L2: 'Vastaanottaa opiskelijahakemuksia', h2L3: 'Tarkastella CV:itä ja taitoja', h2L4: 'Ottaa yhteyttä valittuihin ehdokkaisiin',
        h3H: '🔒 Mitä yritykset eivät voi tehdä', h3L1: 'Selata kaikkia opiskelijoita vapaasti', h3L2: 'Nähdä yksityisiä opiskelijaprofiileja', h3L3: 'Käyttää tietoja ilman hakemusta',
        h4H: '⚙️ Järjestelmän logiikka', h4P: 'Järjestelmä perustuu hakemuksiin. Opiskelija hakee ensin, sitten yritys voi nähdä hänen tietonsa hakijalistassa.',
        h5H: '💡 Yhteenveto', h5P: 'InternHub on hakemuspohjainen rekrytointialusta. Yritykset saavat lahjakkuuksia vain opiskelijoiden hakemusten kautta, mikä varmistaa yksityisyyden ja rakenteisen rekrytoinnin.'
      },
      browseCandidates: {
        title: 'Harjoittelupaikat', subtitle: 'Miten harjoittelumahdollisuudet toimivat InternHubissa',
        s1H: '📌 Mitä harjoittelupaikat ovat täällä?', s1P: 'Harjoittelupaikat InternHubissa ovat yritysten luomia mahdollisuuksia. Opiskelijat voivat selata näitä mahdollisuuksia ja hakea suoraan.',
        s2H: '🎓 Miten opiskelijat käyttävät tätä sivua', s2L1: 'Selaa saatavilla olevia harjoitteluilmoituksia', s2L2: 'Lue työnkuvaus ja vaatimukset', s2L3: 'Valitse tehtävä, joka vastaa taitojasi', s2L4: 'Hae lähettämällä CV ja tiedot',
        s3H: '🏢 Miten yritykset käyttävät tätä järjestelmää', s3L1: 'Julkaise harjoittelutarjouksia', s3L2: 'Vastaanota hakemuksia opiskelijoilta', s3L3: 'Tarkastele CV:itä ja taitoja', s3L4: 'Ota yhteyttä valittuihin ehdokkaisiin',
        s4H: '🔄 Miten järjestelmä toimii', s4P: 'InternHub ei ole sosiaalinen alusta ihmisten selaamiseen. Se on hakemuspohjainen järjestelmä:',
        s4L1: 'Yritys luo harjoitteluilmoituksen', s4L2: 'Opiskelija näkee sen tällä sivulla', s4L3: 'Opiskelija hakee', s4L4: 'Yritys vastaanottaa hakemuksen',
        s5H: '🔒 Tärkeä sääntö', s5P: 'Opiskelijoihin ei voi ottaa yhteyttä tai nähdä heitä ennen hakemista. Kaikki vuorovaikutus tapahtuu vasta hakemuksen lähettämisen jälkeen.',
        s6H: '💡 Yhteenveto', s6P: 'Tämä sivu on opiskelijoiden pääsisäänkäynti. Se yhdistää heidät harjoittelumahdollisuuksiin ja käynnistää hakuprosessin.'
      },
      support: {
        title: 'Tukikeskus', subtitle: 'Olemme täällä auttamassa, jos tarvitset apua',
        helpH: 'Miten voimme auttaa sinua?',
        c1H: '📚 Ohjekirja', c1P: 'Löydä vastauksia yleisiin kysymyksiin InternHubin käytöstä ja harjoitteluun hakemisesta.',
        c2H: '💬 Yhteisö', c2P: 'Ota yhteyttä muihin opiskelijoihin ja jaa kokemuksesi.',
        c3H: '📧 Sähköpostituki', c3P: 'Ota meihin yhteyttä suoraan tilisi tai teknisten ongelmien kanssa.',
        c4H: '📞 Pikatuki', c4P: 'Saa nopeaa tukea peruskysymyksiin ja tiliongelmiin.',
        c5H: '👤 Tiliapua', c5P: 'Ongelmia kirjautumisen, rekisteröinnin tai profiilin kanssa? Voimme auttaa sinua ratkaisemaan ne.',
        c6H: '❓ Yleiset kysymykset', c6P: 'Opi, miten alusta toimii ja miten löytää harjoittelupaikkoja helposti.',
        faqH: 'Usein kysytyt kysymykset',
        faq1Q: 'Miten haen harjoittelupaikkaan?', faq1A: 'Voit selata saatavilla olevia harjoittelupaikkoja, avata ilmoituksen ja lähettää hakemuksesi CV:si kanssa.',
        faq2Q: 'Onko InternHub ilmainen?', faq2A: 'Kyllä, InternHub on täysin ilmainen opiskelijoille.',
        faq3Q: 'Voinko muokata profiiliani myöhemmin?', faq3A: 'Kyllä, voit päivittää profiilisi milloin tahansa kirjautumisen jälkeen.',
        faq4Q: 'Miten työnantajat näkevät CV:ni?', faq4A: 'Kun haet harjoittelupaikkaan, työnantajat voivat nähdä ladatun CV:si ja profiilitietosi.'
      },
      cookiePolicy: {
        title: 'Evästekäytäntö', subtitle: 'Päivitetty viimeksi: maaliskuu 2026',
        whatH: 'Mitä evästeet ovat?', whatP: 'Evästeet ovat pieniä tekstitiedostoja, jotka tallennetaan laitteellesi, kun vierailet verkkosivustolla. Niitä käytetään muistamaan tietoja istunnosta ja asetuksistasi.',
        weUseH: 'Käyttämämme evästeet', weUseP: 'InternHub käyttää vain välttämättömiä evästeitä. Emme käytä mainonta-, seuranta- tai analytiikkaevästeitä.',
        localP: 'Nämä arvot on tallennettu selaimen localStorageen. Ne ovat välttämättömiä alustan toimimiseksi eivätkä vaadi suostumusta GDPR:n mukaan (ePrivacy-direktiivin 5(3) artikla).',
        manageH: 'Tietojesi hallinta', manageP: 'Voit tyhjentää kaikki tallennetut tiedot milloin tahansa:',
        manageL1: 'Kirjaudu ulos tililtäsi', manageL2: 'Tyhjennä localStorage ja evästeet selainasetuksista', manageL3: 'Poista tilisi profiilin "Vaara-alue" -osiossa',
        contactH: 'Yhteystiedot', contactP: 'Kysymyksiä tästä käytännöstä:',
        thKey: 'Tallennusavain', thPurpose: 'Tarkoitus', thDuration: 'Kesto',
        row1Purpose: 'Muistaa, että olet kirjautunut sisään', row1Duration: 'Uloskirjautumiseen asti',
        row2Purpose: 'Tallentaa käyttäjätunnuksesi istunnonhallintaa varten', row2Duration: 'Uloskirjautumiseen asti',
        row3Purpose: 'Tallentaa tilityyppiäsi (opiskelija tai yritys)', row3Duration: 'Uloskirjautumiseen asti',
        row4Purpose: 'Muistaa evästeen suostumusvalintasi', row4Duration: 'Pysyvä'
      },
      privacyPolicy: { title: 'Tietosuojakäytäntö', subtitle: 'Päivitetty viimeksi: huhtikuu 2026' },
      termsOfService: { title: 'Käyttöehdot', subtitle: 'Päivitetty viimeksi: huhtikuu 2026' }
    }
  },

  sv: {
    nav: {
      internships: 'Praktikplatser',
      loginRegister: 'Logga in / Registrera',
      profile: 'Profil',
      logout: 'Logga ut',
      adminPanel: 'Adminpanel'
    },
    footer: {
      aboutHeading: 'Om InternHub',
      aboutUs: 'Om oss', team: 'Vårt team', contact: 'Kontakt',
      studentsHeading: 'För studenter',
      careerResources: 'Karriärresurser', resumeBuilder: 'CV-verktyg', interviewTips: 'Intervjutips',
      employersHeading: 'För arbetsgivare',
      postJob: 'Publicera tjänst', browseCandidates: 'Bläddra kandidater', support: 'Support',
      legalHeading: 'Juridiskt',
      privacyPolicy: 'Integritetspolicy', termsOfService: 'Användarvillkor', cookiePolicy: 'Cookiepolicy',
      copyright: '© 2026 InternHub. Alla rättigheter förbehållna. | Hjälper studenter hitta nästa möjlighet'
    },
    hero: {
      title: 'Hitta din perfekta praktikplats',
      subtitle: 'Upptäck spännande praktikplatser hos ledande företag och starta din karriär',
      btnBrowse: 'Bläddra praktikplatser',
      btnPost: 'Publicera praktikplats'
    },
    logoStrip: {
      label: 'Betrodd av praktikanter från ledande utbildningsinstitutioner'
    },
    carousel: {
      step1: 'Steg 01', step1Title: 'Ansök', step1Desc: 'Bläddra bland hundratals tjänster och skicka din ansökan på minuter',
      step2: 'Steg 02', step2Title: 'Intervju', step2Desc: 'Kontakta toppföretag och visa dina färdigheter',
      step3: 'Steg 03', step3Title: 'Bli anställd', step3Desc: 'Få din drömprakt och starta din karriär'
    },
    cta: {
      label: 'Kom igång idag',
      headline: 'Redo att starta din karriär?',
      description: 'Gå med tusentals studenter som redan hittar bra praktikplatser via InternHub. Det tar bara två minuter att skapa din profil.',
      studentTitle: 'Jag är student', studentDesc: 'Hitta praktikplatser som matchar dina färdigheter',
      employerTitle: 'Jag är arbetsgivare', employerDesc: 'Publicera tjänster och hitta bra praktikanter',
      signinTitle: 'Logga in', signinDesc: 'Fortsätt där du slutade'
    },
    auth: {
      pageTitle: 'Gå med i InternHub', pageSubtitle: 'Starta din praktikresa idag',
      tabLogin: 'Logga in', tabRegister: 'Registrera',
      loginHeading: 'Välkommen tillbaka',
      emailLabel: 'E-postadress', emailPlaceholder: 'du@exempel.se',
      passwordLabel: 'Lösenord', passwordPlaceholder: 'Ange ditt lösenord',
      rememberMe: 'Kom ihåg mig',
      btnSignIn: 'Logga in', forgotPassword: 'Glömt lösenordet?',
      divider: 'eller',
      noAccount: 'Har du inget konto?', signupLink: 'Registrera dig här',
      registerHeading: 'Skapa ditt konto',
      roleLabel: 'Jag är...', roleStudent: '🎓 Student', roleEmployer: '💼 Företag/Arbetsgivare',
      firstNameLabel: 'Förnamn', firstNamePlaceholder: 'Förnamn',
      lastNameLabel: 'Efternamn', lastNamePlaceholder: 'Efternamn',
      eduLevelLabel: 'Utbildningsnivå', eduLevelPlaceholder: 'Välj nivå...',
      eduUniversity: 'Universitet / Yrkeshögskola', eduCollege: 'Yrkesskola',
      eduHighSchool: 'Gymnasium / Grundskola', eduOther: 'Annat',
      majorLabel: 'Inriktning', majorPlaceholder: 't.ex. Datavetenskap',
      jobTitleLabel: 'Din jobbtitel', jobTitlePlaceholder: 't.ex. HR-chef, Rekryterare',
      companyNameLabel: 'Företagsnamn', companyNamePlaceholder: 'Ditt företagsnamn',
      companyWebsiteLabel: 'Företagets webbplats', companyWebsitePlaceholder: 'https://www.dittforetag.se',
      yTunnusLabel: 'Y-tunnus', yTunnusNote: '(Finskt företags-ID, obligatoriskt)',
      yTunnusPlaceholder: '123456-7', yTunnusFormat: 'Format: 6-7 siffror - 1 siffra',
      passwordRegPlaceholder: 'Minst 8 tecken',
      passwordRequirements: 'Lösenord: min. 8 tecken, 2 siffror (0-9) och 2 specialtecken (!!, @# etc.)',
      confirmPasswordLabel: 'Bekräfta lösenord', confirmPasswordPlaceholder: 'Bekräfta ditt lösenord',
      agreePrefix: 'Jag godkänner', termsLink: 'Användarvillkoren', privacyLink: 'Integritetspolicyn',
      btnCreateAccount: 'Skapa konto',
      hasAccount: 'Har du redan ett konto?', signinLink: 'Logga in här',
      emailConfirmTitle: 'Kontrollera din e-post!',
      emailConfirmMsg: 'Vi skickade en bekräftelselänk till',
      emailConfirmNote: 'Klicka på länken för att aktivera ditt konto. Kontrollera skräpposten om du inte ser den.',
      btnResend: 'Skicka bekräftelsemejl igen', btnBackSignin: 'Tillbaka till inloggning',
      benefitsTitle: 'Varför gå med i InternHub?',
      benefit1Title: 'Spara dina framsteg', benefit1Desc: 'Spara dina ansökningar och följ dina framsteg i flera praktikplatsmöjligheter.',
      benefit2Title: 'Hantera favoriter', benefit2Desc: 'Bokmärk tjänster du är intresserad av och organisera dem i listor för enkel åtkomst.',
      benefit3Title: 'Bygg din profil', benefit3Desc: 'Skapa en professionell profil som arbetsgivare kan se när de granskar dina ansökningar.',
      forgotHeading: 'Återställ lösenord', forgotDesc: 'Ange din e-postadress så skickar vi en återställningslänk.',
      forgotEmailPlaceholder: 'du@exempel.se', btnSendReset: 'Skicka återställningslänk', btnCancel: 'Avbryt'
    },
    internships: {
      positionLabel: 'Tjänst / Företag', positionPlaceholder: 't.ex. Utvecklare, Google...',
      locationLabel: 'Plats', locationPlaceholder: 'Helsingfors, Distans...',
      categoryLabel: 'Kategori', categoryDefault: 'Alla kategorier',
      startLabel: 'Börjar efter', endLabel: 'Slutar innan',
      favorites: 'Mina favoriter', btnFilter: 'Tillämpa filter',
      noResultsTitle: 'Inga praktikplatser hittades', noResultsDesc: 'Försök justera dina sökfilter'
    },
    detail: {
      backLink: '← Tillbaka till praktikplatser',
      overviewTitle: 'Jobböversikt',
      salaryLabel: 'LÖN', durationLabel: 'VARAKTIGHET', locationLabel: 'PLATS',
      aboutTitle: 'Om oss', descTitle: 'Beskrivning',
      responsibilitiesTitle: 'Ansvarsområden', requirementsTitle: 'Krav',
      btnApply: 'Ansök nu', btnSave: 'Spara tjänst',
      companyCardTitle: 'Företagsprofil',
      emailLabel: 'E-post:', websiteLabel: 'Webbplats:',
      hqLabel: 'Huvudkontor:', yTunnusLabel: 'Y-tunnus:',
      applicantsTitle: '📋 Mottagna ansökningar', applicantsEmpty: 'Inga ansökningar ännu.',
      applyFormFirstName: 'Förnamn', applyFormLastName: 'Efternamn',
      applyFormEmail: 'E-postadress', applyFormPhone: 'Telefonnummer',
      applyFormCvTitle: '📄 CV / Meritförteckning', applyFormCvEmpty: 'Inget CV har laddats upp ännu.',
      applyFormCvUpload: 'Ladda upp annat CV (PDF)',
      applyFormLetterLabel: 'Personligt brev / Varför ska vi anställa dig?',
      applyFormLetterPlaceholder: 'Skriv något till arbetsgivaren...',
      btnSubmit: 'Skicka ansökan'
    },
    studentProfile: {
      btnEdit: 'Redigera profil', btnSave: 'Spara', btnCancel: 'Avbryt',
      personalTitle: 'Personlig information',
      firstNameLabel: 'Förnamn', lastNameLabel: 'Efternamn',
      birthDateLabel: 'Födelsedatum', phoneLabel: 'Telefon', cityLabel: 'Stad',
      aboutTitle: 'Om mig', aboutPlaceholder: 'Berätta om dig själv...',
      categoriesTitle: 'Önskade jobbkategorier', categoriesSearch: 'Sök kategorier...',
      linksTitle: 'Länkar', btnAddLink: '+ Lägg till länk',
      educationTitle: 'Utbildningshistorik', btnAddEducation: '+ Lägg till utbildning',
      openToOffers: 'Öppen för erbjudanden',
      requestsTitle: 'Praktikförfrågningar', btnAddRequest: '+ Lägg till',
      cvTitle: '📄 CV / Meritförteckning', cvEmpty: 'Inget CV har laddats upp ännu.', btnUploadCv: 'Ladda upp CV (PDF)',
      applicationsTitle: '📋 Mina ansökningar', applicationsEmpty: 'Inga ansökningar ännu.',
      savedTitle: '❤️ Sparade praktikplatser', savedEmpty: 'Inga sparade praktikplatser ännu.',
      langTitle: '🌐 Gränssnittsspråk',
      dangerTitle: '⚠ Farozon',
      dangerDesc: 'Ta bort ditt konto och all personlig data permanent (GDPR Art. 17).',
      btnDeleteAccount: 'Ta bort mitt konto',
      deleteModalTitle: 'Ta bort konto',
      deleteModalIntro: 'Detta kommer permanent att ta bort:',
      deleteItem1: 'Din profil och personliga data',
      deleteItem2: 'Alla ansökningar',
      deleteItem3: 'Alla praktikförfrågningar',
      deleteItem4: 'Ditt CV och foto',
      deleteWarning: 'Denna åtgärd kan inte ångras.',
      deleteConfirmText: 'Skriv DELETE för att bekräfta:',
      deleteInputPlaceholder: 'Skriv DELETE',
      btnDeletePermanent: 'Ta bort permanent'
    },
    companyProfile: {
      btnEdit: 'Redigera profil', btnSave: 'Spara', btnCancel: 'Avbryt',
      aboutTitle: 'Om företaget',
      editTitle: 'Redigera företagsinformation',
      nameLabel: 'Företagsnamn', emailLabel: 'Företagets e-post',
      aboutLabel: 'Om företaget', locationLabel: 'Plats',
      businessIdLabel: 'Y-tunnus', websiteLabel: 'Webbplats',
      teamTitle: 'Vårt team', btnAddMember: '➕ Lägg till ny medlem',
      memberNamePlaceholder: 'Fullständigt namn', memberTitlePlaceholder: 'Jobbtitel (t.ex. VD)',
      memberEmailPlaceholder: 'E-postadress', memberPhonePlaceholder: 'Telefonnummer',
      btnConfirmAdd: 'Bekräfta tillägg', teamEmpty: 'Inga teammedlemmar listade.',
      postingsTitle: 'Aktuella annonser', postingsEmpty: 'Inga annonser ännu.',
      postSidebarTitle: 'Publicera nytt jobb', postSidebarDesc: 'Skapa en ny praktikannons.',
      btnPostNew: '➕ Publicera ny tjänst',
      postModalTitle: 'Skapa ny praktikplats',
      postTitleLabel: 'Jobbtitel *', postDescLabel: 'Beskrivning *',
      postResponLabel: 'Ansvarsområden', postReqsLabel: 'Krav',
      postSalaryLabel: 'Lön / Ersättning', postStartLabel: 'Startdatum', postEndLabel: 'Slutdatum',
      postOpenEnded: 'Denna tjänst är tillsvidare (inget fast slutdatum)',
      postCategoryLabel: 'Kategori *', postCategoryDefault: 'Välj en kategori...',
      postVisibilityLabel: 'Synlighet',
      btnPostSubmit: 'Publicera tjänst',
      appReviewTitle: 'Granska ansökan',
      appPositionLabel: 'Tjänst:', appApplicantLabel: 'Sökande:',
      appEmailLabel: 'E-post:', appPhoneLabel: 'Telefon:', appStatusLabel: 'Status:',
      appLetterLabel: 'Personligt brev', appLetterEmpty: 'Inget personligt brev bifogat.',
      appCvLabel: 'CV / Meritförteckning',
      btnAccept: 'Acceptera', btnDecline: 'Avböj', btnViewed: 'Markera som sedd', btnClose: 'Stäng'
    },
    common: {
      save: 'Spara', cancel: 'Avbryt', confirm: 'Bekräfta', delete: 'Ta bort',
      edit: 'Redigera', close: 'Stäng', loading: 'Laddar...', search: 'Sök',
      yes: 'Ja', no: 'Nej', or: 'eller', optional: '(valfritt)'
    },
    pages: {
      aboutUs: {
        title: 'Om InternHub', subtitle: 'Vi hjälper studenter att hitta meningsfulla praktikplatser',
        missionH: 'Vår mission', missionP: 'InternHub är ett studentbyggt projekt skapat av tre studenter med ett enkelt mål: att hjälpa andra studenter att hitta praktikplatser lättare under utmanande tider. Vi strävar efter att koppla samman studenter med företag som erbjuder verkliga möjligheter att lära, växa och skaffa erfarenhet.',
        visionH: 'Vår vision', visionP: 'Att bygga en plattform där varje student enkelt kan komma åt praktikplatser som stödjer deras personliga och professionella tillväxt.',
        offerH: 'Vad vi erbjuder', offer1: 'Enkel sökplattform för praktikplatser', offer2: 'Karriärförberedande verktyg', offer3: 'Kontakter med företag', offer4: 'CV- och intervjuresurser', offer5: 'Studentstödssystem',
        whyH: 'Varför InternHub?', rel: '🎯 Pålitliga möjligheter', relP: 'Vi fokuserar på att dela användbara och relevanta praktikplatsannonser.',
        career: '🚀 Karriärutveckling', careerP: 'Vi hjälper studenter att skaffa kompetens och förbereda sig för sin framtida karriär.',
        connect: '💼 Verkliga kontakter', connectP: 'Vi kopplar samman studenter direkt med företag och yrkespersoner.',
        simple: '📱 Enkel upplevelse', simpleP: 'Vår plattform är ren, snabb och lätt att använda för alla.'
      },
      team: {
        title: 'Vårt team', subtitle: 'Vi är 3 studenter som bygger InternHub för att hjälpa andra hitta praktikplatser lättare',
        meetH: 'Möt utvecklarna',
        m1Role: 'UI/UX-designer & Frontend-utvecklare', m1Desc: 'Fokuserar på användargränssnittsdesign, användarupplevelse och att göra plattformen ren, enkel och visuellt tilltalande.',
        m2Role: 'Databas & Backend-utvecklare', m2Desc: 'Ansvarar för databasstruktur, datahantering och att säkerställa att plattformen fungerar smidigt och säkert.',
        m3Role: 'Logik & Full-Stack-utvecklare', m3Desc: 'Arbetar med kärnlogik, funktionalitet och stödjer både frontend- och backend-utveckling för att hålla systemet fungerande.',
        about: 'InternHub är ett studentprojekt skapat av tre utvecklare. Vi kombinerar design-, backend- och logikkunskaper för att bygga en plattform som hjälper studenter hitta praktikplatser under utmanande tider.'
      },
      contact: {
        title: 'Kontakta oss', subtitle: 'Vi vill gärna höra från dig', getInTouch: 'Kom i kontakt',
        helpText: 'Har du frågor eller feedback? Vi är här för att hjälpa!',
        nameLabel: 'Fullständigt namn', emailLabel: 'E-post', subjectLabel: 'Ämne', msgLabel: 'Meddelande', btnSend: 'Skicka meddelande',
        contactInfo: 'Kontaktinformation', addressH: '📍 Adress', emailH: '📧 E-post', phoneH: '📞 Telefon', hoursH: '⏰ Öppettider',
        hoursV: 'Måndag – Fredag: 9:00 – 18:00<br>Lördag – Söndag: Stängt'
      },
      careerResources: {
        title: 'Karriärresurser', subtitle: 'Allt du behöver för att lyckas med din praktikresa',
        c1H: '📝 CV-skrivguide', c1P: 'Skapa ett professionellt CV som sticker ut hos arbetsgivare.',
        c1L1: 'Använd tydlig struktur och formatering', c1L2: 'Fokusera på prestationer, inte arbetsuppgifter', c1L3: 'Använd starka handlingsverb', c1L4: 'Håll det på 1 sida för praktik', c1Btn: 'Bygg CV',
        c2H: '💼 Personliga brevtips', c2P: 'Skriv personliga brev som ökar dina chanser att få intervjuer.',
        c2L1: 'Rikta dig direkt till företaget', c2L2: 'Visa motivation och lämplighet', c2L3: 'Håll det kort och tydligt', c2L4: 'Undvik generiska mallar',
        c3H: '🎯 Karriärplanering', c3P: 'Planera din karriärväg och sätt tydliga mål för din framtid.',
        c3L1: 'Definiera kortsiktiga mål', c3L2: 'Sätt en långsiktig karriärvision', c3L3: 'Följ upp dina framsteg', c3L4: 'Anpassa baserat på erfarenhet',
        c4H: '🤝 Nätverkande', c4P: 'Bygg kontakter som hjälper dig att hitta möjligheter.',
        c4L1: 'Använd LinkedIn aktivt', c4L2: 'Delta i karriärevenemang', c4L3: 'Kontakta yrkespersoner', c4L4: 'Följ upp efter möten',
        c5H: '📚 Kompetensutveckling', c5P: 'Förbättra de färdigheter arbetsgivare söker.',
        c5L1: 'Lär dig tekniska verktyg', c5L2: 'Förbättra kommunikationsfärdigheter', c5L3: 'Ta onlinekurser', c5L4: 'Arbeta med verkliga projekt',
        c6H: '💡 Intervjuförberedelse', c6P: 'Förbered dig för intervjuer och öka ditt självförtroende.',
        c6L1: 'Öva på vanliga frågor', c6L2: 'Undersök företaget', c6L3: 'Förbered din berättelse', c6L4: 'Ställ bra frågor', c6Btn: 'Visa tips'
      },
      resumeBuilder: {
        title: 'CV-verktyg 🚀', fillInfo: 'Fyll i din information',
        namePh: 'Fullständigt namn', emailPh: 'E-post', phonePh: 'Telefon', educationPh: 'Utbildning', experiencePh: 'Erfarenhet', skillsPh: 'Färdigheter',
        downloadBtn: 'Ladda ner PDF', previewEdu: 'Utbildning', previewExp: 'Erfarenhet', previewSkills: 'Färdigheter'
      },
      interviewTips: {
        title: 'Intervjutips & Förberedelse', subtitle: 'Bemästra dina praktikintervjuer med expertvägledning',
        beforeH: 'Före intervjun', duringH: 'Under intervjun', afterH: 'Efter intervjun',
        b1H: 'Undersök företaget', b1P: 'Lär dig om mission, värderingar och produkter före intervjun.',
        b2H: 'Öva på frågor', b2P: 'Förbered svar som "Berätta om dig själv".',
        b3H: 'Förbered berättelser', b3P: 'Använd STAR-metoden: Situation, Uppgift, Åtgärd, Resultat.',
        b4H: 'Övningsintervjuer', b4P: 'Öva med vänner eller mentorer.',
        d1H: 'Första intrycket', d1P: 'Var i tid, klä dig bra och håll dig säker.',
        d2H: 'Kommunikation', d2P: 'Lyssna noga och svara tydligt.',
        d3H: 'Visa entusiasm', d3P: 'Förklara varför du vill ha den här rollen.',
        d4H: 'Ställ frågor', d4P: 'Fråga om teamet och företagskulturen.',
        a1H: 'Tackmejl', a1P: 'Skicka inom 24 timmar.',
        a2H: 'Självutvärdering', a2P: 'Förbättra din framtida prestation.',
        a3H: 'Uppföljning', a3P: 'Kolla statusen artigt vid behov.',
        a4H: 'Förhandling', a4P: 'Fokusera på lärandemöjligheter och tillväxt.',
        commonQsH: 'Vanliga intervjufrågor',
        q1: 'Berätta om dig själv', q2: 'Varför den här praktiken?', q3: 'Styrkor och svagheter', q4: 'En utmaning du mött', q5: 'Var ser du dig själv om 5 år?'
      },
      company: {
        title: 'Information om att publicera praktik', subtitle: 'Hur rekryteringssystemet fungerar på InternHub',
        h1H: '📌 Hur publicering av jobb fungerar', h1P: 'På InternHub söker företag inte direkt efter studenter. Istället skapar de praktikplatserbjudanden som studenter kan ansöka till.',
        h1L1: 'Företag publicerar praktikplatsmöjligheter', h1L2: 'Studenter bläddrar bland tillgängliga jobb', h1L3: 'Studenter ansöker genom att skicka sitt CV och uppgifter', h1L4: 'Företag mottar ansökningar först efter att studenter ansökt',
        h2H: '👨‍💼 Vad företag kan göra', h2L1: 'Skapa praktikplatsannonser', h2L2: 'Ta emot studentansökningar', h2L3: 'Granska CV:n och kompetenser', h2L4: 'Kontakta utvalda kandidater',
        h3H: '🔒 Vad företag inte kan göra', h3L1: 'Bläddra bland alla studenter fritt', h3L2: 'Se privata studentprofiler', h3L3: 'Komma åt data utan ansökan',
        h4H: '⚙️ Systemlogik', h4P: 'Systemet är baserat på ansökningar. En student ansöker först, sedan kan företaget se deras information i ansökningslistan.',
        h5H: '💡 Sammanfattning', h5P: 'InternHub är en ansökningsbaserad rekryteringsplattform. Företag tar emot talanger endast genom studentansökningar, vilket säkerställer integritet och strukturerad rekrytering.'
      },
      browseCandidates: {
        title: 'Praktikplatser', subtitle: 'Hur praktikplatsmöjligheter fungerar på InternHub',
        s1H: '📌 Vad är praktikplatser här?', s1P: 'Praktikplatser på InternHub är möjligheter skapade av företag. Studenter kan bläddra bland dessa möjligheter och ansöka direkt.',
        s2H: '🎓 Hur studenter använder den här sidan', s2L1: 'Bläddra bland tillgängliga praktikplatsannonser', s2L2: 'Läs jobbeskrivning och krav', s2L3: 'Välj en tjänst som matchar dina kompetenser', s2L4: 'Ansök genom att skicka CV och uppgifter',
        s3H: '🏢 Hur företag använder det här systemet', s3L1: 'Publicera praktikplatserbjudanden', s3L2: 'Ta emot ansökningar från studenter', s3L3: 'Granska CV:n och kompetenser', s3L4: 'Kontakta utvalda kandidater',
        s4H: '🔄 Hur systemet fungerar', s4P: 'InternHub är inte en social plattform för att bläddra bland människor. Det är ett ansökningsbaserat system:',
        s4L1: 'Företag skapar praktikplatsannons', s4L2: 'Student ser den på den här sidan', s4L3: 'Student ansöker', s4L4: 'Företag mottar ansökan',
        s5H: '🔒 Viktig regel', s5P: 'Studenter kan inte kontaktas eller ses innan de ansöker. All interaktion sker endast efter att en ansökan har skickats in.',
        s6H: '💡 Sammanfattning', s6P: 'Den här sidan är studenters huvudingång. Den kopplar dem till praktikplatsmöjligheter och startar ansökningsprocessen.'
      },
      support: {
        title: 'Supportcenter', subtitle: 'Vi är här för att hjälpa dig om du behöver stöd',
        helpH: 'Hur kan vi hjälpa dig?',
        c1H: '📚 Hjälpguide', c1P: 'Hitta svar på vanliga frågor om att använda InternHub och ansöka om praktikplatser.',
        c2H: '💬 Community', c2P: 'Kontakta andra studenter och dela din erfarenhet.',
        c3H: '📧 E-postsupport', c3P: 'Kontakta oss direkt för hjälp med ditt konto eller tekniska problem.',
        c4H: '📞 Snabbhjälp', c4P: 'Få snabb support för grundläggande frågor och kontoproblem.',
        c5H: '👤 Kontohjälp', c5P: 'Problem med inloggning, registrering eller profil? Vi kan hjälpa dig lösa det.',
        c6H: '❓ Allmänna frågor', c6P: 'Lär dig hur plattformen fungerar och hur du hittar praktikplatser enkelt.',
        faqH: 'Vanliga frågor',
        faq1Q: 'Hur ansöker jag om en praktikplats?', faq1A: 'Du kan bläddra bland tillgängliga praktikplatser, öppna en annons och skicka din ansökan med ditt CV.',
        faq2Q: 'Är InternHub gratis?', faq2A: 'Ja, InternHub är helt gratis för studenter.',
        faq3Q: 'Kan jag redigera min profil senare?', faq3A: 'Ja, du kan uppdatera din profil när som helst efter inloggning.',
        faq4Q: 'Hur ser arbetsgivare mitt CV?', faq4A: 'När du ansöker om en praktikplats kan arbetsgivare se ditt uppladdade CV och profiluppgifter.'
      },
      cookiePolicy: {
        title: 'Cookiepolicy', subtitle: 'Senast uppdaterad: mars 2026',
        whatH: 'Vad är cookies?', whatP: 'Cookies är små textfiler som lagras på din enhet när du besöker en webbplats. De används för att komma ihåg information om din session och dina preferenser.',
        weUseH: 'Cookies vi använder', weUseP: 'InternHub använder endast nödvändiga cookies. Vi använder inte reklam-, spårnings- eller analyticscookies.',
        localP: 'Dessa värden lagras i din webbläsares localStorage. De är nödvändiga för att plattformen ska fungera och kräver inte samtycke under GDPR (ePrivacy-direktivet Art. 5(3)).',
        manageH: 'Hantera dina uppgifter', manageP: 'Du kan rensa alla lagrade data när som helst genom att:',
        manageL1: 'Logga ut från ditt konto', manageL2: 'Rensa localStorage och cookies i dina webbläsarinställningar', manageL3: 'Ta bort ditt konto via "Farliga zonen" i din profil',
        contactH: 'Kontakt', contactP: 'Frågor om denna policy:',
        thKey: 'Lagringsnyckel', thPurpose: 'Syfte', thDuration: 'Varaktighet',
        row1Purpose: 'Kommer ihåg att du är inloggad', row1Duration: 'Tills utloggning',
        row2Purpose: 'Lagrar ditt användar-ID för sessionshantering', row2Duration: 'Tills utloggning',
        row3Purpose: 'Lagrar din kontotyp (student eller företag)', row3Duration: 'Tills utloggning',
        row4Purpose: 'Kommer ihåg ditt cookiesamtyckesval', row4Duration: 'Permanent'
      },
      privacyPolicy: { title: 'Integritetspolicy', subtitle: 'Senast uppdaterad: april 2026' },
      termsOfService: { title: 'Användarvillkor', subtitle: 'Senast uppdaterad: april 2026' }
    }
  }
};

function t(key) {
  const lang = localStorage.getItem('lang') || 'en';
  const keys = key.split('.');
  let result = (TRANSLATIONS[lang] || TRANSLATIONS.en);
  for (const k of keys) result = result?.[k];
  if (result !== undefined) return result;
  let fallback = TRANSLATIONS.en;
  for (const k of keys) fallback = fallback?.[k];
  return fallback ?? key;
}

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.querySelectorAll('.lang-switcher.open').forEach(el => el.classList.remove('open'));
  applyTranslations();
}

function toggleLangDropdown(e) {
  e.stopPropagation();
  const switcher = e.currentTarget.closest('.lang-switcher');
  const isOpen = switcher.classList.contains('open');
  document.querySelectorAll('.lang-switcher.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) switcher.classList.add('open');
}

function applyTranslations() {
  const lang = localStorage.getItem('lang') || 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t(el.dataset.i18n);
    if (val) el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = t(el.dataset.i18nPlaceholder);
    if (val) el.placeholder = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = t(el.dataset.i18nHtml);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('.lang-current').forEach(el => {
    el.textContent = lang.toUpperCase();
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', applyTranslations);
document.addEventListener('click', () => {
  document.querySelectorAll('.lang-switcher.open').forEach(el => el.classList.remove('open'));
});
