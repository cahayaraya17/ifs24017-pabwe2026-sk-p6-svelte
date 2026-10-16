<script>
  import { onMount } from "svelte";
  import { Plus, Search, Trash2, Link2 } from "lucide-svelte";
  import { authProfile } from "../../auth/states/authStore.js";
  import {
    linkTrees,
    isLoading,
    filterMine,
    fetchLinkTrees,
    deleteLinkTree,
    deleteAllLinkTrees,
  } from "../states/linkTreesStore.js";
  import { TYPE_META } from "../linkTreeTypes.js";
  import {
    showConfirmDialog,
    formatDate,
    resolveAssetUrl,
    hasImage,
  } from "../../../helpers/toolsHelper.js";
  import NavLink from "../../common/components/NavLink.svelte";
  import Avatar from "../../common/components/Avatar.svelte";
  import AddModal from "../modals/AddModal.svelte";

  let query = $state("");
  let showAdd = $state(false);

  const filtered = $derived(
    $linkTrees.filter((tree) =>
      `${tree.title} ${tree.description}`.toLowerCase().includes(query.toLowerCase())
    )
  );

  const countType = (type) => $linkTrees.filter((tree) => tree.type === type).length;
  const stats = $derived([
    { label: "Total", value: $linkTrees.length },
    { label: "Publik", value: countType("public") },
    { label: "Tidak Terdaftar", value: countType("unlisted") },
    { label: "Privat", value: countType("private") },
    { label: "Total Tautan", value: $linkTrees.reduce((sum, tree) => sum + tree.total_links, 0) },
  ]);

  onMount(() => {
    fetchLinkTrees();
  });

  function toggleMine(event) {
    filterMine.set(event.target.checked);
    fetchLinkTrees();
  }

  async function handleDelete(tree) {
    const confirmed = await showConfirmDialog(`Hapus link tree "${tree.title}"?`);
    if (confirmed) await deleteLinkTree(tree.id);
  }

  async function handleDeleteAll() {
    const confirmed = await showConfirmDialog(
      "Hapus SEMUA link tree milikmu? Tindakan ini tidak dapat dibatalkan."
    );
    if (confirmed) await deleteAllLinkTrees();
  }
</script>

<div class="space-y-5">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="text-2xl font-extrabold">Semua Link Tree</h1>
    <div class="flex gap-2">
      <button
        type="button"
        onclick={handleDeleteAll}
        class="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        <Trash2 size={16} /> Hapus Semua
      </button>
      <button
        type="button"
        onclick={() => (showAdd = true)}
        class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        <Plus size={16} /> Tambah
      </button>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
    {#each stats as stat (stat.label)}
      <div class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
        <p class="text-xs font-medium text-slate-600">{stat.label}</p>
        <p class="text-2xl font-extrabold">{stat.value}</p>
      </div>
    {/each}
  </div>

  <div class="flex flex-wrap items-center gap-4">
    <div class="relative min-w-60 flex-1">
      <Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
      <input
        type="search"
        placeholder="Cari link tree..."
        aria-label="Cari link tree"
        bind:value={query}
        class="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm"
      />
    </div>
    <label class="inline-flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" checked={$filterMine} onchange={toggleMine} />
      Milik saya
    </label>
  </div>

  {#if $isLoading}
    <p class="py-10 text-center text-slate-600">Memuat data...</p>
  {:else if filtered.length === 0}
    <p class="py-10 text-center text-slate-600">Belum ada link tree.</p>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filtered as tree (tree.id)}
        {@const meta = TYPE_META[tree.type]}
        <article class="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          {#if hasImage(tree.cover)}
            <img src={resolveAssetUrl(tree.cover)} alt={`Sampul ${tree.title}`} class="h-32 w-full object-cover" />
          {:else}
            <div class="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <Link2 size={36} />
            </div>
          {/if}
          <div class="space-y-2 p-4">
            <div class="flex items-start justify-between gap-2">
              <NavLink href={`/link-trees/${tree.id}`} class="font-bold hover:text-indigo-600">
                {tree.title}
              </NavLink>
              <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold {meta.badge}">
                <meta.icon size={12} /> {meta.label}
              </span>
            </div>
            <p class="line-clamp-2 text-sm text-slate-600">{tree.description}</p>
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <Avatar name={tree.author.name} photo={tree.author.photo} size="h-6 w-6" />
              <span>{tree.author.name}</span>
              <span>· {tree.total_links} tautan</span>
              <span>· {formatDate(tree.created_at)}</span>
            </div>
            {#if tree.user_id === $authProfile.id}
              <button
                type="button"
                aria-label={`Hapus ${tree.title}`}
                onclick={() => handleDelete(tree)}
                class="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
              >
                <Trash2 size={14} /> Hapus
              </button>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

{#if showAdd}
  <AddModal onclose={() => (showAdd = false)} />
{/if}
