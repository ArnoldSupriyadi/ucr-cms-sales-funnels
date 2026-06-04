-- 1) Tipe & kategori order (klasifikasi + penentu service charge)
ALTER TABLE orders
  ADD COLUMN order_type     VARCHAR(20)
    CHECK (order_type IN ('Package','Event')),
  ADD COLUMN order_category VARCHAR(50);

COMMENT ON COLUMN orders.order_type IS 'Package (SC 5%) | Event (SC 10%). Menentukan service charge LoA.';
COMMENT ON COLUMN orders.order_category IS 'Sub-kategori sesuai tipe (Box Package, Gift Box, Meeting/Open House, dst). Klasifikasi saja.';

-- 2) Handling fee flat/percent di LoA (mirror discount_type/value)
ALTER TABLE loa
  ADD COLUMN handling_fee_type  VARCHAR(10) NOT NULL DEFAULT 'percent'
    CHECK (handling_fee_type IN ('percent','flat')),
  ADD COLUMN handling_fee_value NUMERIC(15,2) NOT NULL DEFAULT 0;

COMMENT ON COLUMN loa.handling_fee_type IS 'percent = value adalah %, flat = value adalah Rupiah.';
COMMENT ON COLUMN loa.handling_fee_value IS 'Nilai mentah handling fee. Hasil amount di handling_fee_amt; handling_fee_pct lama tetap diisi utk kompatibilitas.';
