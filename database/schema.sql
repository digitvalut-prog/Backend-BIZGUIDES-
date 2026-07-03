-- ==========================================================
-- LaunchKit — PostgreSQL schema
-- Run: psql -U leadgen_user -d leadgen_db -f database/schema.sql
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid(), optional

CREATE TABLE IF NOT EXISTS leads (
    id          SERIAL PRIMARY KEY,
    full_name   VARCHAR(150)  NOT NULL,
    email       VARCHAR(255)  NOT NULL,
    company     VARCHAR(150),
    ip_address  VARCHAR(45),
    user_agent  TEXT,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT leads_email_unique UNIQUE (email)
);

-- Speed up lookups by email (duplicate checks) and sorting by date
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_full_name ON leads (LOWER(full_name));
