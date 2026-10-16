<script>
  import Modal from "../../common/components/Modal.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import { addItem, changeItem, isItemMutating } from "../states/linkTreesStore.js";

  let { linkTreeId, item, onclose } = $props();

  // nilai awal dibaca lewat closure: modal dipasang ulang tiap dibuka
  const initial = (field) => (item ? item[field] : "");

  const title = useInput(initial("title"));
  const url = useInput(initial("url"));

  async function submit(event) {
    event.preventDefault();
    if (!$title.trim() || !$url.trim()) {
      await showWarningDialog("Judul dan URL wajib diisi");
      return;
    }
    const payload = { title: $title.trim(), url: $url.trim() };
    const ok = item
      ? await changeItem(linkTreeId, item.id, payload)
      : await addItem(linkTreeId, payload);
    if (ok) onclose();
  }
</script>

<Modal title={item ? "Ubah Tautan" : "Tambah Tautan"} {onclose}>
  <form onsubmit={submit} class="space-y-4">
    <div>
      <label for="item-title" class="mb-1 block text-sm font-medium">Judul Tautan</label>
      <input
        id="item-title"
        type="text"
        value={$title}
        oninput={title.onChange}
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
    <div>
      <label for="item-url" class="mb-1 block text-sm font-medium">URL</label>
      <input
        id="item-url"
        type="url"
        placeholder="https://"
        value={$url}
        oninput={url.onChange}
        class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
    <button
      type="submit"
      disabled={$isItemMutating}
      class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {$isItemMutating ? "Menyimpan..." : "Simpan"}
    </button>
  </form>
</Modal>
