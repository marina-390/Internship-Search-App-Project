/* ==========================================
   SUPABASE CLIENT
   ========================================== */

const SUPABASE_URL = 'https://nfrmrpfdfbscplqgwrtx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcm1ycGZkZmJzY3BscWd3cnR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzQ2NjUsImV4cCI6MjA4OTkxMDY2NX0.XuqjqwOYquTBFINueaPYc7hGXEWlDylqw5CK6xHtCHY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
