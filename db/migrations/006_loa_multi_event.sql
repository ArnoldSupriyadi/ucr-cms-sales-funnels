-- 006: Order rentang tanggal + rebuild struktur menu LoA jadi pohon multi-event.
-- Data LoA kosong saat migrasi → aman rebuild. Idempotent sebisa mungkin.
-- Spec: docs/superpowers/specs/2026-06-08-loa-menu-event-redesign-design.md

-- A) Order: tanggal selesai (event_date = mulai, tetap NOT NULL)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS event_date_end DATE;
COMMENT ON COLUMN orders.event_date_end IS 'Tanggal selesai event (rentang). NULL = 1 hari (sama dgn event_date).';

-- B) Buang struktur menu lama
DROP TABLE IF EXISTS loa_item_selections CASCADE;

-- C) loa_events: 1 baris per hari event dalam 1 LoA → tabel Waktu & Tempat
CREATE TABLE IF NOT EXISTS loa_events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loa_id         UUID NOT NULL REFERENCES loa(id) ON DELETE CASCADE,
  event_date     DATE,
  serving_time   TEXT,
  venue          TEXT,
  setup_location TEXT,
  pax            INTEGER,
  sort_order     SMALLINT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_loa_events_loa ON loa_events(loa_id);

-- D) loa_items = Header berharga (di bawah event). Rombak kolom (tabel kosong).
ALTER TABLE loa_items ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES loa_events(id) ON DELETE CASCADE;
ALTER TABLE loa_items ADD COLUMN IF NOT EXISTS keterangan TEXT;
ALTER TABLE loa_items RENAME COLUMN package_name TO name;
ALTER TABLE loa_items DROP COLUMN IF EXISTS order_date;
ALTER TABLE loa_items DROP COLUMN IF EXISTS menu_detail;
ALTER TABLE loa_items DROP COLUMN IF EXISTS price_per_pax;
CREATE INDEX IF NOT EXISTS idx_loa_items_event ON loa_items(event_id);

-- E) Sub-grup (opsional) di bawah Header
CREATE TABLE IF NOT EXISTS loa_subgroups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_id  UUID NOT NULL REFERENCES loa_items(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  keterangan TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_loa_subgroups_header ON loa_subgroups(header_id);

-- F) Item menu (di bawah Header, opsional di dalam sub-grup)
CREATE TABLE IF NOT EXISTS loa_menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_id    UUID NOT NULL REFERENCES loa_items(id) ON DELETE CASCADE,
  subgroup_id  UUID REFERENCES loa_subgroups(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  keterangan   TEXT,
  sort_order   SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_loa_menu_items_header ON loa_menu_items(header_id);

-- G) RLS: akses bila pemilik LoA induk atau admin/GM
ALTER TABLE loa_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE loa_subgroups  ENABLE ROW LEVEL SECURITY;
ALTER TABLE loa_menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS loa_events_all ON loa_events;
CREATE POLICY loa_events_all ON loa_events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa l WHERE l.id = loa_events.loa_id AND (l.created_by = auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa l WHERE l.id = loa_events.loa_id AND (l.created_by = auth.uid() OR is_admin_or_gm())));

DROP POLICY IF EXISTS loa_subgroups_all ON loa_subgroups;
CREATE POLICY loa_subgroups_all ON loa_subgroups FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_subgroups.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_subgroups.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())));

DROP POLICY IF EXISTS loa_menu_items_all ON loa_menu_items;
CREATE POLICY loa_menu_items_all ON loa_menu_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_menu_items.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id = h.loa_id WHERE h.id = loa_menu_items.header_id AND (l.created_by = auth.uid() OR is_admin_or_gm())));
