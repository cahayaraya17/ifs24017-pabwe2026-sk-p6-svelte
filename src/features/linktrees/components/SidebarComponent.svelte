<script>
  import { currentPath, navigate } from "../../../router";
  import { Link, Users, User, Heart } from "lucide-svelte";

  export let isSidebarOpen = false;
  export let onCloseMobile = () => {};

  function handleNav(e, path) {
    e.preventDefault();
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  }

  function handleBackdropClick() {
    if (onCloseMobile) onCloseMobile();
  }

  function handleBackdropKeydown(e) {
    if (e.key === "Escape" && onCloseMobile) {
      onCloseMobile();
    }
  }
</script>

{#if isSidebarOpen}
  <div
    data-testid="sidebar-backdrop"
    role="button"
    tabindex="0"
    class="fixed inset-0 z-40 bg-pink-950/20 backdrop-blur-xs lg:hidden transition-opacity cursor-pointer"
    on:click={handleBackdropClick}
    on:keydown={handleBackdropKeydown}
  ></div>
{/if}

<aside
  class="fixed lg:static top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-rose-100 bg-white/95 p-4 backdrop-blur-md transition-transform duration-300 dark:border-rose-950/30 dark:bg-slate-900/95 {isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
>
  <div class="space-y-6">
    <div class="px-3 pt-2">
      <p class="text-[11px] font-bold tracking-wider text-pink-400 uppercase">Menu Utama</p>
    </div>

    <nav class="space-y-1.5">
      <a
        href="/"
        on:click={(e) => handleNav(e, "/")}
        class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 {$currentPath === '/' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200 dark:shadow-none' : 'text-slate-600 hover:bg-rose-50 hover:text-pink-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-pink-400'}"
      >
        <Link class="h-4 w-4 shrink-0" />
        <span>Semua LinkTree</span>
      </a>

      <a
        href="/users"
        on:click={(e) => handleNav(e, "/users")}
        class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 {$currentPath === '/users' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200 dark:shadow-none' : 'text-slate-600 hover:bg-rose-50 hover:text-pink-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-pink-400'}"
      >
        <Users class="h-4 w-4 shrink-0" />
        <span>Semua Pengguna</span>
      </a>

      <a
        href="/profile"
        on:click={(e) => handleNav(e, "/profile")}
        class="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 {$currentPath === '/profile' ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200 dark:shadow-none' : 'text-slate-600 hover:bg-rose-50 hover:text-pink-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-pink-400'}"
      >
        <User class="h-4 w-4 shrink-0" />
        <span>Profil Saya</span>
      </a>
    </nav>
  </div>

  <div class="rounded-2xl border border-rose-100 bg-rose-50/70 p-3.5 text-center dark:border-rose-950/40 dark:bg-slate-800/60">
    <div class="flex items-center justify-center gap-1.5 text-xs font-medium text-pink-600 dark:text-pink-400">
      <Heart class="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
      <span>Delcom LinkTree</span>
    </div>
    <p class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Praktikum 6 PABWE (Svelte)</p>
  </div>
</aside>
