-- Migration script to update dress_time_monitoring table structure
-- Run this to update the existing table

-- Drop existing table and recreate with new structure
DROP TABLE IF EXISTS dress_time_monitoring CASCADE;

-- Create updated dress time monitoring table
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

-- Create indexes for dress time monitoring
CREATE INDEX idx_dress_district ON dress_time_monitoring(district);
CREATE INDEX idx_dress_date ON dress_time_monitoring(monitoring_date);
CREATE INDEX idx_dress_province ON dress_time_monitoring(province);
CREATE INDEX idx_dress_local_level ON dress_time_monitoring(local_level);

-- Apply trigger for updated_at
CREATE TRIGGER update_dress_updated_at BEFORE UPDATE ON dress_time_monitoring
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();