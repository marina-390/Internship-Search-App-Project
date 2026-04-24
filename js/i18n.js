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
