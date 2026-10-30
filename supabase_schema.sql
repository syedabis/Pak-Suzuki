-- ==============================================================================
-- PAK SUZUKI CARAVAN 2026 - PRODUCTION DATABASE SCHEMA
-- Compatible with Next.js Dashboard & React Native Mobile App
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SUPERVISORS / USERS TABLE
CREATE TABLE IF NOT EXISTS public.supervisors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'paksuzuki2026',
    name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'On-Ground Lead Supervisor',
    assigned_city TEXT NOT NULL DEFAULT 'Usta Muhammad',
    assigned_dealer TEXT NOT NULL DEFAULT 'Suzuki Jacobabad Motors',
    station_venue TEXT NOT NULL DEFAULT 'Grain Market Ground',
    region TEXT NOT NULL DEFAULT 'ROS',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed default admin & lead supervisor
INSERT INTO public.supervisors (email, name, employee_id, role, assigned_city, assigned_dealer, station_venue, region)
VALUES 
  ('admin@paksuzuki.com.pk', 'Pak Suzuki Admin', 'PSMC-ADM-001', 'System Administrator', 'Karachi', 'Pak Suzuki Motor Co.', 'Head Office', 'ROS'),
  ('gohar.ali@suzuki.com.pk', 'Gohar Ali', 'PSMC-SUP-108', 'On-Ground Lead Supervisor', 'Usta Muhammad', 'Suzuki Jacobabad Motors', 'Grain Market Ground', 'ROS')
ON CONFLICT (email) DO NOTHING;


-- 3. CUSTOMER INTERCEPTIONS (Quick-Logger)
CREATE TABLE IF NOT EXISTS public.customer_interceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id TEXT, -- local mobile id for idempotent offline auto-sync
    s_no SERIAL,
    name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    age INTEGER NOT NULL,
    contact_no TEXT NOT NULL,
    channel TEXT NOT NULL,
    city TEXT NOT NULL,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    supervisor_id UUID REFERENCES public.supervisors(id) ON DELETE SET NULL,
    supervisor_name TEXT,
    synced BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_interceptions_city ON public.customer_interceptions(city);
CREATE INDEX IF NOT EXISTS idx_interceptions_created_at ON public.customer_interceptions(created_at DESC);


-- 4. K-CARRY SURVEY RECORDS (10-Question Comprehensive Survey)
CREATE TABLE IF NOT EXISTS public.k_carry_surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id TEXT, -- local mobile id for offline auto-sync
    respondent_name TEXT NOT NULL,
    contact_no TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'ROS',
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    lead_status TEXT NOT NULL CHECK (lead_status IN ('Hot', 'Warm', 'Cold')),
    -- Section A
    main_occupation TEXT NOT NULL,
    main_requirement TEXT NOT NULL,
    current_vehicle TEXT NOT NULL,
    most_important_feature TEXT NOT NULL,
    biggest_transport_problem TEXT NOT NULL,
    -- Section B
    heard_about_kcarry_before TEXT NOT NULL,
    knows_replacement_for_ravi TEXT NOT NULL,
    suitable_replacement_for_ravi TEXT NOT NULL,
    reasonable_price_range TEXT NOT NULL,
    would_consider_buying TEXT NOT NULL,
    notes TEXT,
    supervisor_id UUID REFERENCES public.supervisors(id) ON DELETE SET NULL,
    supervisor_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_surveys_city ON public.k_carry_surveys(city);
CREATE INDEX IF NOT EXISTS idx_surveys_lead_status ON public.k_carry_surveys(lead_status);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON public.k_carry_surveys(created_at DESC);


-- 5. DAILY MASTER INQUIRY SHEETS (Caravan Station Daily Audit)
CREATE TABLE IF NOT EXISTS public.daily_master_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id TEXT,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    city TEXT NOT NULL,
    dealer TEXT NOT NULL,
    venue TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'ROS',
    customer_footfall INTEGER NOT NULL DEFAULT 0,
    timings TEXT NOT NULL DEFAULT '09:00 to 17:30',
    supervisor_og TEXT,
    supervisor_ps TEXT,
    -- 4W Models Breakdown (JSON Matrix of 7 models × 7 metrics)
    four_wheel_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Quick Totals
    every_test_drives INTEGER NOT NULL DEFAULT 0,
    k_carry_test_drives INTEGER NOT NULL DEFAULT 0,
    trade_in_evaluations INTEGER NOT NULL DEFAULT 0,
    -- Aftersales
    free_inspections INTEGER NOT NULL DEFAULT 0,
    free_oil_changes INTEGER NOT NULL DEFAULT 0,
    appointments_given INTEGER NOT NULL DEFAULT 0,
    genuine_parts_revenue_pkr NUMERIC NOT NULL DEFAULT 0,
    -- Ratings & Notes
    dealer_rating TEXT NOT NULL CHECK (dealer_rating IN ('Satisfactory', 'Good', 'Excellent')),
    supervisor_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_master_sheets_city ON public.daily_master_sheets(city);
CREATE INDEX IF NOT EXISTS idx_master_sheets_date ON public.daily_master_sheets(event_date DESC);


-- 6. ENABLE REALTIME BROADCASTING FOR ALL TABLES
-- This powers live WebSocket subscriptions on the web dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_interceptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.k_carry_surveys;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_master_sheets;

