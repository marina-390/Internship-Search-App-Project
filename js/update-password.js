async function updatePassword() {
  const pass1 = document.getElementById('newPassword').value;
  const pass2 = document.getElementById('confirmPassword').value;

  if (pass1.length < 8) {
    showError('Password must be at least 8 characters.');
    return;
  }
  if (pass1 !== pass2) {
    showError('Passwords do not match!');
    return;
  }

  try {
    const { data, error: authError } = await supabaseClient.auth.updateUser({ password: pass1 });
    if (authError) throw authError;

    const userEmail = data.user.email;
    const salt = dcodeIO.bcrypt.genSaltSync(10);
    const hashedPassword = dcodeIO.bcrypt.hashSync(pass1, salt);

    const { error: dbError } = await supabaseClient
      .from('Users')
      .update({ user_password: hashedPassword })
      .eq('user_login', userEmail);

    if (dbError) throw dbError;

    showToast('Password updated successfully!', 'success');
    await supabaseClient.auth.signOut();
    setTimeout(() => window.location.replace('auth.html'), 1500);

  } catch (error) {
    console.error('Error:', error.message);
    showError(error.message);
  }
}
