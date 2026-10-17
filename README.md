# Delcom Link Tree (Svelte 5 + Vite, JavaScript)

Studi Kasus 1 — Praktikum 6 PABWE 2026.

## Menjalankan
```bash
bun install
bun run dev              # http://localhost:3004
bun run test:coverage    # threshold 100%
bun run build && bun run preview
```
Jangan gunakan `bun test`; gunakan `bun run test` atau `bun x vitest run`.

## Struktur
- `src/features/auth` — login, register, logout (`authStore.js`)
- `src/features/users` — daftar pengguna, profil, foto, kata sandi
- `src/features/linktrees` — API, `linkTreesStore.js`, layout, navbar, sidebar, modal, halaman
- `src/features/common` — 404 + komponen bersama (NavLink, Avatar, Modal)
- `src/router.js` — router kustom (History API)

## Deploy ke Vercel
- `vercel.json` mengarahkan semua path ke `index.html` (SPA), jadi `/auth/login`
  dan `/link-trees/4` bisa dibuka langsung / di-refresh.
- Karena `.env` ada di `.gitignore`, tambahkan environment variable di dashboard Vercel
  (Settings → Environment Variables): `VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1`,
  lalu redeploy. Tanpa ini aplikasi memakai `http://localhost:8000/api/v1`.
- Build command: `bun run build`, output directory: `dist`.
## update