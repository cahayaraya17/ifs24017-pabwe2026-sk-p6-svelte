<script>
  import { onMount } from "svelte";
  import { Pencil, Image, Plus, Trash2, ExternalLink, ArrowLeft, Link2 } from "lucide-svelte";
  import { authProfile } from "../../auth/states/authStore.js";
  import {
    linkTree,
    isDetailLoading,
    fetchLinkTree,
    deleteItem,
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
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ItemModal from "../modals/ItemModal.svelte";

  let { linkTreeId } = $props();

  let showChange = $state(false);
  let showCover = $state(false);
  let showItem = $state(false);
  let editingItem = $state(null);

  onMount(() => {
    linkTree.set(null);
    fetchLinkTree(linkTreeId);
  });

  function openAddItem() {
    editingItem = null;
    showItem = true;
  }

  function openEditItem(item) {
    editingItem = item;
    showItem = true;
  }

  async function handleDeleteItem(tree, item) {
    const confirmed = await showConfirmDialog(`Hapus tautan "${item.title}"?`);
    if (confirmed) await deleteItem(tree.id, item.id);
  }
</script>

<div class="space-y-5">
  <NavLink href="/" class="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-indigo-600">
    <ArrowLeft size={16} /> Semua Link Tree
  </NavLink>

  {#if $isDetailLoading}
    <h1 class="py-10 text-center text-base font-normal text-slate-600">Memuat data...</h1>
  {:else if !$linkTree}
    <h1 class="py-10 text-center text-base font-normal text-slate-600">Link tree tidak ditemukan.</h1>
  {:else}
    {@const tree = $linkTree}
    {@const isOwner = tree.user_id === $authProfile.id}
    {@const meta = TYPE_META[tree.type]}
    <section class="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      {#if hasImage(tree.cover)}
        <img src={resolveAssetUrl(tree.cover)} alt={`Sampul ${tree.title}`} class="h-48 w-full object-cover" />
      {:else}
        <div class="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <Link2 size={48} />
        </div>
      {/if}
      <div class="space-y-3 p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-extrabold">{tree.title}</h1>
            <span class="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold {meta.badge}">
              <meta.icon size={12} /> {meta.label}
            </span>
          </div>
          {#if isOwner}
            <div class="flex gap-2">
              <button
                type="button"
                onclick={() => (showChange = true)}
                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Pencil size={16} /> Ubah Data
              </button>
              <button
                type="button"
                onclick={() => (showCover = true)}
                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                <Image size={16} /> Ubah Sampul
              </button>
            </div>
          {/if}
        </div>
        <p class="text-slate-700">{tree.description}</p>
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <Avatar name={tree.author.name} photo={tree.author.photo} size="h-6 w-6" />
          <span>{tree.author.name}</span>
          <span>· dibuat {formatDate(tree.created_at)}</span>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">{`Daftar Tautan (${tree.items.length})`}</h2>
        {#if isOwner}
          <button
            type="button"
            onclick={openAddItem}
            class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={16} /> Tambah Tautan
          </button>
        {/if}
      </div>

      {#if tree.items.length === 0}
        <p class="rounded-2xl bg-white p-6 text-center text-slate-600 ring-1 ring-slate-200">
          Belum ada tautan.
        </p>
      {:else}
        <ul class="space-y-2">
          {#each tree.items as item (item.id)}
            <li class="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                class="min-w-0 flex-1 hover:text-indigo-600"
              >
                <p class="truncate font-semibold">{item.title}</p>
                <p class="flex items-center gap-1 truncate text-xs text-slate-600">
                  <ExternalLink size={12} /> {item.url}
                </p>
              </a>
              {#if isOwner}
                <div class="flex gap-1">
                  <button
                    type="button"
                    aria-label={`Ubah tautan ${item.title}`}
                    onclick={() => openEditItem(item)}
                    class="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus tautan ${item.title}`}
                    onclick={() => handleDeleteItem(tree, item)}
                    class="rounded-lg p-2 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    {#if showChange}
      <ChangeModal linkTree={tree} onclose={() => (showChange = false)} />
    {/if}
    {#if showCover}
      <ChangeCoverModal linkTreeId={tree.id} onclose={() => (showCover = false)} />
    {/if}
    {#if showItem}
      <ItemModal linkTreeId={tree.id} item={editingItem} onclose={() => (showItem = false)} />
    {/if}
  {/if}
</div>
