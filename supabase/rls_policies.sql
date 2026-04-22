-- ================================================================
-- StudentShifts — Comprehensive Row Level Security (RLS) Policies
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Safe to re-run: all DROP IF EXISTS before CREATE
-- ================================================================

-- ----------------------------------------------------------------
-- HELPER: is_admin()
-- Checks if the currently authenticated user is an admin.
-- SECURITY DEFINER so it bypasses RLS when reading profiles.
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;


-- ================================================================
-- TABLE: profiles
-- Stores: id, name, role, created_at
-- (No email — that lives in auth.users)
-- ================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: authenticated read all"  ON profiles;
DROP POLICY IF EXISTS "profiles: own update"              ON profiles;
DROP POLICY IF EXISTS "profiles: admin all"               ON profiles;

-- Any signed-in user can read profiles (name + role only — no sensitive data here).
-- Needed for company/student conversation lists fetching names.
CREATE POLICY "profiles: authenticated read all" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only update their own profile; role column cannot be self-escalated
CREATE POLICY "profiles: own update" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Admin can do everything (read, insert, update, delete)
CREATE POLICY "profiles: admin all" ON profiles
  FOR ALL USING (is_admin());


-- ================================================================
-- TABLE: students
-- Stores: id, bio, skills, linkedin, cv_url, cover_letter_url,
--         profile_photo_url, student_id_url, gov_id_url,
--         status, location_lat, location_lng, location_display
-- ================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students: own read"               ON students;
DROP POLICY IF EXISTS "students: own update"             ON students;
DROP POLICY IF EXISTS "students: admin read all"         ON students;
DROP POLICY IF EXISTS "students: admin update"           ON students;
DROP POLICY IF EXISTS "students: company read applicants" ON students;

-- Student reads their own row
CREATE POLICY "students: own read" ON students
  FOR SELECT USING (auth.uid() = id);

-- Student updates their own row (bio, CV, skills, etc.)
CREATE POLICY "students: own update" ON students
  FOR UPDATE USING (auth.uid() = id);

-- Admin can read all students (pending review list, verification, etc.)
CREATE POLICY "students: admin read all" ON students
  FOR SELECT USING (is_admin());

-- Admin can update any student row (approve/reject — also covered by SECURITY DEFINER RPCs)
CREATE POLICY "students: admin update" ON students
  FOR UPDATE USING (is_admin());

-- Company can read basic info of students who have applied to their jobs
CREATE POLICY "students: company read applicants" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE a.student_id = students.id
        AND j.company_id = auth.uid()
    )
  );


-- ================================================================
-- TABLE: companies
-- Stores: id, bio, website, etc.
-- ================================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "companies: own read"   ON companies;
DROP POLICY IF EXISTS "companies: own update" ON companies;
DROP POLICY IF EXISTS "companies: admin all"  ON companies;
DROP POLICY IF EXISTS "companies: student read" ON companies;

-- Company reads/updates their own row
CREATE POLICY "companies: own read" ON companies
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "companies: own update" ON companies
  FOR UPDATE USING (auth.uid() = id);

-- Students can read company info (for job detail pages)
CREATE POLICY "companies: student read" ON companies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin full access
CREATE POLICY "companies: admin all" ON companies
  FOR ALL USING (is_admin());


-- ================================================================
-- TABLE: jobs
-- Stores: id, title, company, company_id, pay, location, days,
--         times, description, deadline, weekendRequired, photos, photoCrops
-- ================================================================
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs: public read"      ON jobs;
DROP POLICY IF EXISTS "jobs: company insert"   ON jobs;
DROP POLICY IF EXISTS "jobs: company update"   ON jobs;
DROP POLICY IF EXISTS "jobs: company delete"   ON jobs;
DROP POLICY IF EXISTS "jobs: admin all"        ON jobs;

-- Anyone (including unauthenticated) can view jobs — public job board
CREATE POLICY "jobs: public read" ON jobs
  FOR SELECT USING (true);

-- Company can only create jobs for themselves, and only if verified
CREATE POLICY "jobs: company insert" ON jobs
  FOR INSERT WITH CHECK (
    auth.uid() = company_id AND
    EXISTS (SELECT 1 FROM companies WHERE id = auth.uid() AND status = 'verified')
  );

-- Company can only edit their own jobs
CREATE POLICY "jobs: company update" ON jobs
  FOR UPDATE USING (auth.uid() = company_id);

-- Company can only delete their own jobs
CREATE POLICY "jobs: company delete" ON jobs
  FOR DELETE USING (auth.uid() = company_id);

-- Admin full access
CREATE POLICY "jobs: admin all" ON jobs
  FOR ALL USING (is_admin());


-- ================================================================
-- TABLE: liked_jobs
-- Stores: student_id, job_id (composite PK)
-- ================================================================
ALTER TABLE liked_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "liked_jobs: own read"   ON liked_jobs;
DROP POLICY IF EXISTS "liked_jobs: own insert" ON liked_jobs;
DROP POLICY IF EXISTS "liked_jobs: own delete" ON liked_jobs;

CREATE POLICY "liked_jobs: own read" ON liked_jobs
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "liked_jobs: own insert" ON liked_jobs
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "liked_jobs: own delete" ON liked_jobs
  FOR DELETE USING (auth.uid() = student_id);


-- ================================================================
-- TABLE: applications
-- Stores: id, student_id, job_id, status (default 'Pending'), created_at
-- ================================================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "applications: student own read"      ON applications;
DROP POLICY IF EXISTS "applications: student own insert"    ON applications;
DROP POLICY IF EXISTS "applications: student own delete"    ON applications;
DROP POLICY IF EXISTS "applications: company read"          ON applications;
DROP POLICY IF EXISTS "applications: company update status" ON applications;
DROP POLICY IF EXISTS "applications: admin all"             ON applications;

-- Student reads their own applications (for Applied Jobs page)
CREATE POLICY "applications: student own read" ON applications
  FOR SELECT USING (auth.uid() = student_id);

-- Student can apply for a job, but only if their account is verified
CREATE POLICY "applications: student own insert" ON applications
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (SELECT 1 FROM students WHERE id = auth.uid() AND status = 'verified')
  );

-- Student can withdraw their application
CREATE POLICY "applications: student own delete" ON applications
  FOR DELETE USING (auth.uid() = student_id);

-- Company can read all applications to their own jobs
CREATE POLICY "applications: company read" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
        AND jobs.company_id = auth.uid()
    )
  );

-- Company can update application status (Accepted / Rejected / Pending)
CREATE POLICY "applications: company update status" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
        AND jobs.company_id = auth.uid()
    )
  );

-- Admin full access
CREATE POLICY "applications: admin all" ON applications
  FOR ALL USING (is_admin());


-- ================================================================
-- TABLE: chat_messages
-- Stores: id, job_id, student_id, company_id, sender_id, text, created_at
-- ================================================================
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_messages: student read"   ON chat_messages;
DROP POLICY IF EXISTS "chat_messages: company read"   ON chat_messages;
DROP POLICY IF EXISTS "chat_messages: student insert" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages: company insert" ON chat_messages;
DROP POLICY IF EXISTS "chat_messages: admin all"      ON chat_messages;

-- Student can read messages in their conversations
CREATE POLICY "chat_messages: student read" ON chat_messages
  FOR SELECT USING (auth.uid() = student_id);

-- Company can read messages for their jobs
CREATE POLICY "chat_messages: company read" ON chat_messages
  FOR SELECT USING (auth.uid() = company_id);

-- Student can send messages (must be the student in the conversation and the sender)
CREATE POLICY "chat_messages: student insert" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = student_id AND
    auth.uid() = sender_id
  );

-- Company can send messages only to students who applied to their jobs (accepted apps) or for a specific job
CREATE POLICY "chat_messages: company insert" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = company_id AND
    auth.uid() = sender_id AND
    (
      job_id IS NOT NULL OR
      EXISTS (
        SELECT 1 FROM applications a
        JOIN jobs j ON j.id = a.job_id
        WHERE j.company_id = auth.uid()
          AND a.student_id = chat_messages.student_id
          AND a.status = 'Accepted'
      )
    )
  );

-- Admin full access
CREATE POLICY "chat_messages: admin all" ON chat_messages
  FOR ALL USING (is_admin());


-- ================================================================
-- STORAGE: avatars bucket
-- Public profile photos — readable by everyone, writable by owner
-- ================================================================
DROP POLICY IF EXISTS "avatars: public read"  ON storage.objects;
DROP POLICY IF EXISTS "avatars: own upload"   ON storage.objects;
DROP POLICY IF EXISTS "avatars: own update"   ON storage.objects;
DROP POLICY IF EXISTS "avatars: own delete"   ON storage.objects;

-- Anyone can view avatars (they are public profile photos)
CREATE POLICY "avatars: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Users can upload to their own folder only (folder = their user ID)
CREATE POLICY "avatars: own upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: own update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars: own delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );


-- ================================================================
-- STORAGE: documents bucket (CVs, cover letters)
-- Private — only owner + companies they applied to
-- ================================================================
DROP POLICY IF EXISTS "documents: own read"                    ON storage.objects;
DROP POLICY IF EXISTS "documents: own upload"                  ON storage.objects;
DROP POLICY IF EXISTS "documents: own update"                  ON storage.objects;
DROP POLICY IF EXISTS "documents: own delete"                  ON storage.objects;
DROP POLICY IF EXISTS "documents: company read applicant docs" ON storage.objects;

-- Students can read their own documents
CREATE POLICY "documents: own read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Students can upload to their own folder
CREATE POLICY "documents: own upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "documents: own update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "documents: own delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Companies can read CVs/cover letters of students who applied to their jobs
-- (storage paths are structured as userId/filename)
CREATE POLICY "documents: company read applicant docs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE j.company_id = auth.uid()
        AND a.student_id::text = (storage.foldername(name))[1]
    )
  );


-- ================================================================
-- STORAGE: verification-docs bucket
-- Sensitive ID documents — only owner upload, admin read
-- ================================================================
DROP POLICY IF EXISTS "verification-docs: own upload" ON storage.objects;
DROP POLICY IF EXISTS "verification-docs: own read"   ON storage.objects;
DROP POLICY IF EXISTS "verification-docs: own update" ON storage.objects;
DROP POLICY IF EXISTS "verification-docs: admin read" ON storage.objects;

-- Students can upload their own verification docs
CREATE POLICY "verification-docs: own upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Students can re-upload (upsert) their docs
CREATE POLICY "verification-docs: own update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Students can read their own docs (e.g. to confirm upload)
CREATE POLICY "verification-docs: own read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admin can read all verification docs for review
CREATE POLICY "verification-docs: admin read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'verification-docs' AND
    is_admin()
  );


-- ================================================================
-- RPC FUNCTIONS (SECURITY DEFINER — admin-only, bypass RLS safely)
-- ================================================================

-- Approve a student: sets status = 'verified'. Admin only.
CREATE OR REPLACE FUNCTION approve_student(student_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorised: admin only';
  END IF;
  UPDATE students SET status = 'verified' WHERE id = student_id;
END;
$$;

-- Reject a student: sets status = 'rejected'. Admin only.
CREATE OR REPLACE FUNCTION reject_student(student_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorised: admin only';
  END IF;
  UPDATE students SET status = 'rejected' WHERE id = student_id;
END;
$$;

-- Returns emails only for users who have a relationship with the caller
-- (applied to the company's jobs, or is the caller themselves).
CREATE OR REPLACE FUNCTION get_user_emails(user_ids uuid[])
RETURNS TABLE(id uuid, email text)
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT u.id, u.email
  FROM auth.users u
  WHERE u.id = ANY(user_ids)
    AND (
      -- The caller is asking about themselves
      u.id = auth.uid()
      OR
      -- Student applied to a job owned by the calling company
      EXISTS (
        SELECT 1 FROM applications a
        JOIN jobs j ON j.id = a.job_id
        WHERE j.company_id = auth.uid()
          AND a.student_id = u.id
      )
    );
$$;

-- Delete the currently authenticated user's own account.
CREATE OR REPLACE FUNCTION delete_account()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
