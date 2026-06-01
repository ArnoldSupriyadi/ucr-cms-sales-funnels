-- ============================================================
-- UCR SALES FUNNEL — Reset Database Script
-- ⚠️  HATI-HATI: Script ini menghapus SEMUA data dan schema!
-- Gunakan HANYA di environment development.
-- ============================================================
-- Cara pakai:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Paste seluruh file ini → Klik Run
--   3. Setelah sukses, jalankan migration_001_init.sql
--   4. Lalu jalankan seeder.sql
--   5. Lalu jalankan seeder_leads.sql
-- ============================================================

BEGIN;

-- ============================================================
-- STEP 1: Drop semua tabel (urutan reverse FK)
-- ============================================================

DROP TABLE IF EXISTS ib_food_items        CASCADE;
DROP TABLE IF EXISTS ib_overhead_items    CASCADE;
DROP TABLE IF EXISTS ib                   CASCADE;
DROP TABLE IF EXISTS beo                  CASCADE;
DROP TABLE IF EXISTS loa_items            CASCADE;
DROP TABLE IF EXISTS loa                  CASCADE;
DROP TABLE IF EXISTS order_status_logs    CASCADE;
DROP TABLE IF EXISTS orders               CASCADE;
DROP TABLE IF EXISTS targets              CASCADE;
DROP TABLE IF EXISTS lead_contacts        CASCADE;
DROP TABLE IF EXISTS leads                CASCADE;
DROP TABLE IF EXISTS overhead_library     CASCADE;
DROP TABLE IF EXISTS menu_packages        CASCADE;
DROP TABLE IF EXISTS master_recipes       CASCADE;
DROP TABLE IF EXISTS users                CASCADE;
DROP TABLE IF EXISTS roles                CASCADE;

-- ============================================================
-- STEP 2: Drop custom ENUM types
-- ============================================================

DROP TYPE IF EXISTS order_status_enum  CASCADE;
DROP TYPE IF EXISTS loa_status_enum    CASCADE;
DROP TYPE IF EXISTS payment_status_enum CASCADE;
DROP TYPE IF EXISTS segmen_enum        CASCADE;

-- ============================================================
-- STEP 3: Drop custom functions & triggers
-- ============================================================

DROP FUNCTION IF EXISTS update_updated_at()        CASCADE;
DROP FUNCTION IF EXISTS handle_new_auth_user()     CASCADE;
DROP FUNCTION IF EXISTS get_my_role()              CASCADE;
DROP FUNCTION IF EXISTS is_admin_or_gm()           CASCADE;

-- Drop auth trigger (di schema auth, perlu akses service_role)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

COMMIT;

-- ============================================================
-- SELESAI. Lanjutkan dengan:
--   1. migration_001_init.sql
--   2. seeder.sql
--   3. seeder_leads.sql
--   4. Buat ulang user test di Supabase Auth dashboard
--   5. UPDATE users SET role_id = ... (lihat migration_001_init.sql bagian bawah)
-- ============================================================
