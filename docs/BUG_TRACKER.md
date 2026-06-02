# Bug Tracker — UCR CMS Sales Funnels

Catat semua bug yang ditemukan di project ini. Setiap bug punya status, root cause, dan cara fix-nya.

---

## Format Pencatatan

```
### [BUG-XXX] Judul Bug
- **Tanggal:** YYYY-MM-DD
- **Status:** 🔴 Open | 🟡 In Progress | 🟢 Resolved
- **Area:** Auth / Proxy / Database / UI / API / dll
- **Gejala:** Apa yang terlihat oleh user
- **Root Cause:** Kenapa terjadi
- **Fix:** Apa yang dilakukan untuk menyelesaikannya
- **File yang diubah:** path/file.ts
```

---

## Daftar Bug

---

### [BUG-001] middleware.ts dan proxy.ts conflict — server crash saat start
- **Tanggal:** 2026-06-02
- **Status:** 🟢 Resolved
- **Area:** Proxy / Next.js Config
- **Gejala:** Server langsung crash dengan error `Unhandled Rejection: Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected.`
- **Root Cause:** Next.js 16 mengganti konvensi `middleware.ts` menjadi `proxy.ts`. Kedua file ada sekaligus karena migration tidak membersihkan file lama.
- **Fix:** Hapus `middleware.ts`. Semua logic sudah ada di `proxy.ts`.
- **File yang diubah:** `middleware.ts` (dihapus)

---

### [BUG-002] signOut() scope global — semua session user ikut terhapus
- **Tanggal:** 2026-06-02
- **Status:** 🟢 Resolved
- **Area:** Auth / Proxy
- **Gejala:** User login berhasil tapi langsung logout lagi. Loop tak berujung ke `/login?reason=session_expired`.
- **Root Cause:** `supabase.auth.signOut()` tanpa parameter menggunakan scope `'global'` (default di Supabase JS v2.106+). Setiap kali proxy mendeteksi tidak ada `ucr-sk` cookie, dia signOut semua session user di semua device — termasuk session yang baru saja dibuat saat login.
- **Fix:** Ganti semua `signOut()` di `proxy.ts` menjadi `signOut({ scope: 'local' })`.
- **File yang diubah:** `proxy.ts`

---

### [BUG-003] Proxy memblokir Server Action createSession
- **Tanggal:** 2026-06-02
- **Status:** 🟢 Resolved
- **Area:** Auth / Proxy
- **Gejala:** Login tidak berhasil, tidak ada error jelas, `createSession` tidak pernah jalan di terminal.
- **Root Cause:** Proxy melihat user sudah login dan path `/login` → redirect ke `/orders`. Tapi request itu sebenarnya adalah POST Server Action (`createSession`), bukan navigasi biasa. Akibatnya `createSession` diblokir sebelum sempat set cookie `ucr-sk`.
- **Fix:** Cek header `next-action` di proxy. Kalau itu Server Action request, skip redirect.
- **File yang diubah:** `proxy.ts`

---

### [BUG-004] getUser(jwt) gagal dengan "Auth session missing!"
- **Tanggal:** 2026-06-02
- **Status:** 🟢 Resolved
- **Area:** Auth / Server Action
- **Gejala:** Terminal error: `Token tidak valid: Auth session missing!` di `features/auth/actions.ts`.
- **Root Cause:** `createSession` memanggil `supabase.auth.getUser(tokens.access_token)`. Supabase server menolak karena `session_id` di dalam JWT sudah tidak aktif — akibat dari BUG-002 yang memanggil `signOut(global)` sebelum Server Action sempat jalan.
- **Fix:** Ganti `getUser(jwt)` menjadi `getUser()` (tanpa JWT) agar session dibaca dari cookie request yang masih fresh.
- **File yang diubah:** `features/auth/actions.ts`

---

### [BUG-005] Tabel login_logs tidak ada di database
- **Tanggal:** 2026-06-02
- **Status:** 🟢 Resolved
- **Area:** Database
- **Gejala:** Terminal error: `Could not find the table 'public.login_logs' in the schema cache`.
- **Root Cause:** Database pernah di-reset (`reset_database.sql`) tapi `migration_001_init.sql` tidak dijalankan ulang secara lengkap. Tabel `login_logs` tidak terbuat.
- **Fix:** Jalankan SQL berikut di Supabase SQL Editor:
  ```sql
  CREATE TABLE IF NOT EXISTS login_logs (
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
  ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "login_logs_insert" ON login_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
  CREATE POLICY "login_logs_select_own" ON login_logs FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin_or_gm());
  CREATE POLICY "login_logs_update_own" ON login_logs FOR UPDATE TO authenticated USING (user_id = auth.uid() OR is_admin_or_gm());
  ```
- **File yang diubah:** Database (Supabase SQL Editor)

---

### [BUG-006] Kolom active_session_key tidak ada di tabel users
- **Tanggal:** 2026-06-02
- **Status:** 🟢 Resolved
- **Area:** Database
- **Gejala:** Login tampak berhasil (tidak ada error), tapi user langsung diarahkan balik ke halaman login. Tidak ada toast error.
- **Root Cause:** Kolom `active_session_key` tidak ada di tabel `users` karena migration dijalankan tidak lengkap. Akibatnya:
  1. `UPDATE users SET active_session_key = ...` di `createSession` silent fail (0 rows updated, tidak ada error)
  2. Cookie `ucr-sk` ter-set di browser dengan nilai baru
  3. Proxy cek `active_session_key` di DB → null, tidak cocok dengan cookie → redirect ke login
- **Fix:** Jalankan di Supabase SQL Editor:
  ```sql
  ALTER TABLE public.users ADD COLUMN active_session_key UUID;
  ```
- **File yang diubah:** Database (Supabase SQL Editor)

---

## Statistik

| Status | Jumlah |
|--------|--------|
| 🟢 Resolved | 6 |
| 🟡 In Progress | 0 |
| 🔴 Open | 0 |
| **Total** | **6** |
