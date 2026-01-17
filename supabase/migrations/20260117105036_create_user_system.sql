/*
  # User Authentication and Progress Tracking System

  ## Overview
  This migration creates a complete user management system with authentication,
  profile management, and progress tracking for the CyberSec Academy platform.

  ## New Tables
  
  ### 1. user_profiles
  Stores extended user information beyond auth.users
  - `id` (uuid, primary key) - References auth.users(id)
  - `full_name` (text) - User's full name
  - `age` (integer) - User's age
  - `total_points` (integer) - Total points earned across all activities
  - `current_streak` (integer) - Current consecutive days of activity
  - `skill_level` (text) - User's skill level (Beginner, Intermediate, Advanced)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. user_lab_progress
  Tracks user progress through vulnerability labs
  - `id` (uuid, primary key) - Unique progress record ID
  - `user_id` (uuid) - References user_profiles(id)
  - `lab_id` (text) - Lab identifier (e.g., 'sql-injection', 'xss')
  - `completed` (boolean) - Whether lab is completed
  - `points_earned` (integer) - Points earned from this lab
  - `completed_at` (timestamptz) - When the lab was completed
  - `created_at` (timestamptz) - When user started the lab

  ### 3. user_achievements
  Tracks achievements and badges earned by users
  - `id` (uuid, primary key) - Unique achievement record ID
  - `user_id` (uuid) - References user_profiles(id)
  - `achievement_id` (text) - Achievement identifier
  - `earned_at` (timestamptz) - When achievement was earned
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. user_activity_log
  Logs all user activities for streak tracking
  - `id` (uuid, primary key) - Unique activity record ID
  - `user_id` (uuid) - References user_profiles(id)
  - `activity_type` (text) - Type of activity (lab_completed, tool_used, etc.)
  - `activity_data` (jsonb) - Additional activity metadata
  - `created_at` (timestamptz) - When activity occurred

  ## Security
  - All tables have RLS enabled
  - Users can only access and modify their own data
  - Policies enforce user ownership via auth.uid()
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age >= 13 AND age <= 120),
  total_points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  skill_level text DEFAULT 'Beginner' CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create user_lab_progress table
CREATE TABLE IF NOT EXISTS user_lab_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lab_id text NOT NULL,
  completed boolean DEFAULT false,
  points_earned integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lab_id)
);

ALTER TABLE user_lab_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lab progress"
  ON user_lab_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab progress"
  ON user_lab_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab progress"
  ON user_lab_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity log"
  ON user_activity_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity log"
  ON user_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_lab_progress_user_id ON user_lab_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lab_progress_completed ON user_lab_progress(completed);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();