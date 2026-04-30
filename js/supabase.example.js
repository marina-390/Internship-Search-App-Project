/* ==========================================================
   supabase.example.js — Template for Supabase client setup
   Copy this file to supabase.js and fill in your project credentials.
   supabase.js is listed in .gitignore and will not be committed.
   ========================================================== */

const SUPABASE_URL      = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
