<script>
  import Modal from "../../common/components/Modal.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import { TYPE_OPTIONS } from "../linkTreeTypes.js";
  import { addLinkTree, isAdding } from "../states/linkTreesStore.js";

  let { onclose, options = TYPE_OPTIONS } = $props();

  const title = useInput("");
  const type = useInput("public");
  const description = useInput("");

  async function submit(event) {
    event.preventDefault();
    if (!$title.trim()) {
      await showWarningDialog("Judul wajib diisi");
      return;
    }
    const ok = await addLinkTree({
      title: $title.trim(),
      type: $type,
      description: $description,
    });
    if (ok) onclose();
  }
</script>

<Modal title="Tambah Link Tree" {onclose}>
  <form onsubmit={submit} class="space-y-4">
    <div>
      <label for="add-title" class="mb-1 block text-sm font-medium">Judul</label>
      <input
        id="add-title"
        type="text"
        value={$title}
        oninput={title.onChange}
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
    <div>
      <label for="add-type" class="mb-1 block text-sm font-medium">Tipe</label>
      <select
        id="add-type"
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
      <label for="add-description" class="mb-1 block text-sm font-medium">Deskripsi</label>
      <textarea
        id="add-description"
        rows="3"
        value={$description}
        oninput={description.onChange}
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      ></textarea>
    </div>
    <button
      type="submit"
      disabled={$isAdding}
      class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {$isAdding ? "Menyimpan..." : "Simpan"}
    </button>
  </form>
</Modal>
