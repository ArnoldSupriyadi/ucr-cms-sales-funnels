-- ============================================================
-- UCR SALES FUNNEL — Migration 001: Initial Schema
-- Project: PT Umara Cipta Rasa (Umara Catering)
-- Version: 1.0.0
-- Tanggal: 2026-05-25
-- ============================================================
-- Cara pakai:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Paste seluruh file ini
--   3. Klik Run
--   4. Setelah sukses, jalankan seeder.sql lalu seeder_leads.sql
-- ============================================================

BEGIN;

-- ============================================================
-- SECTION 1: ENUM TYPES
-- ============================================================

CREATE TYPE segmen_enum AS ENUM (
  'Wedding',
  'Private',
  'Corporate',
  'BUMN',
  'Government'
);

CREATE TYPE order_status_enum AS ENUM (
  'Tentative',
  'Definite',
  'Actual',
  'Cancel'
);

CREATE TYPE loa_status_enum AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'sent',
  'final',
  'revised'
);

CREATE TYPE payment_status_enum AS ENUM (
  'unpaid',
  'partial',
  'paid'
);

-- ============================================================
-- SECTION 2: DOMAIN 1 — USERS & ROLES
-- ============================================================

CREATE TABLE roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(50) NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{}',
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE roles IS 'Role definitions. permissions is a jsonb map of feature→boolean. Super Admin manages via UI.';
COMMENT ON COLUMN roles.permissions IS 'Example: {"leads.create":true,"leads.view_all":false,"loa.approve":true}';

CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone               VARCHAR(30),
  jabatan             VARCHAR(100),
  signature_url       TEXT,
  role_id             UUID NOT NULL REFERENCES roles(id),
  is_active           BOOLEAN NOT NULL DEFAULT true,
  active_session_key  UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'App users. id mirrors auth.users(id) — created via Supabase Auth trigger.';
COMMENT ON COLUMN users.signature_url IS 'GM signature PNG/JPG uploaded once. pdf-lib overlays on approved LoA PDF.';
COMMENT ON COLUMN users.active_session_key IS 'UUID of the current valid session. Changes on every new login. Used to enforce single session.';

CREATE TABLE login_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_key     UUID NOT NULL,
  ip_address      VARCHAR(45),
  user_agent      TEXT,
  browser         VARCHAR(100),
  os              VARCHAR(100),
  logged_in_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  logged_out_at   TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true
);

COMMENT ON TABLE login_logs IS 'Audit log of all user logins. session_key matches users.active_session_key for the active session. is_active=false when logged out or kicked by new login.';

CREATE INDEX idx_login_logs_user_id    ON login_logs(user_id);
CREATE INDEX idx_login_logs_session    ON login_logs(session_key);
CREATE INDEX idx_login_logs_active     ON login_logs(user_id, is_active);

-- ============================================================
-- SECTION 3: DOMAIN 2 — LEADS & CONTACTS
-- ============================================================

CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name  VARCHAR(255) NOT NULL,
  address       TEXT,
  segmen        segmen_enum,
  line_business VARCHAR(100),
  sales_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE leads IS 'Prospect companies. One lead = one company. Multiple contacts via lead_contacts.';

CREATE TABLE lead_contacts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  name       VARCHAR(150) NOT NULL,
  position   VARCHAR(100),
  phone      VARCHAR(30),
  email      VARCHAR(255),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  notes      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE lead_contacts IS 'Contacts per lead (unlimited). is_primary=true → used as default PIC on LoA and BEO.';

-- Enforce max 1 primary contact per lead
CREATE UNIQUE INDEX uq_lead_contacts_primary
  ON lead_contacts(lead_id)
  WHERE is_primary = true;

-- ============================================================
-- SECTION 4: DOMAIN 3 — TARGETS
-- ============================================================

CREATE TABLE targets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year         SMALLINT NOT NULL,
  month        SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  total_target NUMERIC(15,2) NOT NULL CHECK (total_target > 0),
  segmen       segmen_enum,
  set_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (year, month, segmen)
);

COMMENT ON TABLE targets IS 'Monthly revenue targets set by GM. segmen NULL = company-wide target.';

-- ============================================================
-- SECTION 5: DOMAIN 4 — ORDERS
-- ============================================================

CREATE TABLE orders (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no               VARCHAR(30) NOT NULL UNIQUE,
  lead_id                 UUID NOT NULL REFERENCES leads(id),
  sales_id                UUID REFERENCES users(id) ON DELETE SET NULL,
  status                  order_status_enum NOT NULL DEFAULT 'Tentative',
  event_date              DATE NOT NULL,
  event_time              VARCHAR(50),
  event_name              VARCHAR(255),
  event_type              VARCHAR(100),
  venue                   TEXT,
  pax                     INTEGER NOT NULL CHECK (pax > 0),
  segmen                  segmen_enum,
  is_exception            BOOLEAN NOT NULL DEFAULT false,
  exception_reason        TEXT,
  exception_approved_by   UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE orders IS 'Event orders. Status flow: Tentative→Definite→Actual (terminal) or Cancel (terminal).';
COMMENT ON COLUMN orders.order_no IS 'Format: UCR-YYYYMM-XXX. Generated by app on creation.';
COMMENT ON COLUMN orders.is_exception IS 'True if order was made outside normal SOP (e.g. below minimum pax).';

CREATE TABLE order_status_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status_enum,
  to_status   order_status_enum NOT NULL,
  changed_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE order_status_logs IS 'Immutable audit log of all order status changes.';

-- Trigger: auto-update orders.updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SECTION 6: DOMAIN 5 — LOA (LETTER OF AGREEMENT)
-- ============================================================

CREATE TABLE loa (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
  doc_no            VARCHAR(50) NOT NULL UNIQUE,
  revision_no       SMALLINT NOT NULL DEFAULT 0,
  revision_reason   TEXT,
  status            loa_status_enum NOT NULL DEFAULT 'draft',

  -- Event detail
  setup_location    TEXT,

  -- Pricing fields
  service_charge_pct  NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  handling_fee_pct    NUMERIC(5,2) NOT NULL DEFAULT 15.00,
  discount            NUMERIC(15,2) NOT NULL DEFAULT 0,
  sub_total_1         NUMERIC(15,2) NOT NULL DEFAULT 0,
  service_charge_amt  NUMERIC(15,2) NOT NULL DEFAULT 0,
  sub_total_2         NUMERIC(15,2) NOT NULL DEFAULT 0,  -- = NET REVENUE
  pb1_amt             NUMERIC(15,2) NOT NULL DEFAULT 0,
  handling_fee_amt    NUMERIC(15,2) NOT NULL DEFAULT 0,
  grand_total         NUMERIC(15,2) NOT NULL DEFAULT 0,
  net_revenue         NUMERIC(15,2) NOT NULL DEFAULT 0,  -- = sub_total_2, used by IB

  -- Approval
  approved_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at       TIMESTAMPTZ,
  approval_token    VARCHAR(64) UNIQUE,
  token_expires_at  TIMESTAMPTZ,

  -- Document
  pdf_url           TEXT,
  created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE loa IS 'Letter of Agreement. 1:1 with order. net_revenue = sub_total_2, used as IB revenue base.';
COMMENT ON COLUMN loa.approval_token IS 'crypto.randomBytes(32).hex() one-time token sent via WA/Telegram to GM for inline approval.';
COMMENT ON COLUMN loa.net_revenue IS 'NET REVENUE = Sub Total 2. This is the value IB uses as revenue base.';

CREATE TABLE loa_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loa_id       UUID NOT NULL REFERENCES loa(id) ON DELETE CASCADE,
  order_date   DATE,
  package_name VARCHAR(255) NOT NULL,
  menu_detail  TEXT,
  price_per_pax NUMERIC(12,2) NOT NULL,
  pax          INTEGER NOT NULL CHECK (pax > 0),
  amount       NUMERIC(15,2) NOT NULL,
  sort_order   SMALLINT NOT NULL DEFAULT 0
);

COMMENT ON TABLE loa_items IS 'Line items on LoA. package_name can reference menu_packages but no FK (free text allowed). menu_detail is auto-generated from loa_item_selections.';

CREATE TABLE loa_item_selections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loa_item_id     UUID NOT NULL REFERENCES loa_items(id) ON DELETE CASCADE,
  component_name  VARCHAR(255) NOT NULL,
  occasion_no     SMALLINT NOT NULL DEFAULT 1,
  category_name   VARCHAR(255) NOT NULL,
  item_name       VARCHAR(255) NOT NULL,
  sort_order      SMALLINT NOT NULL DEFAULT 0
);

COMMENT ON TABLE loa_item_selections IS 'Snapshot of menu selections per loa_item. component_name e.g "Coffee Break", occasion_no for CB1 vs CB2. category_name e.g "Savoury","Soup","Beef". item_name is snapshot at LoA creation.';

-- ============================================================
-- SECTION 9 (MOVED UP): DOMAIN 8 — MASTER DATA
-- Must be created before Section 7 (IB) due to FK reference
-- from ib_food_items → master_recipes
-- ============================================================

CREATE TABLE master_recipes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku           VARCHAR(20) NOT NULL UNIQUE,
  product_name  VARCHAR(255) NOT NULL,
  menu_structure VARCHAR(100),
  segment_menu  VARCHAR(100),
  unit_size     NUMERIC(10,4),
  uom           VARCHAR(20),
  price_per_pax NUMERIC(12,4),  -- NULL for Batch/GR units, filled manually
  is_active     BOOLEAN NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE master_recipes IS '30 SKUs food cost master. price_per_pax NULL for Batch/GR units (filled manually by CC via UI).';

CREATE TABLE menu_packages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kategori        VARCHAR(100) NOT NULL,
  sub_kategori    VARCHAR(100),
  nama_paket      VARCHAR(255) NOT NULL,
  harga_per_pax   NUMERIC(12,2),
  harga_minimum   NUMERIC(12,2),
  harga_maksimum  NUMERIC(12,2),
  satuan          VARCHAR(50),
  has_selection   BOOLEAN NOT NULL DEFAULT false,
  is_best_seller  BOOLEAN NOT NULL DEFAULT false,
  ketentuan       TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE menu_packages IS 'Package catalog for LoA. kategori: Meeting Package|Buffet|Meal Box|Snack Box|Food Stall. has_selection=true means structured menu selection is available.';

CREATE TABLE menu_package_components (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id      UUID NOT NULL REFERENCES menu_packages(id) ON DELETE CASCADE,
  component_type  VARCHAR(100) NOT NULL,
  nama            VARCHAR(255) NOT NULL,
  qty             SMALLINT NOT NULL DEFAULT 1,
  sort_order      SMALLINT NOT NULL DEFAULT 0
);

COMMENT ON TABLE menu_package_components IS 'What is included in a package. e.g. Full Day = Coffee Break (qty=2) + Indonesian Buffet (qty=1). component_type links to menu_catalog_categories.';

CREATE TABLE menu_catalog_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type  VARCHAR(100) NOT NULL,
  nama            VARCHAR(255) NOT NULL,
  selection_rule  VARCHAR(20) NOT NULL DEFAULT 'multiple',
  parent_id       UUID REFERENCES menu_catalog_categories(id) ON DELETE CASCADE,
  sort_order      SMALLINT NOT NULL DEFAULT 0
);

COMMENT ON TABLE menu_catalog_categories IS 'Category groups per component_type. selection_rule: one=pick exactly 1 item, multiple=pick any number. parent_id for sub-groups (e.g. STARTERS > Appetizer, Soup).';

CREATE TABLE menu_catalog_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID NOT NULL REFERENCES menu_catalog_categories(id) ON DELETE CASCADE,
  nama            VARCHAR(255) NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      SMALLINT NOT NULL DEFAULT 0
);

COMMENT ON TABLE menu_catalog_items IS 'Individual menu items per category. Seeded from all 5 menu JSON files.';

CREATE TABLE overhead_library (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name       VARCHAR(255) NOT NULL UNIQUE,
  default_unit    VARCHAR(50),
  last_unit_price NUMERIC(12,2),
  usage_count     INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE overhead_library IS 'Grows organically from CC overhead input. Sorted by usage_count for autocomplete suggestions.';

-- ============================================================
-- SECTION 7: DOMAIN 6 — IB (INTERNAL BREAKDOWN)
-- ============================================================

CREATE TABLE ib (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loa_id              UUID NOT NULL UNIQUE REFERENCES loa(id) ON DELETE RESTRICT,
  revision_no         SMALLINT NOT NULL DEFAULT 1,
  revision_reason     TEXT,

  -- Costs
  total_food_cost     NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_overhead      NUMERIC(15,2) NOT NULL DEFAULT 0,
  grand_total_cogs    NUMERIC(15,2) NOT NULL DEFAULT 0,
  gross_profit        NUMERIC(15,2) NOT NULL DEFAULT 0,
  gp_pct              NUMERIC(6,2) NOT NULL DEFAULT 0,

  -- Optional suggest selling price block (null = hidden entirely)
  suggest_price       NUMERIC(15,2),
  suggest_net_revenue NUMERIC(15,2),
  suggest_gp          NUMERIC(15,2),
  suggest_gp_pct      NUMERIC(6,2),

  created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ib IS 'Internal Breakdown (P&L per order). Created by Cost Controller only, after LoA status=final.';

CREATE TABLE ib_food_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ib_id         UUID NOT NULL REFERENCES ib(id) ON DELETE CASCADE,
  recipe_id     UUID REFERENCES master_recipes(id) ON DELETE SET NULL,
  menu_name     VARCHAR(255) NOT NULL,
  pax           INTEGER NOT NULL CHECK (pax > 0),
  price_per_pax NUMERIC(12,4) NOT NULL,  -- SNAPSHOT at creation time
  total         NUMERIC(15,2) NOT NULL,
  pct_of_revenue NUMERIC(6,2),
  sort_order    SMALLINT NOT NULL DEFAULT 0
);

COMMENT ON TABLE ib_food_items IS 'Food cost items in IB. price_per_pax is SNAPSHOT from master_recipes at creation — does not update if recipe price changes.';

CREATE TABLE ib_overhead_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ib_id         UUID NOT NULL REFERENCES ib(id) ON DELETE CASCADE,
  item_name     VARCHAR(255) NOT NULL,
  qty           NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit          VARCHAR(50),
  unit_price    NUMERIC(12,2) NOT NULL,
  total         NUMERIC(15,2) NOT NULL,
  pct_of_revenue NUMERIC(6,2)
);

COMMENT ON TABLE ib_overhead_items IS 'Overhead items in IB. item_name suggestions come from overhead_library, sorted by usage_count.';

-- ============================================================
-- SECTION 8: DOMAIN 7 — BEO (BANQUET EVENT ORDER)
-- ============================================================

CREATE TABLE beo (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loa_id           UUID NOT NULL UNIQUE REFERENCES loa(id) ON DELETE RESTRICT,
  beo_no           VARCHAR(30) NOT NULL UNIQUE,
  revision_no      SMALLINT NOT NULL DEFAULT 1,
  revision_reason  TEXT,
  is_emergency     BOOLEAN NOT NULL DEFAULT false,

  -- Event operations detail
  person_incharge  VARCHAR(150),
  setup_date       DATE,
  setup_time       TIME,
  table_arrangement TEXT,
  banquet_notes    TEXT,
  transport_notes  TEXT,

  -- Billing
  total_billing    NUMERIC(15,2),
  payment_status   payment_status_enum NOT NULL DEFAULT 'unpaid',

  created_by       UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE beo IS 'Banquet Event Order. Can be created from Tentative. is_emergency=true = BEO Darurat (pre-Tentative, ops must reconfirm).';

-- ============================================================
-- SECTION 10: INDEXES (performance)
-- ============================================================

-- Leads
CREATE INDEX idx_leads_sales_id    ON leads(sales_id);
CREATE INDEX idx_leads_segmen      ON leads(segmen);
CREATE INDEX idx_leads_company     ON leads(company_name);

-- Lead contacts
CREATE INDEX idx_lead_contacts_lead_id ON lead_contacts(lead_id);

-- Orders
CREATE INDEX idx_orders_lead_id    ON orders(lead_id);
CREATE INDEX idx_orders_sales_id   ON orders(sales_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_event_date ON orders(event_date);
CREATE INDEX idx_orders_segmen     ON orders(segmen);

-- Order status logs
CREATE INDEX idx_osl_order_id ON order_status_logs(order_id);

-- LoA
CREATE INDEX idx_loa_booking_id     ON loa(booking_id);
CREATE INDEX idx_loa_status         ON loa(status);
CREATE INDEX idx_loa_approval_token ON loa(approval_token) WHERE approval_token IS NOT NULL;

-- IB
CREATE INDEX idx_ib_loa_id         ON ib(loa_id);
CREATE INDEX idx_ib_food_ib_id     ON ib_food_items(ib_id);
CREATE INDEX idx_ib_overhead_ib_id ON ib_overhead_items(ib_id);

-- BEO
CREATE INDEX idx_beo_loa_id ON beo(loa_id);

-- Master recipes
CREATE INDEX idx_master_recipes_sku ON master_recipes(sku);

-- Overhead library
CREATE INDEX idx_overhead_library_usage ON overhead_library(usage_count DESC);

-- Menu packages
CREATE INDEX idx_menu_packages_kategori   ON menu_packages(kategori);
CREATE INDEX idx_menu_pkg_components_pkg  ON menu_package_components(package_id);
CREATE INDEX idx_menu_catalog_cat_type    ON menu_catalog_categories(component_type);
CREATE INDEX idx_menu_catalog_cat_parent  ON menu_catalog_categories(parent_id);
CREATE INDEX idx_menu_catalog_items_cat   ON menu_catalog_items(category_id);

-- LoA item selections
CREATE INDEX idx_loa_item_sel_item_id ON loa_item_selections(loa_item_id);

-- Targets
CREATE INDEX idx_targets_year_month ON targets(year, month);

-- ============================================================
-- SECTION 11: ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE roles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_contacts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets             ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE loa                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE loa_items           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ib                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ib_food_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ib_overhead_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE beo                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_recipes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_packages              ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_package_components    ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_catalog_categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_catalog_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE loa_item_selections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE overhead_library           ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role name
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS TEXT AS $$
  SELECT r.name
  FROM users u
  JOIN roles r ON r.id = u.role_id
  WHERE u.id = auth.uid()
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if current user is admin/GM
CREATE OR REPLACE FUNCTION is_admin_or_gm()
RETURNS BOOLEAN AS $$
  SELECT get_my_role() IN ('Super Admin', 'GM');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- ROLES: readable by all authenticated users ----
CREATE POLICY "roles_select_all"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "roles_manage_superadmin"
  ON roles FOR ALL
  TO authenticated
  USING (get_my_role() = 'Super Admin');

-- ---- USERS: own profile + admin sees all ----
CREATE POLICY "login_logs_select_own"
  ON login_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_admin_or_gm());

CREATE POLICY "login_logs_insert"
  ON login_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "login_logs_update_own"
  ON login_logs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR is_admin_or_gm());

CREATE POLICY "users_select_own_or_admin"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_admin_or_gm());

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_manage_superadmin"
  ON users FOR ALL
  TO authenticated
  USING (get_my_role() = 'Super Admin');

-- ---- LEADS: sales sees own, admin/GM sees all ----
CREATE POLICY "leads_select"
  ON leads FOR SELECT
  TO authenticated
  USING (sales_id = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller');

CREATE POLICY "leads_insert_sales"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (sales_id = auth.uid() OR is_admin_or_gm());

CREATE POLICY "leads_update_sales"
  ON leads FOR UPDATE
  TO authenticated
  USING (sales_id = auth.uid() OR is_admin_or_gm());

-- ---- LEAD_CONTACTS: follows lead ownership ----
CREATE POLICY "lead_contacts_select"
  ON lead_contacts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_contacts.lead_id
        AND (l.sales_id = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller')
    )
  );

CREATE POLICY "lead_contacts_insert"
  ON lead_contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_contacts.lead_id
        AND (l.sales_id = auth.uid() OR is_admin_or_gm())
    )
  );

CREATE POLICY "lead_contacts_update"
  ON lead_contacts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_contacts.lead_id
        AND (l.sales_id = auth.uid() OR is_admin_or_gm())
    )
  );

-- ---- TARGETS: GM sets, all can read ----
CREATE POLICY "targets_select_all"
  ON targets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "targets_manage_gm"
  ON targets FOR ALL
  TO authenticated
  USING (is_admin_or_gm());

-- ---- ORDERS: sales sees own, admin/GM/CC sees all ----
CREATE POLICY "orders_select"
  ON orders FOR SELECT
  TO authenticated
  USING (sales_id = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller');

CREATE POLICY "orders_insert_sales"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (sales_id = auth.uid() OR is_admin_or_gm());

CREATE POLICY "orders_update"
  ON orders FOR UPDATE
  TO authenticated
  USING (sales_id = auth.uid() OR is_admin_or_gm());

-- ---- ORDER_STATUS_LOGS: read follows order, write by authenticated ----
CREATE POLICY "osl_select"
  ON order_status_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_status_logs.order_id
        AND (o.sales_id = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller')
    )
  );

CREATE POLICY "osl_insert"
  ON order_status_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ---- LOA: sales creates, GM approves, CC reads ----
CREATE POLICY "loa_select"
  ON loa FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller'
  );

CREATE POLICY "loa_insert_sales"
  ON loa FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid() OR is_admin_or_gm());

CREATE POLICY "loa_update"
  ON loa FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR is_admin_or_gm());

-- ---- LOA_ITEMS: follows loa ----
CREATE POLICY "loa_items_select"
  ON loa_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loa l
      WHERE l.id = loa_items.loa_id
        AND (l.created_by = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller')
    )
  );

CREATE POLICY "loa_items_insert"
  ON loa_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM loa l
      WHERE l.id = loa_items.loa_id
        AND (l.created_by = auth.uid() OR is_admin_or_gm())
    )
  );

CREATE POLICY "loa_items_update"
  ON loa_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loa l
      WHERE l.id = loa_items.loa_id
        AND (l.created_by = auth.uid() OR is_admin_or_gm())
    )
  );

-- ---- IB: Cost Controller creates/edits, GM/Admin reads ----
CREATE POLICY "ib_select"
  ON ib FOR SELECT
  TO authenticated
  USING (get_my_role() IN ('Super Admin', 'GM', 'Cost Controller'));

CREATE POLICY "ib_insert_cc"
  ON ib FOR INSERT
  TO authenticated
  WITH CHECK (get_my_role() IN ('Super Admin', 'Cost Controller'));

CREATE POLICY "ib_update_cc"
  ON ib FOR UPDATE
  TO authenticated
  USING (get_my_role() IN ('Super Admin', 'Cost Controller'));

-- ---- IB_FOOD_ITEMS + IB_OVERHEAD_ITEMS: follows ib ----
CREATE POLICY "ib_food_select"  ON ib_food_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM ib WHERE ib.id = ib_food_items.ib_id AND get_my_role() IN ('Super Admin','GM','Cost Controller')));
CREATE POLICY "ib_food_insert"  ON ib_food_items FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('Super Admin','Cost Controller'));
CREATE POLICY "ib_food_update"  ON ib_food_items FOR UPDATE TO authenticated
  USING (get_my_role() IN ('Super Admin','Cost Controller'));

CREATE POLICY "ib_overhead_select" ON ib_overhead_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM ib WHERE ib.id = ib_overhead_items.ib_id AND get_my_role() IN ('Super Admin','GM','Cost Controller')));
CREATE POLICY "ib_overhead_insert" ON ib_overhead_items FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('Super Admin','Cost Controller'));
CREATE POLICY "ib_overhead_update" ON ib_overhead_items FOR UPDATE TO authenticated
  USING (get_my_role() IN ('Super Admin','Cost Controller'));

-- ---- BEO: sales creates, all relevant roles read ----
CREATE POLICY "beo_select"
  ON beo FOR SELECT
  TO authenticated
  USING (created_by = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller');

CREATE POLICY "beo_insert_sales"
  ON beo FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid() OR is_admin_or_gm());

CREATE POLICY "beo_update"
  ON beo FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR is_admin_or_gm());

-- ---- MASTER DATA: read all authenticated, write only admin ----
CREATE POLICY "master_recipes_select"   ON master_recipes  FOR SELECT TO authenticated USING (true);
CREATE POLICY "master_recipes_manage"   ON master_recipes  FOR ALL    TO authenticated USING (get_my_role() = 'Super Admin');

CREATE POLICY "menu_packages_select"    ON menu_packages            FOR SELECT TO authenticated USING (true);
CREATE POLICY "menu_packages_manage"    ON menu_packages            FOR ALL    TO authenticated USING (get_my_role() = 'Super Admin');

CREATE POLICY "menu_pkg_comp_select"    ON menu_package_components  FOR SELECT TO authenticated USING (true);
CREATE POLICY "menu_pkg_comp_manage"    ON menu_package_components  FOR ALL    TO authenticated USING (get_my_role() = 'Super Admin');

CREATE POLICY "menu_cat_cat_select"     ON menu_catalog_categories  FOR SELECT TO authenticated USING (true);
CREATE POLICY "menu_cat_cat_manage"     ON menu_catalog_categories  FOR ALL    TO authenticated USING (get_my_role() = 'Super Admin');

CREATE POLICY "menu_cat_items_select"   ON menu_catalog_items       FOR SELECT TO authenticated USING (true);
CREATE POLICY "menu_cat_items_manage"   ON menu_catalog_items       FOR ALL    TO authenticated USING (get_my_role() = 'Super Admin');

CREATE POLICY "loa_item_sel_select"     ON loa_item_selections      FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items li JOIN loa l ON l.id = li.loa_id
    WHERE li.id = loa_item_selections.loa_item_id
      AND (l.created_by = auth.uid() OR is_admin_or_gm() OR get_my_role() = 'Cost Controller')));
CREATE POLICY "loa_item_sel_insert"     ON loa_item_selections      FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM loa_items li JOIN loa l ON l.id = li.loa_id
    WHERE li.id = loa_item_selections.loa_item_id
      AND (l.created_by = auth.uid() OR is_admin_or_gm())));
CREATE POLICY "loa_item_sel_delete"     ON loa_item_selections      FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items li JOIN loa l ON l.id = li.loa_id
    WHERE li.id = loa_item_selections.loa_item_id
      AND (l.created_by = auth.uid() OR is_admin_or_gm())));

CREATE POLICY "overhead_library_select" ON overhead_library FOR SELECT TO authenticated USING (true);
CREATE POLICY "overhead_library_manage" ON overhead_library FOR ALL    TO authenticated
  USING (get_my_role() IN ('Super Admin', 'Cost Controller'));

-- ============================================================
-- SECTION 12: DEFAULT ROLES (seed)
-- ============================================================

INSERT INTO roles (name, permissions, is_default) VALUES
  ('Super Admin', '{
    "leads.create": true, "leads.view_all": true, "leads.edit": true, "leads.delete": true,
    "orders.create": true, "orders.view_all": true, "orders.edit": true,
    "loa.create": true, "loa.view_all": true, "loa.approve": true,
    "ib.create": true, "ib.view_all": true,
    "beo.create": true, "beo.view_all": true,
    "reports.view": true, "targets.manage": true, "users.manage": true, "roles.manage": true,
    "master_data.manage": true
  }', true),
  ('GM', '{
    "leads.create": false, "leads.view_all": true, "leads.edit": false, "leads.delete": false,
    "orders.create": false, "orders.view_all": true, "orders.edit": false,
    "loa.create": false, "loa.view_all": true, "loa.approve": true,
    "ib.create": false, "ib.view_all": true,
    "beo.create": false, "beo.view_all": true,
    "reports.view": true, "targets.manage": true, "users.manage": false, "roles.manage": false,
    "master_data.manage": false
  }', true),
  ('Cost Controller', '{
    "leads.create": false, "leads.view_all": true, "leads.edit": false, "leads.delete": false,
    "orders.create": false, "orders.view_all": true, "orders.edit": false,
    "loa.create": false, "loa.view_all": true, "loa.approve": false,
    "ib.create": true, "ib.view_all": true,
    "beo.create": false, "beo.view_all": true,
    "reports.view": true, "targets.manage": false, "users.manage": false, "roles.manage": false,
    "master_data.manage": false
  }', true),
  ('Sales', '{
    "leads.create": true, "leads.view_all": false, "leads.edit": true, "leads.delete": false,
    "orders.create": true, "orders.view_all": false, "orders.edit": true,
    "loa.create": true, "loa.view_all": false, "loa.approve": false,
    "ib.create": false, "ib.view_all": false,
    "beo.create": true, "beo.view_all": false,
    "reports.view": true, "targets.manage": false, "users.manage": false, "roles.manage": false,
    "master_data.manage": false
  }', true);

-- ============================================================
-- SECTION 13: AUTH TRIGGER
-- Create users row automatically when someone signs up via Supabase Auth
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  sales_role_id UUID;
BEGIN
  SELECT id INTO sales_role_id FROM roles WHERE name = 'Sales' LIMIT 1;

  INSERT INTO users (id, name, email, role_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    sales_role_id
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();

COMMIT;

-- ============================================================
-- DONE. Next steps:
--   1. Run seeder.sql         → master_recipes + menu_packages
--   2. Run seeder_leads.sql   → leads + lead_contacts (1054 records)
--   3. Create first Super Admin user via Supabase Auth dashboard
--      then UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'Super Admin')
--      WHERE email = 'your@email.com';
-- ============================================================