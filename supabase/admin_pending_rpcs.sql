-- ================================================================
-- StudentShifts — Admin Pending RPCs
-- Fetches pending students/companies with emails from auth.users.
-- Regular PostgREST can't join auth.users, so we use SECURITY DEFINER.
--
-- Run this in the Supabase SQL Editor.
-- ================================================================

CREATE OR REPLACE FUNCTION get_pending_students()
RETURNS TABLE(id uuid, name text, email text, student_id_url text, gov_id_url text, status text)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT s.id, p.name, u.email, s.student_id_url, s.gov_id_url, s.status
  FROM students s
  JOIN profiles p ON p.id = s.id
  JOIN auth.users u ON u.id = s.id
  WHERE s.status = 'pending_review';
$$;

CREATE OR REPLACE FUNCTION get_pending_companies()
RETURNS TABLE(id uuid, name text, email text, cro_number text, status text)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT c.id, p.name, u.email, c.cro_number, c.status
  FROM companies c
  JOIN profiles p ON p.id = c.id
  JOIN auth.users u ON u.id = c.id
  WHERE c.status = 'pending_review';
$$;
