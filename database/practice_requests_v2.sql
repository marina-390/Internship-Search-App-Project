-- Add optional company fields to practice requests
ALTER TABLE student_practice_requests
  ADD COLUMN IF NOT EXISTS found_company_id   INTEGER REFERENCES "Companies"(company_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS found_company_name VARCHAR(255);
