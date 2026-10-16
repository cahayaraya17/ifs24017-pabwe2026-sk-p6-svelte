<script>
  import { createEventDispatcher } from "svelte";
  import { Plus, Check, X, LoaderCircle } from "lucide-svelte";
  import { asyncSetIsItemSave } from "../states/linkTreesStore";

  export let show = false;
  export let linkTreeId = "";
  export let item = null;

  const dispatch = createEventDispatcher();

  let title = "";
  let url = "";
  let isSubmitting = false;

  $: if (item) {
    title = item.title || "";
    url = item.url || "";
  } else {
    title = "";
    url = "";
  }

  function closeModal() {
    title = "";
    url = "";
    dispatch("close");
  }

  async function handleSubmit() {
    if (!title.trim() || !url.trim() || !linkTreeId) return;
    isSubmitting = true;
    const itemId = item ? item.id : "";
    const success = await asyncSetIsItemSave(linkTreeId, itemId, title, url);
    isSubmitting = false;
    if (success) {
      closeModal();
    }
  }
</script>

{#if show}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <div class="flex items-center justify-between border-b pb-3 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {item ? "Ubah Item Tautan" : "Tambah Item Tautan"}
        </h3>
        <button type="button" class="text-gray-400 hover:text-gray-500" on:click={closeModal} disabled={isSubmitting}>
          <X class="h-5 w-5" />
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-4">
        <div>
          <label for="item-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul Tautan</label>
          <input
            id="item-title"
            type="text"
            bind:value={title}
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Contoh: GitHub"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label for="item-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
          <input
            id="item-url"
            type="url"
            bind:value={url}
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="https://..."
            disabled={isSubmitting}
          />
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button
            type="button"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            on:click={closeModal}
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            {:else if item}
              <Check class="mr-2 h-4 w-4" />
              Simpan
            {:else}
              <Plus class="mr-2 h-4 w-4" />
              Tambah
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
