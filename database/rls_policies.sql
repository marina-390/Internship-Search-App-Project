-- ============================================================
-- RLS Policies for InternHub
-- Run this in Supabase SQL Editor
--
-- Logic:
--   authenticated = user has Supabase Auth session (new users / after login)
--   anon          = fallback for old accounts without auth.users entry
--
-- Each table gets:
--   1. A role-based policy for authenticated users
--   2. An anon fallback (remove later once all users have auth accounts)
-- ============================================================


-- Helper: reusable inline check — is the current user a student?
-- (used in multiple policies below)


-- ============================================================
-- student_categories
-- ============================================================
CREATE POLICY "auth_student_own_categories" ON student_categories
FOR ALL TO authenticated
USING (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
)
WITH CHECK (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
);

CREATE POLICY "anon_student_categories" ON student_categories
FOR ALL TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- student_profiles
-- ============================================================
-- All users can read (companies browse candidates)
CREATE POLICY "auth_read_student_profiles" ON student_profiles
FOR SELECT TO authenticated USING (true);

CREATE POLICY "anon_read_student_profiles" ON student_profiles
FOR SELECT TO anon USING (true);

-- Only the owner student can update their own profile
CREATE POLICY "auth_student_update_own_profile" ON student_profiles
FOR UPDATE TO authenticated
USING (
  user_id IN (
    SELECT user_id FROM "Users"
    WHERE user_login = auth.email() AND role = 1
  )
)
WITH CHECK (
  user_id IN (
    SELECT user_id FROM "Users"
    WHERE user_login = auth.email() AND role = 1
  )
);

-- Insert handled during registration (anon at that point)
CREATE POLICY "anon_insert_student_profiles" ON student_profiles
FOR INSERT TO anon WITH CHECK (true);

-- Anon update fallback for old users
CREATE POLICY "anon_update_student_profiles" ON student_profiles
FOR UPDATE TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- Student_links
-- ============================================================
CREATE POLICY "auth_student_own_links" ON "Student_links"
FOR ALL TO authenticated
USING (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
)
WITH CHECK (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
);

CREATE POLICY "anon_student_links" ON "Student_links"
FOR ALL TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- positions
-- ============================================================
-- Everyone can read positions
CREATE POLICY "auth_read_positions" ON positions
FOR SELECT TO authenticated USING (true);

CREATE POLICY "anon_read_positions" ON positions
FOR SELECT TO anon USING (true);

-- Only the owning company can insert/update/delete
CREATE POLICY "auth_company_own_positions" ON positions
FOR ALL TO authenticated
USING (
  company_id IN (
    SELECT c.company_id FROM "Companies" c
    JOIN "Users" u ON u.user_id = c.user_id
    WHERE u.user_login = auth.email() AND u.role = 2
  )
)
WITH CHECK (
  company_id IN (
    SELECT c.company_id FROM "Companies" c
    JOIN "Users" u ON u.user_id = c.user_id
    WHERE u.user_login = auth.email() AND u.role = 2
  )
);

CREATE POLICY "anon_write_positions" ON positions
FOR ALL TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- Companies
-- ============================================================
-- Everyone can read companies
CREATE POLICY "auth_read_companies" ON "Companies"
FOR SELECT TO authenticated USING (true);

CREATE POLICY "anon_read_companies" ON "Companies"
FOR SELECT TO anon USING (true);

-- Only the owning user can update their company
CREATE POLICY "auth_company_own_update" ON "Companies"
FOR UPDATE TO authenticated
USING (
  user_id IN (
    SELECT user_id FROM "Users"
    WHERE user_login = auth.email() AND role = 2
  )
)
WITH CHECK (
  user_id IN (
    SELECT user_id FROM "Users"
    WHERE user_login = auth.email() AND role = 2
  )
);

-- Insert during registration (anon)
CREATE POLICY "anon_insert_companies" ON "Companies"
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_companies" ON "Companies"
FOR UPDATE TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- company_team
-- ============================================================
CREATE POLICY "auth_company_own_team" ON company_team
FOR ALL TO authenticated
USING (
  company_id IN (
    SELECT c.company_id FROM "Companies" c
    JOIN "Users" u ON u.user_id = c.user_id
    WHERE u.user_login = auth.email() AND u.role = 2
  )
)
WITH CHECK (
  company_id IN (
    SELECT c.company_id FROM "Companies" c
    JOIN "Users" u ON u.user_id = c.user_id
    WHERE u.user_login = auth.email() AND u.role = 2
  )
);

CREATE POLICY "anon_company_team" ON company_team
FOR ALL TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- applications
-- ============================================================
-- Students can insert and manage their own applications
CREATE POLICY "auth_student_own_applications" ON applications
FOR ALL TO authenticated
USING (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
)
WITH CHECK (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
);

-- Companies can read and update applications for their positions
CREATE POLICY "auth_company_see_applications" ON applications
FOR SELECT TO authenticated
USING (
  position_id IN (
    SELECT p.position_id FROM positions p
    JOIN "Companies" c ON c.company_id = p.company_id
    JOIN "Users" u ON u.user_id = c.user_id
    WHERE u.user_login = auth.email() AND u.role = 2
  )
);

CREATE POLICY "auth_company_update_applications" ON applications
FOR UPDATE TO authenticated
USING (
  position_id IN (
    SELECT p.position_id FROM positions p
    JOIN "Companies" c ON c.company_id = p.company_id
    JOIN "Users" u ON u.user_id = c.user_id
    WHERE u.user_login = auth.email() AND u.role = 2
  )
)
WITH CHECK (
  position_id IN (
    SELECT p.position_id FROM positions p
    JOIN "Companies" c ON c.company_id = p.company_id
    JOIN "Users" u ON u.user_id = c.user_id
    WHERE u.user_login = auth.email() AND u.role = 2
  )
);

CREATE POLICY "anon_applications" ON applications
FOR ALL TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- student_practice_requests
-- ============================================================
CREATE POLICY "auth_student_own_practice_requests" ON student_practice_requests
FOR ALL TO authenticated
USING (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
)
WITH CHECK (
  student_id IN (
    SELECT sp.id FROM student_profiles sp
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
);

CREATE POLICY "anon_practice_requests" ON student_practice_requests
FOR ALL TO anon USING (true) WITH CHECK (true);


-- ============================================================
-- student_request_categories
-- ============================================================
CREATE POLICY "auth_student_own_request_categories" ON student_request_categories
FOR ALL TO authenticated
USING (
  request_id IN (
    SELECT pr.request_id FROM student_practice_requests pr
    JOIN student_profiles sp ON sp.id = pr.student_id
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
)
WITH CHECK (
  request_id IN (
    SELECT pr.request_id FROM student_practice_requests pr
    JOIN student_profiles sp ON sp.id = pr.student_id
    JOIN "Users" u ON u.user_id = sp.user_id
    WHERE u.user_login = auth.email() AND u.role = 1
  )
);

CREATE POLICY "anon_request_categories" ON student_request_categories
FOR ALL TO anon USING (true) WITH CHECK (true);
