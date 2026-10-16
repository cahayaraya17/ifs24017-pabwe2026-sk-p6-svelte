<script>
  import { createEventDispatcher } from "svelte";
  import { X, LoaderCircle, Check } from "lucide-svelte";
  import { asyncSetIsLinkTreeChange } from "../states/linkTreesStore";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";

  export let show = false;
  export let linkTree = null;
  const dispatch = createEventDispatcher();

  let title = "";
  let type = "public";
  let description = "";
  let isSubmitting = false;

  $: if (linkTree) {
    title = linkTree.title || "";
    type = linkTree.type || "public";
    description = linkTree.description || "";
  }

  function closeModal() {
    dispatch("close");
  }

  async function handleSubmit() {
    if (!title.trim() || !linkTree?.id) return;
    isSubmitting = true;
    const success = await asyncSetIsLinkTreeChange(linkTree.id, title, type, description);
    isSubmitting = false;
    if (success) {
      closeModal();
    }
  }
</script>

{#if show && linkTree}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <div class="flex items-center justify-between border-b pb-3 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ubah Link Tree</h3>
        <button type="button" class="text-gray-400 hover:text-gray-500" on:click={closeModal}>
          <X class="h-5 w-5" />
        </button>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="mt-4 space-y-4">
        <div>
          <label for="change-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
          <input
            id="change-title"
            type="text"
            bind:value={title}
            required
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Judul Link Tree"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label for="change-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe</label>
          <select
            id="change-type"
            bind:value={type}
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          >
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label for="change-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
          <MarkdownEditor bind:value={description} placeholder="Deskripsi Link Tree..." />
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
            {:else}
              <Check class="mr-2 h-4 w-4" />
              Simpan Perubahan
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
