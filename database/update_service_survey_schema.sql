ALTER TABLE service_survey
    ADD COLUMN IF NOT EXISTS local_level VARCHAR(150),
    ADD COLUMN IF NOT EXISTS full_address TEXT,
    ADD COLUMN IF NOT EXISTS office_2 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS office_3 VARCHAR(255),
    ADD COLUMN IF NOT EXISTS good_service_office VARCHAR(255),
    ADD COLUMN IF NOT EXISTS weak_service_office VARCHAR(255),
    ADD COLUMN IF NOT EXISTS answer_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_survey_district ON service_survey(district);
CREATE INDEX IF NOT EXISTS idx_survey_date ON service_survey(survey_date);
CREATE INDEX IF NOT EXISTS idx_survey_answers ON service_survey USING GIN(answer_data);