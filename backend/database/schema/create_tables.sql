-- ==========================================================
-- Study Abroad AI Database Schema
-- ==========================================================

CREATE TABLE IF NOT EXISTS scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL UNIQUE,

    country VARCHAR(100),

    last_date_to_apply VARCHAR(100),

    official_website TEXT,

    bd_ambassy_website TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================

CREATE TABLE IF NOT EXISTS scholarship_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,

    scholarship_id INT NOT NULL,

    section_title VARCHAR(255),

    section_content LONGTEXT,

    FOREIGN KEY (scholarship_id)
        REFERENCES scholarships(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- Degree Levels
-- ==========================================================

CREATE TABLE IF NOT EXISTS scholarship_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,

    scholarship_id INT NOT NULL,

    program_name VARCHAR(100) NOT NULL,
    degree_level VARCHAR(30),
    duration VARCHAR(50),
    languages VARCHAR(100),

    CONSTRAINT fk_program_scholarship
        FOREIGN KEY (scholarship_id)
        REFERENCES scholarships(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_scholarship_program
        UNIQUE (scholarship_id, program_name)
);
-- ==========================================================
-- Eligibility Rules (AI Extracted)
-- ==========================================================

CREATE TABLE IF NOT EXISTS scholarship_eligibility (
    id INT AUTO_INCREMENT PRIMARY KEY,

    scholarship_id INT NOT NULL,
    program_id INT NULL,

    scope VARCHAR(20) NOT NULL,

    rule_type VARCHAR(50) NOT NULL,
    operator VARCHAR(10) NOT NULL,
    rule_value VARCHAR(255) NOT NULL,

    mandatory BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_eligibility_scholarship
        FOREIGN KEY (scholarship_id)
        REFERENCES scholarships(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_eligibility_program
        FOREIGN KEY (program_id)
        REFERENCES scholarship_programs(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_eligibility_rule
        UNIQUE (
            scholarship_id,
            program_id,
            scope,
            rule_type,
            operator,
            rule_value
        )
);

-- ==========================================================
-- Required Documents
-- ==========================================================

CREATE TABLE IF NOT EXISTS scholarship_documents (

    id INT AUTO_INCREMENT PRIMARY KEY,

    scholarship_id INT NOT NULL,

    document_name VARCHAR(255) NOT NULL,

    requirement TEXT,

    condition_text TEXT,

    mandatory BOOLEAN DEFAULT TRUE,

    source_sentence TEXT,

    CONSTRAINT fk_document_scholarship
        FOREIGN KEY (scholarship_id)
        REFERENCES scholarships(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_scholarship_document
        UNIQUE (
            scholarship_id,
            document_name
        )
);

-- ==========================================================
-- Language Requirements
-- ==========================================================

CREATE TABLE IF NOT EXISTS language_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,

    scholarship_id INT NOT NULL,

    language_name VARCHAR(100),

    exam_name VARCHAR(100),

    minimum_level VARCHAR(50),

    FOREIGN KEY (scholarship_id)
        REFERENCES scholarships(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- Scholarship Benefits
-- ==========================================================

CREATE TABLE scholarship_coverage (
    id INT AUTO_INCREMENT PRIMARY KEY,

    scholarship_id INT NOT NULL,
    program_id INT NULL,

    benefit_type VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,

    amount DECIMAL(12,2) NULL,
    currency VARCHAR(20) NULL,
    period VARCHAR(50) NULL,

    coverage VARCHAR(255) NULL,
    applicability TEXT NULL,

    CONSTRAINT fk_coverage_scholarship
        FOREIGN KEY (scholarship_id)
        REFERENCES scholarships(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_coverage_program
        FOREIGN KEY (program_id)
        REFERENCES scholarship_programs(id)
        ON DELETE CASCADE
);

-- ==========================================================
-- Scholarship Contacts
-- ==========================================================   

CREATE TABLE scholarship_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,

    scholarship_id INT NOT NULL,

    contact_type VARCHAR(50) NOT NULL,
    value TEXT NOT NULL,

    CONSTRAINT fk_contact_scholarship
        FOREIGN KEY (scholarship_id)
        REFERENCES scholarships(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_scholarship_contact
        UNIQUE (
            scholarship_id,
            contact_type,
            value(255)
        )
);


-- ==========================================================
-- End Of Scholarship Related Tables
-- ==========================================================

-- =========================================================
-- User Table
-- =========================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM('student', 'admin') DEFAULT 'student',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- End of User Table    
-- =========================================================

-- =========================================================
CREATE TABLE IF NOT EXISTS student_destinations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    country_code CHAR(2) NOT NULL,
    priority_order SMALLINT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_student_destination_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_student_destination
        (user_id, country_code)
);

CREATE TABLE IF NOT EXISTS student_degrees (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    degree_level VARCHAR(60) NOT NULL,
    degree_title VARCHAR(150) NULL,
    field_of_study VARCHAR(150) NULL,
    institution_name VARCHAR(255) NULL,

    completion_status VARCHAR(30) NOT NULL DEFAULT 'completed',
    graduation_year SMALLINT NULL,
    grade_value DECIMAL(6,2) NULL,
    grade_scale DECIMAL(6,2) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_student_degree_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_degrees_user (user_id)
);

CREATE TABLE IF NOT EXISTS student_profile_attributes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    attribute_key VARCHAR(100) NOT NULL,
    attribute_value JSON NULL,

    country_code CHAR(2) NULL,
    source_type VARCHAR(30) DEFAULT 'student',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_profile_attribute_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE KEY uq_user_attribute_country
        (user_id, attribute_key, country_code)
);


CREATE TABLE IF NOT EXISTS student_language_proficiencies (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,

    language_code VARCHAR(10) NOT NULL,
    proficiency_type VARCHAR(30) NOT NULL,

    test_name VARCHAR(80) NULL,
    score_numeric DECIMAL(8,2) NULL,
    score_text VARCHAR(50) NULL,
    proficiency_level VARCHAR(30) NULL,

    test_date DATE NULL,
    expiry_date DATE NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_language_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_language_user (user_id),
    INDEX idx_language_test (language_code, test_name)
);


CREATE TABLE IF NOT EXISTS student_profiles (
    user_id INT NOT NULL,

    nationality VARCHAR(100) NULL,
    date_of_birth DATE NULL,

    current_study_level VARCHAR(50) NULL,
    field_of_study VARCHAR(150) NULL,

    institution_name VARCHAR(255) NULL,
    current_gpa DECIMAL(5,2) NULL,
    gpa_scale DECIMAL(5,2) NULL,

    annual_budget DECIMAL(12,2) NULL,
    budget_currency CHAR(3) NULL,

    work_experience_months INT NULL,
    leadership_experience BOOLEAN NULL,
    community_service BOOLEAN NULL,
    research_experience BOOLEAN NULL,

    international_student BOOLEAN NULL,
    currently_enrolled BOOLEAN NULL,
    gdsc_member BOOLEAN NULL,
    university_team_member BOOLEAN NULL,

    achievements JSON NULL,
    innovation_projects JSON NULL,
    partner_universities JSON NULL,

    additional_information JSON NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),

    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_profile_gpa
        CHECK (current_gpa IS NULL OR current_gpa >= 0),

    CONSTRAINT chk_profile_gpa_scale
        CHECK (gpa_scale IS NULL OR gpa_scale > 0),

    CONSTRAINT chk_profile_budget
        CHECK (annual_budget IS NULL OR annual_budget >= 0),

    CONSTRAINT chk_profile_work_months
        CHECK (
            work_experience_months IS NULL
            OR work_experience_months >= 0
        )
);

-- User Documentation Table
CREATE TABLE IF NOT EXISTS user_documents (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    checklist_id VARCHAR(100) NOT NULL,

    has_document TINYINT(1) NOT NULL DEFAULT 0,

    original_filename VARCHAR(255) NULL,
    file_size_bytes INT UNSIGNED NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_user_document (user_id, checklist_id),

    CONSTRAINT fk_user_documents_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;





-- =========================================================
-- OAuth Exchange Codes Table
-- =========================================================
CREATE TABLE IF NOT EXISTS `oauth_exchange_codes` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` INT(11) NOT NULL,
    `code_hash` CHAR(64) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `code_hash` (`code_hash`),
    KEY `idx_oauth_exchange_expires` (`expires_at`),
    KEY `fk_oauth_exchange_user` (`user_id`),

    CONSTRAINT `fk_oauth_exchange_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=latin1
  COLLATE=latin1_swedish_ci;