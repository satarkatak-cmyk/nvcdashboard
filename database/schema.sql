-- PostgreSQL Database Schema for Risk Map Dashboard
-- Database: dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing triggers first (ignore errors if they don't exist)
DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_ujiri_updated_at ON ujiri_entries;
    DROP TRIGGER IF EXISTS update_office_updated_at ON office_monitoring;
    DROP TRIGGER IF EXISTS update_dress_updated_at ON dress_time_monitoring;
    DROP TRIGGER IF EXISTS update_survey_updated_at ON service_survey;
    DROP TRIGGER IF EXISTS update_investigation_updated_at ON investigations;
    DROP TRIGGER IF EXISTS update_technical_updated_at ON technical_audit;
    DROP TRIGGER IF EXISTS update_project_updated_at ON project_monitoring;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS project_monitoring CASCADE;
DROP TABLE IF EXISTS technical_audit CASCADE;
DROP TABLE IF EXISTS investigations CASCADE;
DROP TABLE IF EXISTS service_survey CASCADE;
DROP TABLE IF EXISTS dress_time_monitoring CASCADE;
DROP TABLE IF EXISTS ujiri_entries CASCADE;

-- 0. USER MANAGEMENT TABLE (प्रयोगकर्ता व्यवस्थापन)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    mahashakha VARCHAR(255) NOT NULL,
    shakha VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'mahashakha', 'shakha')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    session_token TEXT,
    session_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ANNUAL PROGRAM / ANNUAL WORK PLAN
CREATE TABLE IF NOT EXISTS annual_programs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fiscal_year VARCHAR(10) NOT NULL DEFAULT '2083/84',
    serial_number INTEGER NOT NULL,
    activity_number VARCHAR(100) NOT NULL DEFAULT '',
    expenditure_head VARCHAR(100) NOT NULL DEFAULT '',
    program TEXT NOT NULL,
    activity TEXT NOT NULL DEFAULT '',
    budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
    lead_department TEXT NOT NULL DEFAULT '',
    supporting_department TEXT NOT NULL DEFAULT '',
    annual_target NUMERIC(12, 2) NOT NULL DEFAULT 0,
    months JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (fiscal_year, serial_number)
);

CREATE INDEX IF NOT EXISTS idx_annual_programs_fiscal_year ON annual_programs(fiscal_year);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    instance_id VARCHAR(100) NOT NULL,
    instance_name VARCHAR(255) NOT NULL,
    activity VARCHAR(30) NOT NULL CHECK (activity IN ('create', 'update', 'delete', 'login', 'logout')),
    username VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'warning')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_activity ON audit_logs(activity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 1. UJIRI MANAGEMENT TABLE (उजुरी व्यवस्थापन)
CREATE TABLE ujiri_entries (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    registration_date DATE NOT NULL,
    complainant_name VARCHAR(255),
    opponent_name VARCHAR(255) NOT NULL,
    ministry VARCHAR(255),
    province VARCHAR(100),
    district VARCHAR(100),
    municipality VARCHAR(255),
    complaint_type VARCHAR(100),
    complaint_source VARCHAR(100),
    complaint_description TEXT,
    committee_decision TEXT,
    final_decision_type VARCHAR(100),
    final_decision TEXT,
    decision_date DATE,
    remarks TEXT,
    attachment_files TEXT,
    attachment_data JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ujiri table
CREATE INDEX IF NOT EXISTS idx_ujiri_district ON ujiri_entries(district);
CREATE INDEX IF NOT EXISTS idx_ujiri_status ON ujiri_entries(status);
CREATE INDEX IF NOT EXISTS idx_ujiri_date ON ujiri_entries(registration_date);

-- 2. OFFICE MONITORING TABLE (कार्यालय अनुगमन)
CREATE TABLE IF NOT EXISTS office_monitoring (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    office_name VARCHAR(255) NOT NULL,
    office_type VARCHAR(100),
    province VARCHAR(100),
    district VARCHAR(100),
    monitoring_date DATE NOT NULL,
    monitoring_team VARCHAR(255),
    staff_attendance INTEGER,
    staff_punctuality_score DECIMAL(3,2),
    office_cleanliness_score DECIMAL(3,2),
    service_delivery_score DECIMAL(3,2),
    overall_performance DECIMAL(3,2),
    issues_found TEXT,
    recommendations TEXT,
    form_data JSONB,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE office_monitoring
    ADD COLUMN IF NOT EXISTS form_data JSONB;

-- Create index for office monitoring
CREATE INDEX IF NOT EXISTS idx_office_district ON office_monitoring(district);
CREATE INDEX IF NOT EXISTS idx_office_date ON office_monitoring(monitoring_date);

-- 3. DRESS TIME MONITORING TABLE (समय/पोशाक अनुगमन)
CREATE TABLE dress_time_monitoring (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    province VARCHAR(100),
    district VARCHAR(100),
    local_level VARCHAR(255),
    office_name VARCHAR(255),
    office_phone VARCHAR(50),
    monitoring_date DATE NOT NULL,
    monitoring_time TIME,
    total_staff INTEGER,
    active_staff INTEGER,
    vacant_staff INTEGER,
    staff_details JSONB,
    team_leader_name VARCHAR(255),
    team_leader_post VARCHAR(255),
    official_name VARCHAR(255),
    official_post VARCHAR(255),
    time_violation_count INTEGER DEFAULT 0,
    dress_violation_count INTEGER DEFAULT 0,
    total_violations INTEGER DEFAULT 0,
    action_recommended INTEGER DEFAULT 0,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for dress time monitoring
CREATE INDEX idx_dress_district ON dress_time_monitoring(district);
CREATE INDEX idx_dress_date ON dress_time_monitoring(monitoring_date);

-- 4. SERVICE USER SURVEY TABLE (सेवाग्राही सर्वेक्षण)
CREATE TABLE service_survey (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    survey_date DATE NOT NULL,
    respondent_name VARCHAR(255),
    respondent_type VARCHAR(100),
    service_type VARCHAR(100),
    office_visited VARCHAR(255),
    province VARCHAR(100),
    district VARCHAR(100),
    local_level VARCHAR(150),
    full_address TEXT,
    office_2 VARCHAR(255),
    office_3 VARCHAR(255),
    good_service_office VARCHAR(255),
    weak_service_office VARCHAR(255),
    overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
    service_quality INTEGER CHECK (service_quality >= 1 AND service_quality <= 5),
    staff_behavior INTEGER CHECK (staff_behavior >= 1 AND staff_behavior <= 5),
    timeliness INTEGER CHECK (timeliness >= 1 AND timeliness <= 5),
    transparency INTEGER CHECK (transparency >= 1 AND transparency <= 5),
    accessibility INTEGER CHECK (accessibility >= 1 AND accessibility <= 5),
    recommendations TEXT,
    suggestions TEXT,
    answer_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for service survey
CREATE INDEX IF NOT EXISTS idx_survey_district ON service_survey(district);
CREATE INDEX IF NOT EXISTS idx_survey_date ON service_survey(survey_date);
CREATE INDEX IF NOT EXISTS idx_survey_answers ON service_survey USING GIN(answer_data);
CREATE INDEX IF NOT EXISTS idx_survey_satisfaction ON service_survey(overall_satisfaction);

-- 5. INVESTIGATION TABLE (छानविन/अन्वेषण)
CREATE TABLE investigations (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    complaint_registration_number VARCHAR(50),
    registration_date VARCHAR(30),
    complainant_name VARCHAR(255),
    respondent_name VARCHAR(255),
    office VARCHAR(255),
    complaint_details TEXT,
    investigation_title VARCHAR(255) NOT NULL,
    investigation_type VARCHAR(100),
    investigation_date DATE NOT NULL,
    investigator_name VARCHAR(255),
    investigation_team VARCHAR(255),
    location VARCHAR(255),
    province VARCHAR(100),
    district VARCHAR(100),
    status VARCHAR(50) DEFAULT 'ongoing',
    findings TEXT,
    recommendations TEXT,
    report_date VARCHAR(30),
    report_summary TEXT,
    attachment_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    action_taken TEXT,
    completion_date DATE,
    fiscal_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for investigations
CREATE INDEX IF NOT EXISTS idx_investigation_district ON investigations(district);
CREATE INDEX IF NOT EXISTS idx_investigation_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_investigation_date ON investigations(investigation_date);

-- 6. TECHNICAL AUDIT TABLE (प्राविधिक परीक्षण)
CREATE TABLE technical_audit (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    related_agency VARCHAR(255),
    ncr TEXT,
    disposal_date VARCHAR(30),
    disposal_info_date VARCHAR(30),
    remarks TEXT,
    attachment_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    project_id VARCHAR(50),
    audit_date DATE NOT NULL,
    audit_team VARCHAR(255),
    project_location VARCHAR(255),
    province VARCHAR(100),
    district VARCHAR(100),
    project_type VARCHAR(100),
    technical_quality_score DECIMAL(3,2),
    safety_compliance_score DECIMAL(3,2),
    progress_percentage DECIMAL(5,2),
    budget_status VARCHAR(50),
    technical_findings TEXT,
    recommendations TEXT,
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for technical audit
CREATE INDEX IF NOT EXISTS idx_technical_district ON technical_audit(district);
CREATE INDEX IF NOT EXISTS idx_technical_status ON technical_audit(status);
CREATE INDEX IF NOT EXISTS idx_technical_date ON technical_audit(audit_date);
CREATE INDEX IF NOT EXISTS idx_technical_attachments ON technical_audit USING GIN(attachment_data);

-- 7. PROJECT MONITORING TABLE (आयोजना अनुगमन)
CREATE TABLE project_monitoring (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    attachment_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    project_code VARCHAR(50),
    monitoring_date DATE NOT NULL,
    monitoring_team VARCHAR(500),
    project_location VARCHAR(255),
    province VARCHAR(100),
    district VARCHAR(100),
    project_sector VARCHAR(100),
    project_type VARCHAR(100),
    budget_allocated DECIMAL(15,2),
    budget_spent DECIMAL(15,2),
    progress_percentage DECIMAL(5,2),
    quality_score DECIMAL(3,2),
    timeline_status VARCHAR(50),
    issues_identified TEXT,
    team_members JSONB,
    monitoring_findings TEXT,
    recommendations TEXT,
    status VARCHAR(50) DEFAULT 'ongoing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for project monitoring
CREATE INDEX IF NOT EXISTS idx_project_district ON project_monitoring(district);
CREATE INDEX IF NOT EXISTS idx_project_status ON project_monitoring(status);
CREATE INDEX IF NOT EXISTS idx_project_date ON project_monitoring(monitoring_date);
CREATE INDEX IF NOT EXISTS idx_project_sector ON project_monitoring(project_sector);
CREATE INDEX IF NOT EXISTS idx_project_attachments ON project_monitoring USING GIN(attachment_data);
CREATE INDEX IF NOT EXISTS idx_project_form_data ON project_monitoring USING GIN(form_data);

-- 8. CALENDAR EVENTS TABLE (क्यालेण्डर बैठक तथा कार्यक्रम)
CREATE TABLE IF NOT EXISTS calendar_events (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    title VARCHAR(100) NOT NULL CHECK (title IN ('उजुरी व्यवस्थापन समिति बैठक', 'मासिक समीक्षा बैठक', 'अन्य बैठक/कार्यक्रम')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_calendar_events_date_time ON calendar_events(event_date, event_time);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_ujiri_updated_at BEFORE UPDATE ON ujiri_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_office_updated_at BEFORE UPDATE ON office_monitoring
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dress_updated_at BEFORE UPDATE ON dress_time_monitoring
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_updated_at BEFORE UPDATE ON service_survey
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investigation_updated_at BEFORE UPDATE ON investigations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technical_updated_at BEFORE UPDATE ON technical_audit
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_updated_at BEFORE UPDATE ON project_monitoring
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Record ownership used by the server-side role scope.
DO $$
DECLARE
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'ujiri_entries', 'office_monitoring', 'dress_time_monitoring', 'service_survey',
        'investigations', 'technical_audit', 'project_monitoring', 'calendar_events',
        'promotional_programs', 'annual_programs'
    ] LOOP
        IF to_regclass(table_name) IS NOT NULL THEN
            EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS owner_user_id INTEGER', table_name);
            EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS owner_mahashakha VARCHAR(255)', table_name);
            EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS owner_shakha VARCHAR(255)', table_name);
        END IF;
    END LOOP;
END $$;