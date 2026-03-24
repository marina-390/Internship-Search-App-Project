-- ============================================================
-- Practice Search - Создание таблиц
-- База данных: Practice_search
-- Выполнять подключившись к базе Practice_search
-- ============================================================

-- Таблица пользователей (уже существует)
-- CREATE TABLE IF NOT EXISTS public."Users"
-- (
--     user_id integer NOT NULL,
--     user_login character varying(100) NOT NULL,
--     user_password character varying(255) NOT NULL,
--     user_token text,
--     created_at timestamp with time zone NOT NULL DEFAULT now(),
--     updated_at timestamp with time zone NOT NULL DEFAULT now(),
--     role integer NOT NULL,
--     CONSTRAINT "Users_pkey" PRIMARY KEY (user_id),
--     CONSTRAINT user_login UNIQUE (user_login)
-- );

-- ============================================================
-- Профили студентов
-- ============================================================
CREATE TABLE IF NOT EXISTS student_profiles (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    type_education  VARCHAR(255),
    resume          TEXT,
    birth_date      DATE,
    phone           VARCHAR(20),
    city            VARCHAR(100),
    about           TEXT,
    photo_url       VARCHAR(1000),
    cv_url          VARCHAR(1000),
    cv_original_name VARCHAR(255),
    practice_start  DATE,
    practice_end    DATE,
    is_open_to_offers BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_student_user FOREIGN KEY (user_id)
        REFERENCES "Users"(user_id) ON DELETE CASCADE
);

-- ============================================================
-- Компании
-- ============================================================
CREATE TABLE IF NOT EXISTS "Companies" (
    company_id      SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL UNIQUE,
    company_name    VARCHAR(255) NOT NULL,
    description     TEXT,
    website         VARCHAR(500),
    contact_email   VARCHAR(255),
    logo_url        VARCHAR(1000),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_company_user FOREIGN KEY (user_id)
        REFERENCES "Users"(user_id) ON DELETE CASCADE
);

-- ============================================================
-- Позиции (вакансии компании)
-- ============================================================
CREATE TABLE IF NOT EXISTS positions (
    position_id     SERIAL PRIMARY KEY,
    company_id      INTEGER NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    requirements    TEXT,
    period_start    DATE,
    period_end      DATE,
    is_open_ended   BOOLEAN NOT NULL DEFAULT FALSE,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'closed', 'draft')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_position_company FOREIGN KEY (company_id)
        REFERENCES "Companies"(company_id) ON DELETE CASCADE
);

-- ============================================================
-- Ссылки студента (GitHub, LinkedIn, портфолио и т.д.)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Student_links" (
    link_id     SERIAL PRIMARY KEY,
    student_id  INTEGER NOT NULL,
    link_type   VARCHAR(50)
                    CHECK (link_type IN ('github', 'linkedin', 'portfolio', 'other')),
    label       VARCHAR(100),
    url         VARCHAR(1000) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_link_student FOREIGN KEY (student_id)
        REFERENCES student_profiles(id) ON DELETE CASCADE
);

-- ============================================================
-- Желаемые позиции студента
-- ============================================================
CREATE TABLE IF NOT EXISTS "Student_desired_positions" (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER NOT NULL,
    title       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_desired_student FOREIGN KEY (student_id)
        REFERENCES student_profiles(id) ON DELETE CASCADE
);

-- ============================================================
-- Заявки на вакансии
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
    application_id  SERIAL PRIMARY KEY,
    student_id      INTEGER NOT NULL,
    position_id     INTEGER NOT NULL,
    cover_letter    TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'viewed', 'accepted', 'rejected')),
    applied_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, position_id),
    CONSTRAINT fk_app_student FOREIGN KEY (student_id)
        REFERENCES student_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_position FOREIGN KEY (position_id)
        REFERENCES positions(position_id) ON DELETE CASCADE
);

-- ============================================================
-- Индексы
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_positions_company      ON positions(company_id);
CREATE INDEX IF NOT EXISTS idx_positions_status       ON positions(status);
CREATE INDEX IF NOT EXISTS idx_student_links_student  ON "Student_links"(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_student   ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_position  ON applications(position_id);
CREATE INDEX IF NOT EXISTS idx_applications_status    ON applications(status);
