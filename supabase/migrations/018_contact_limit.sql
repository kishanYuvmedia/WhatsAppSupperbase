-- ============================================================
-- 018_contact_limit.sql
--
-- Adds `contact_limit` column to the `subscriptions` table.
-- 0 means unlimited (no contact cap).
--
-- Idempotent -- safe to re-run.
-- ============================================================

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS contact_limit INTEGER NOT NULL DEFAULT 0;
