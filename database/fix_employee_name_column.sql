-- Fix employee_name column issue in dress_time_monitoring table
-- This script removes the employee_name and employee_id columns that are causing NOT NULL constraint errors

-- Drop the index on employee_id first
DROP INDEX IF EXISTS idx_dress_employee;

-- Drop the employee_name column
ALTER TABLE dress_time_monitoring DROP COLUMN IF EXISTS employee_name;

-- Drop the employee_id column if it exists
ALTER TABLE dress_time_monitoring DROP COLUMN IF EXISTS employee_id;
