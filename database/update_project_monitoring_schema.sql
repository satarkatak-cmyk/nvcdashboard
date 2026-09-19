ALTER TABLE project_monitoring
    ADD COLUMN IF NOT EXISTS attachment_data JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE project_monitoring
    ADD COLUMN IF NOT EXISTS form_data JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_project_attachments ON project_monitoring USING GIN(attachment_data);
CREATE INDEX IF NOT EXISTS idx_project_form_data ON project_monitoring USING GIN(form_data);