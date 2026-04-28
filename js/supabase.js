/* ==========================================================
   supabase.js — Supabase client initialisation
   Supabase-asiakasyhteyden alustus koko sovellukselle
   ========================================================== */

// EN: Project URL pointing to the hosted Supabase instance.
//     All database and storage requests are sent to this endpoint.
// FI: Projektin URL, joka osoittaa isännöityyn Supabase-instanssiin.
//     Kaikki tietokanta- ja tallennuspyynnöt lähetään tähän osoitteeseen.
const SUPABASE_URL = 'https://nfrmrpfdfbscplqgwrtx.supabase.co';

// EN: Public anonymous key — safe to expose in browser code.
//     It grants read-only / unauthenticated access defined by RLS policies.
//     Never use the service_role key on the client side.
// FI: Julkinen anonyymi avain — turvallinen käyttää selainpuolella.
//     Se myöntää vain lukuoikeuden tai tunnistamattoman pääsyn RLS-käytäntöjen mukaisesti.
//     Älä koskaan käytä service_role-avainta asiakaspuolella.
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcm1ycGZkZmJzY3BscWd3cnR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzQ2NjUsImV4cCI6MjA4OTkxMDY2NX0.XuqjqwOYquTBFINueaPYc7hGXEWlDylqw5CK6xHtCHY';

/**
 * EN: Creates and exports the global Supabase client used by every other JS
 *     file in the project. It must be loaded before any file that calls
 *     supabaseClient.from(...) or supabaseClient.auth.*
 * FI: Luo ja vie globaalin Supabase-asiakkaan, jota kaikki muut JS-tiedostot
 *     käyttävät. Tämä tiedosto täytyy ladata ennen mitään tiedostoa, joka
 *     kutsuu supabaseClient.from(...) tai supabaseClient.auth.*
 */
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
