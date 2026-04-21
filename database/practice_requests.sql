-- ============================================================
-- 12. Запросы студентов на практику
-- ============================================================
CREATE TABLE IF NOT EXISTS student_practice_requests (
    request_id   SERIAL PRIMARY KEY,
    student_id   INTEGER NOT NULL
                     REFERENCES student_profiles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end   DATE NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'searching'
                     CHECK (status IN ('searching', 'found')),
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 13. Связь: запрос на практику <-> желаемые должности
-- ============================================================
CREATE TABLE IF NOT EXISTS student_request_categories (
    id          SERIAL PRIMARY KEY,
    request_id  INTEGER NOT NULL
                    REFERENCES student_practice_requests(request_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL
                    REFERENCES job_categories(category_id) ON DELETE CASCADE,
    UNIQUE(request_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_practice_requests_student ON student_practice_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_request_categories_req    ON student_request_categories(request_id);
CREATE INDEX IF NOT EXISTS idx_request_categories_cat    ON student_request_categories(category_id);
