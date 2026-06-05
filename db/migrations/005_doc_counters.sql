-- 005: Counter atomik untuk penomoran dokumen (order_no / doc_no LoA)
-- Tujuan: hilangkan duplicate-key & race condition pada generate nomor.
-- Nomor TIDAK lagi dihitung dari MAX(order_no) (kena RLS + tidak atomik),
-- melainkan dari counter terpisah yang di-increment atomik per prefix-tahun.
-- Idempotent: aman dijalankan ulang.

-- 1) Tabel counter: 1 baris per prefix-tahun, mis. 'UCR-2026', 'LOA-2026'
CREATE TABLE IF NOT EXISTS doc_counters (
  prefix   TEXT PRIMARY KEY,
  last_seq INTEGER NOT NULL DEFAULT 0
);

COMMENT ON TABLE doc_counters IS 'Counter atomik penomoran dokumen. prefix = PREFIX-YYYY (UCR-2026, LOA-2026). Hanya diakses via service_role (RLS deny utk anon/authenticated).';

-- RLS: aktif tanpa policy → anon/authenticated DENY; service_role (admin client) bypass.
ALTER TABLE doc_counters ENABLE ROW LEVEL SECURITY;

-- 2) Fungsi atomik: tambah 1 lalu kembalikan nilainya dalam satu statement.
--    ON CONFLICT DO UPDATE ... RETURNING = atomik (row lock) → request konkuren antre,
--    tidak mungkin dapat angka sama.
-- SET search_path = '' + nama tabel di-qualify → cegah search_path hijacking (advisor 0011).
CREATE OR REPLACE FUNCTION next_doc_seq(p_prefix TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v INTEGER;
BEGIN
  INSERT INTO public.doc_counters (prefix, last_seq)
  VALUES (p_prefix, 1)
  ON CONFLICT (prefix)
    DO UPDATE SET last_seq = public.doc_counters.last_seq + 1
  RETURNING last_seq INTO v;
  RETURN v;
END;
$$;

-- 3) Seed dari data yang sudah ada: set counter = nomor terakhir per prefix-tahun,
--    supaya penomoran LANJUT (bukan mulai ulang dari 1). Idempotent: hanya isi bila belum ada.
INSERT INTO doc_counters (prefix, last_seq)
SELECT LEFT(order_no, 8), MAX(split_part(order_no, '-', 3)::int)
FROM orders
WHERE order_no ~ '^UCR-\d{4}-\d+$'
GROUP BY LEFT(order_no, 8)
ON CONFLICT (prefix) DO NOTHING;

INSERT INTO doc_counters (prefix, last_seq)
SELECT LEFT(doc_no, 8), MAX(split_part(doc_no, '-', 3)::int)
FROM loa
WHERE doc_no ~ '^LOA-\d{4}-\d+$'
GROUP BY LEFT(doc_no, 8)
ON CONFLICT (prefix) DO NOTHING;

-- Catatan reset UAT: untuk mulai nomor dari 0001 lagi setelah hapus data transaksi,
-- jalankan juga: DELETE FROM doc_counters;  (atau UPDATE doc_counters SET last_seq = 0;)
