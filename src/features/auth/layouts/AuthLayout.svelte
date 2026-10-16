<script>
  import { Link2 } from "lucide-svelte";

  let { children } = $props();
</script>

<main class="flex min-h-screen items-center justify-center p-4">
  <div class="w-full max-w-md">
    <div class="mb-6 text-center">
      <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
        <Link2 size={28} />
      </div>
      <h1 class="text-2xl font-extrabold">Delcom Link Tree</h1>
      <p class="mt-1 text-sm text-slate-600">
        Kumpulkan semua tautan pentingmu dalam satu halaman, lalu bagikan ke siapa saja.
      </p>
    </div>
    <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {@render children()}
    </div>
  </div>
</main>
