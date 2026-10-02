# Identifikasi Pengelolaan Data Peserta Didik di Satuan Pendidikan (SMA, 2026)

Frontend alat bantu lapangan Direktorat SMA, Kemendikdasmen. Vite + React + Tailwind + Recharts. Backend: Google Apps Script Web App.

## Menjalankan
```
npm install
cp .env.example .env.local     # isi VITE_API_URL dengan URL Web App (berakhiran /exec)
npm run dev
```
Tanpa backend asli: `npm run mock` (port 8787, data sintetis), lalu isi `VITE_API_URL=http://localhost:8787/exec`.

## Deploy ke Vercel
1. Push repo ke GitHub, impor di Vercel (framework Vite).
2. Settings, Environment Variables: `VITE_API_URL` = URL Web App. Redeploy setelah mengubahnya.
3. Build `vite build`, output `dist`. `vercel.json` sudah memuat rewrite agar `/dashboard` bisa dibuka langsung.

## Struktur: satu menu, satu folder
```
src/
  app/            App, Layout, routes.jsx (daftar menu), BootGate, RequireSession
  core/           api/, context/, hooks/, lib/, validate/   (dipakai semua menu)
  ui/             komponen dasar bersama (Button, Field, Dialog, Combobox, ...)
  features/
    beranda/      pilih petugas, daftar lokus, tambah sekolah, dialog mulai
    dukung/       data dukung (grafik tren, angka besar, kualitas, bahan pendalaman)
    wawancara/    wizard; steps/ berisi satu file per langkah + registry steps/index.js
    tinjau/       ringkasan, daftar masalah, kirim, penanganan galat
    sukses/       layar berhasil
    dashboard/    kartu, progres, filter, tabel, sekolah tambahan
```

## Di mana mengubah apa
| Keperluan | File |
|---|---|
| Tambah menu baru | folder baru di `features/`, satu baris di `app/routes.jsx` |
| Ubah tampilan satu menu | hanya folder menu itu |
| Tambah atau ubah langkah wizard | `features/wawancara/steps/` + daftar di `steps/index.js` |
| Aturan validasi | `core/validate/` (satu file per bagian: identitas, status, butir, dukung) |
| Bentuk payload submit | `core/lib/payload.js` |
| Pemetaan respons `sesi` ke form | `core/lib/sesiMapper.js` |
| Format data butir (no_butir, kode) | `core/lib/instrumen.js` |
| Endpoint API | `core/api/endpoints.js` (fetch hanya di `core/api/client.js`) |
| Warna dan font | `src/index.css` (`@theme`) |

## Perilaku penting
- Tanpa login. Petugas memilih nama; pilihan diingat di localStorage.
- Isian diketik tersimpan otomatis per sekolah di perangkat (`ipd:draft:*`), dihapus hanya setelah server membalas `ok:true`.
- "Berhasil" hanya ditampilkan bila `ok:true`. Galat jaringan, timeout, atau respons non-JSON dianggap gagal; isian tetap utuh.
- Bootstrap, status, dan data dukung disalin ke localStorage sebagai cadangan baca saat sinyal putus.
- Butir 15 disembunyikan bila S2 sama dengan PD BOSP 2027, lalu dikirim sebagai `tidak ditanyakan`.
