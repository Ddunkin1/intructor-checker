-- Sample data for Instructor Room Checker

-- Insert sample rooms
INSERT INTO rooms (name, building, capacity) VALUES
  ('Room 101', 'Main Building', 30),
  ('Room 102', 'Main Building', 25),
  ('Room 201', 'Science Wing', 40),
  ('Room 202', 'Science Wing', 35),
  ('Auditorium A', 'Main Building', 100),
  ('Lab 1', 'Science Wing', 20),
  ('Lab 2', 'Science Wing', 15);

-- Note: Instructors are created automatically when users sign up via Supabase Auth
-- You can create test users through the Supabase Auth dashboard
