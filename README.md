# Delcom Link Tree (Svelte 5 + Vite, JavaScript)

ifs24017 - Studi Kasus 1, Praktikum 6 PABWE 2026.

## Menjalankan
```bash
bun install
bun run dev              # http://localhost:3004
bun run test:coverage    # threshold 100%
bun run build && bun run preview
```
Jangan gunakan `bun test`; gunakan `bun run test` atau `bun x vitest run`.

## Struktur
- `src/features/auth` - login, register, logout (`authStore.js`)
- `src/features/users` - daftar pengguna, profil, foto, kata sandi
- `src/features/linktrees` - API, `linkTreesStore.js`, layout, navbar, sidebar, modal, halaman
- `src/features/common` - halaman 404
- `src/router.js` - router kustom (History API)

## Environment
Salin `.env.example` menjadi `.env`, lalu atur `VITE_DELCOM_BASEURL`.
Tanpa itu aplikasi memakai `https://open-api.delcom.org/api/v1`.

## CI/CD
`Jenkinsfile`: Install, Test (coverage), Trivy, SonarQube, Quality Gate, Package, Publish, Deploy.
Konfigurasi Sonar ada di `sonar-project.properties`.

## Proxy API (production)
Build production mengirim request API ke `/delcom-api/...` (satu origin dengan situs),
lalu `vercel.json` meneruskannya ke `https://open-api.delcom.org/api/v1/...`.
Dengan begitu tidak ada request lintas-origin (CORS/preflight) dari browser.
Saat `dev`/test, aplikasi tetap memanggil `VITE_DELCOM_BASEURL` secara langsung;
`bun run preview` memakai proxy bawaan Vite untuk `/delcom-api`.

## Deploy ke Vercel
`vercel.json` memproxy `/delcom-api` dan mengarahkan path lain ke `index.html` (SPA), jadi `/auth/login`
dan `/link-trees/4` bisa dibuka langsung / di-refresh.
Build command: `bun run build`, output directory: `dist`.
