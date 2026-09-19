ALTER TABLE technical_audit
    ADD COLUMN IF NOT EXISTS related_agency VARCHAR(255),
    ADD COLUMN IF NOT EXISTS ncr TEXT,
    ADD COLUMN IF NOT EXISTS disposal_date VARCHAR(30),
    ADD COLUMN IF NOT EXISTS disposal_info_date VARCHAR(30),
    ADD COLUMN IF NOT EXISTS remarks TEXT,
    ADD COLUMN IF NOT EXISTS attachment_data JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_technical_attachments ON technical_audit USING GIN(attachment_data);