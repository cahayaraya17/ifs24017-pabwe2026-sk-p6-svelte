<script>
  import { Link2 } from "lucide-svelte";
  import NavLink from "../components/NavLink.svelte";
</script>

<main class="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
  <Link2 size={48} class="text-indigo-600" />
  <h1 class="text-5xl font-extrabold text-slate-900">404</h1>
  <p class="text-slate-600">Halaman yang kamu cari tidak ditemukan.</p>
  <NavLink
    href="/"
    class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
  >
    Kembali ke Beranda
  </NavLink>
</main>
