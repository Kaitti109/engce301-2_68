-- database/schema.sql
-- Task Board Database Schema
-- ENGSE207 Software Architecture - Week 3 Lab

-- Drop existing table if exists (for development)
DROP TABLE IF EXISTS tasks;

-- Create tasks table
-- TODO: Review the schema and understand each field
-- 1. ลบตารางเก่า (ถ้ามี) แล้วสร้างใหม่พร้อมค่า Default GMT+7

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'TODO',
    priority TEXT DEFAULT 'MEDIUM',
    created_at DATETIME DEFAULT (datetime('now', '+7 hours')),
    updated_at DATETIME DEFAULT (datetime('now', '+7 hours'))
);

-- 2. สร้าง Trigger เพื่ออัปเดตฟิลด์ updated_at ทุกครั้งที่มีการ UPDATE ข้อมูล
CREATE TRIGGER update_task_timestamp 
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks 
    SET updated_at = datetime('now', '+7 hours') 
    WHERE id = OLD.id;
END;

-- Create index for faster queries on status
CREATE INDEX idx_task_status ON tasks(status);

-- Insert sample data for testing
INSERT INTO tasks (title, description, status, priority) VALUES
('Setup Development Environment', 'Install WSL, Node.js, SQLite, VS Code', 'DONE', 'HIGH'),
('Learn Monolithic Architecture', 'Understand all-in-one architecture pattern', 'IN_PROGRESS', 'HIGH'),
('Build Task Board App', 'Create CRUD operations for tasks', 'TODO', 'MEDIUM'),
('Write Documentation', 'Create README with setup instructions', 'TODO', 'LOW');

-- Verify the data was inserted
SELECT * FROM tasks;
