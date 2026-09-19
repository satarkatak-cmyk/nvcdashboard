-- Quick migration to add missing columns to dress_time_monitoring table
-- Run this if the table already exists but columns are missing

-- Add missing columns one by one
ALTER TABLE dress_time_monitoring ADD COLUMN IF NOT EXISTS local_level VARCHAR(255);
ALTER TABLE dress_time_monitoring ADD COLUMN IF NOT EXISTS office_phone VARCHAR(50);
ALTER TABLE dress_time_monitoring ADD COLUMN monitoring_time TIME;
ALTER TABLE dress_time_monitoring ADD COLUMN total_staff INTEGER;
ALTER TABLE dress_time_monitoring ADD COLUMN active_staff INTEGER;
ALTER TABLE dress_time_monitoring ADD COLUMN vacant_staff INTEGER;
ALTER TABLE dress_time_monitoring ADD COLUMN staff_details JSONB;
ALTER TABLE dress_time_monitoring ADD COLUMN team_leader_name VARCHAR(255);
ALTER TABLE dress_time_monitoring ADD COLUMN team_leader_post VARCHAR(255);
ALTER TABLE dress_time_monitoring ADD COLUMN official_name VARCHAR(255);
ALTER TABLE dress_time_monitoring ADD COLUMN official_post VARCHAR(255);
ALTER TABLE dress_time_monitoring ADD COLUMN action_recommended INTEGER DEFAULT 0;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_dress_local_level ON dress_time_monitoring(local_level);
CREATE INDEX IF NOT EXISTS idx_dress_province ON dress_time_monitoring(province);

-- Note: If the old columns don't match, you may need to drop and recreate the table
-- Use the full update_dress_time_schema.sql for complete recreation