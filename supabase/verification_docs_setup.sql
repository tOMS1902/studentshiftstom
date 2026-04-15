-- ============================================================
-- Verification Documents & Account Approval Setup
-- Run these in the Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- 1. Ensure the students table has the required columns.
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS student_id_url text,
  ADD COLUMN IF NOT EXISTS gov_id_url     text,
  ADD COLUMN IF NOT EXISTS status         text NOT NULL DEFAULT 'unverified';

-- ============================================================
-- 2. Create the storage bucket via the Supabase Dashboard:
--    Storage → New bucket
--      Name:   verification-docs
--      Public: OFF  (keep private)
--
-- Then add these RLS policies on the bucket:
-- ============================================================

-- Allow authenticated students to upload only to their own folder
CREATE POLICY "Students can upload their own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow students to read their own docs
CREATE POLICY "Students can read their own verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins to read ALL verification docs
CREATE POLICY "Admins can read all verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs'
  AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================
-- 3. RLS policies on the students table for admin access
-- ============================================================

-- Allow admins to read all student rows
CREATE POLICY "Admins can read all student profiles"
ON students FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Allow admins to update student status
CREATE POLICY "Admins can update student status"
ON students FOR UPDATE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================================
-- 4. Create your admin account
--    a) Sign up normally via the app (as any user)
--    b) Run this to promote the account to admin (replace the email):
-- ============================================================

UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';  -- replace with your email
