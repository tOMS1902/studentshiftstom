-- ============================================================
-- Verification Documents Setup
-- Run these in the Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- 1. Ensure the students table has the doc path columns.
--    Skip if they already exist.
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS student_id_url text,
  ADD COLUMN IF NOT EXISTS gov_id_url     text;

-- ============================================================
-- 2. Create the storage bucket via the Supabase Dashboard:
--    Storage → New bucket
--      Name:   verification-docs
--      Public: OFF  (keep private)
--
-- Then add these RLS policies on the bucket:
-- ============================================================

-- Allow authenticated users to upload only to their own folder
CREATE POLICY "Students can upload their own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read only their own docs
CREATE POLICY "Students can read their own verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-docs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow service role full access (for admin review)
-- This is granted automatically to the service role — no policy needed.
