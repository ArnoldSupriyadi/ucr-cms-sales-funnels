-- 008: Tambah level Section (Komponen) antara Header (loa_items) & Sub-kategori (loa_subgroups).
-- Untuk prefill paket 3-level: Header → Section(Coffee Break/Buffet) → Sub-kategori → Item.
-- Additive & aman (tak merusak kode lama). Data LOA kosong. Idempotent.
-- Spec: docs/superpowers/specs/2026-06-09-loa-package-prefill-3level-design.md

CREATE TABLE IF NOT EXISTS loa_sections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_id  UUID NOT NULL REFERENCES loa_items(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  keterangan TEXT,
  sort_order SMALLINT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_loa_sections_header ON loa_sections(header_id);

-- Sub-kategori kini di bawah Section
ALTER TABLE loa_subgroups  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES loa_sections(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_loa_subgroups_section ON loa_subgroups(section_id);

-- Item bisa langsung di Section juga
ALTER TABLE loa_menu_items ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES loa_sections(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_loa_menu_items_section ON loa_menu_items(section_id);

ALTER TABLE loa_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS loa_sections_all ON loa_sections;
CREATE POLICY loa_sections_all ON loa_sections FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id=h.loa_id WHERE h.id=loa_sections.header_id AND (l.created_by=auth.uid() OR is_admin_or_gm())))
  WITH CHECK (EXISTS (SELECT 1 FROM loa_items h JOIN loa l ON l.id=h.loa_id WHERE h.id=loa_sections.header_id AND (l.created_by=auth.uid() OR is_admin_or_gm())));
