<script>
  import { onMount } from "svelte";
  import { users, isUsersLoading, fetchUsers } from "../states/userStore.js";
  import { formatDate } from "../../../helpers/toolsHelper.js";
  import Avatar from "../../common/components/Avatar.svelte";

  onMount(() => {
    fetchUsers();
  });
</script>

<div class="space-y-5">
  <h1 class="text-2xl font-extrabold">Pengguna</h1>

  {#if $isUsersLoading}
    <p class="py-10 text-center text-slate-600">Memuat data...</p>
  {:else if $users.length === 0}
    <p class="py-10 text-center text-slate-600">Belum ada pengguna.</p>
  {:else}
    <ul class="grid gap-3 sm:grid-cols-2">
      {#each $users as user (user.id)}
        <li class="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          <Avatar name={user.name} photo={user.photo} size="h-11 w-11" />
          <div class="min-w-0">
            <p class="truncate font-semibold">{user.name}</p>
            <p class="truncate text-sm text-slate-600">{user.email}</p>
            <p class="text-xs text-slate-600">Bergabung {formatDate(user.created_at)}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
