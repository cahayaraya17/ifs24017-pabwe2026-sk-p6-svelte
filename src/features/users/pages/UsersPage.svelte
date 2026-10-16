<script>
  import { onMount } from "svelte";
  import { usersStore } from "../states/usersStore";
  import { Search, Mail, Users, Calendar } from "lucide-svelte";
  import { formatDate } from "../../../helpers/toolsHelper";

  let searchQuery = "";
  let isLoading = true;

  onMount(async () => {
    try {
      if (typeof usersStore.asyncSetUsers === "function") {
        await usersStore.asyncSetUsers();
      }
    } catch (error) {
      console.error("Gagal memuat daftar pengguna:", error);
    } finally {
      isLoading = false;
    }
  });

  $: rawUsers = $usersStore?.users;
  $: list = Array.isArray(rawUsers)
    ? rawUsers.filter((user) => user && typeof user === "object")
    : [];

  $: isUsersLoading = isLoading && list.length === 0;

  $: query = searchQuery.trim().toLowerCase();

  $: filteredUsers = list.filter((user) => {
    const name = String(user.name ?? "").toLowerCase();
    const email = String(user.email ?? "").toLowerCase();

    return name.includes(query) || email.includes(query);
  });
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-1 border-b border-rose-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Semua Pengguna</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">Daftar akun pengguna yang terdaftar di dalam sistem.</p>
    </div>
    <span class="inline-flex items-center gap-1.5 self-start rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600 dark:border-pink-900/40 dark:bg-pink-950/30 dark:text-pink-300">
      <Users class="h-3.5 w-3.5" />
      {`Total: ${list.length} Pengguna`}
    </span>
  </div>

  <div class="relative max-w-md">
    <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-400" />
    <input
      type="text"
      placeholder="Cari berdasarkan nama atau email..."
      data-testid="search-user-input"
      bind:value={searchQuery}
      class="w-full rounded-xl border border-rose-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
    />
  </div>

  {#if isUsersLoading}
    <div class="flex items-center justify-center p-12 text-slate-400">
      <p class="text-sm">Memuat daftar pengguna...</p>
    </div>
  {:else if filteredUsers.length === 0}
    <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/30 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <Users class="h-10 w-10 text-pink-300" />
      <p class="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Tidak ada data pengguna ditemukan.</p>
      <p class="text-xs text-slate-400">Coba kata kunci pencarian yang lain.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filteredUsers as user (user.id)}
        <div class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-100 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-md hover:shadow-pink-500/5 dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-start gap-4">
            {#if user.photo}
              <img
                src={user.photo}
                alt={user.name}
                class="h-12 w-12 rounded-xl object-cover ring-2 ring-pink-100 group-hover:ring-pink-300 transition"
              />
            {:else}
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-base font-bold text-white shadow-inner">
                {user.name ? String(user.name).charAt(0).toUpperCase() : "U"}
              </div>
            {/if}

            <div class="min-w-0 flex-1">
              <h3 class="truncate text-sm font-bold text-slate-800 group-hover:text-pink-600 transition dark:text-slate-100">
                {user.name || "Pengguna"}
              </h3>
              <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500 dark:text-slate-400">
                <Mail class="h-3.5 w-3.5 shrink-0 text-pink-400" />
                <span class="truncate">{user.email}</span>
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-rose-50 pt-3 text-[11px] text-slate-400 dark:border-slate-800">
            <span class="font-mono text-pink-500/80">{`ID: #${user.id}`}</span>
            <span class="flex items-center gap-1">
              <Calendar class="h-3 w-3 text-slate-400" />
              {user.created_at ? formatDate(user.created_at) : "-"}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>