<script>
  import Modal from "../../common/components/Modal.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import { TYPE_OPTIONS } from "../linkTreeTypes.js";
  import { changeLinkTree, isChanging } from "../states/linkTreesStore.js";

  let { linkTree, onclose, options = TYPE_OPTIONS } = $props();

  // svelte-ignore state_referenced_locally
  const title = useInput(linkTree.title);
  // svelte-ignore state_referenced_locally
  const type = useInput(linkTree.type);
  // svelte-ignore state_referenced_locally
  const description = useInput(linkTree.description);

  async function submit(event) {
    event.preventDefault();
    if (!$title.trim()) {
      await showWarningDialog("Judul wajib diisi");
      return;
    }
    const ok = await changeLinkTree(linkTree.id, {
      title: $title.trim(),
      type: $type,
      description: $description,
    });
    if (ok) onclose();
  }
</script>

<Modal title="Ubah Link Tree" {onclose}>
  <form onsubmit={submit} class="space-y-4">
    <div>
      <label for="change-title" class="mb-1 block text-sm font-medium">Judul</label>
      <input
        id="change-title"
        type="text"
        value={$title}
        oninput={title.onChange}
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
    <div>
      <label for="change-type" class="mb-1 block text-sm font-medium">Tipe</label>
      <select
        id="change-type"
        value={$type}
        onchange={type.onChange}
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      >
        {#each options as option (option.value)}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="change-description" class="mb-1 block text-sm font-medium">Deskripsi</label>
      <textarea
        id="change-description"
        rows="3"
        value={$description}
        oninput={description.onChange}
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      ></textarea>
    </div>
    <button
      type="submit"
      disabled={$isChanging}
      class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {$isChanging ? "Menyimpan..." : "Simpan Perubahan"}
    </button>
  </form>
</Modal>
