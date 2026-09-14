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
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM('student', 'admin') DEFAULT 'student',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);