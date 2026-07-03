-- ============================================================
-- 019_profile_contact_limit.sql
--
-- Adds a cumulative contact_limit column to the profiles table.
-- Each subscription purchase adds its plan's contact_limit
-- to this running total.
--
-- Idempotent -- safe to re-run.
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS contact_limit INTEGER NOT NULL DEFAULT 0;
