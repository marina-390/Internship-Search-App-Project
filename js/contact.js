(function () {
  emailjs.init('sEPTKkb6HZBc_Qopf');
})();

async function handleContactForm(event) {
  event.preventDefault();

  if (typeof supabaseClient === 'undefined') {
    alert('Error: Supabase is not connected. Check your file paths!');
    return;
  }

  const formData = new FormData(event.target);
  const contactData = {
    name:    formData.get('name'),
    email:   formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  try {
    const { data, error: dbError } = await supabaseClient
      .from('contact_messages')
      .insert([contactData])
      .select();

    if (dbError) throw dbError;

    await emailjs.send('service_q4hp8tj', 'template_vq3sxru', {
      to_email:   'internhub88@gmail.com',
      from_name:  contactData.name,
      from_email: contactData.email,
      subject:    `[CONTACT FORM] ${contactData.subject}`,
      message:    contactData.message,
    });

    showToast('Message saved and sent to Admin!', 'success');
    event.target.reset();
  } catch (err) {
    console.error('Submission Error:', err);
    showToast('Failed to send: ' + err.message, 'error');
  }
}
