<script>
  import Modal from "../../common/components/Modal.svelte";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import { changeCover, isChangingCover } from "../states/linkTreesStore.js";

  let { linkTreeId, onclose } = $props();

  let file = $state(null);

  function pick(event) {
    file = event.target.files[0];
  }

  async function submit(event) {
    event.preventDefault();
    if (!file) {
      await showWarningDialog("Pilih gambar sampul terlebih dahulu");
      return;
    }
    const ok = await changeCover(linkTreeId, file);
    if (ok) onclose();
  }
</script>

<Modal title="Ubah Sampul" {onclose}>
  <form onsubmit={submit} class="space-y-4">
    <div>
      <label for="cover-file" class="mb-1 block text-sm font-medium">Gambar Sampul</label>
      <input
        id="cover-file"
        type="file"
        accept="image/*"
        onchange={pick}
        class="w-full text-sm"
      />
    </div>
    <button
      type="submit"
      disabled={$isChangingCover}
      class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {$isChangingCover ? "Mengunggah..." : "Unggah"}
    </button>
  </form>
</Modal>
