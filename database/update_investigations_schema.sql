ALTER TABLE investigations
    ADD COLUMN IF NOT EXISTS registration_date VARCHAR(30),
    ADD COLUMN IF NOT EXISTS complainant_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS respondent_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS office VARCHAR(255),
    ADD COLUMN IF NOT EXISTS complaint_details TEXT,
    ADD COLUMN IF NOT EXISTS report_date VARCHAR(30),
    ADD COLUMN IF NOT EXISTS report_summary TEXT,
    ADD COLUMN IF NOT EXISTS attachment_data JSONB NOT NULL DEFAULT '[]'::jsonb;