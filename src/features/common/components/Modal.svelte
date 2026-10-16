<script>
  import { X } from "lucide-svelte";

  let { title, onclose, children } = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <button
    type="button"
    aria-label="Tutup modal"
    class="absolute inset-0 bg-slate-900/50"
    onclick={onclose}
  ></button>
  <div
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-bold">{title}</h2>
      <button
        type="button"
        aria-label="Tutup"
        class="rounded-lg p-1 text-slate-600 hover:bg-slate-100"
        onclick={onclose}
      >
        <X size={18} />
      </button>
    </div>
    {@render children()}
  </div>
</div>
