-- Tambah mode diskon (percent/flat) ke LoA.
-- Kolom `discount` lama tetap menyimpan hasil amount (dipakai IB/laporan).
ALTER TABLE loa
  ADD COLUMN discount_type  VARCHAR(10) NOT NULL DEFAULT 'flat'
    CHECK (discount_type IN ('percent','flat')),
  ADD COLUMN discount_value NUMERIC(15,2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN loa.discount_type IS 'percent = discount_value adalah %, flat = discount_value adalah Rupiah.';
COMMENT ON COLUMN loa.discount_value IS 'Nilai mentah diskon sesuai discount_type. Hasil amount disimpan di kolom discount.';
