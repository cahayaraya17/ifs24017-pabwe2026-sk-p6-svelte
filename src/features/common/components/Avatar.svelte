<script>
  import { resolveAssetUrl, hasImage } from "../../../helpers/toolsHelper.js";

  let { name, photo, size = "h-9 w-9" } = $props();

  const src = $derived(resolveAssetUrl(photo));
  const initial = $derived(name.charAt(0).toUpperCase());
</script>

{#if hasImage(src)}
  <img {src} alt="" class="{size} rounded-full object-cover" />
{:else}
  <span
    aria-hidden="true"
    data-testid="avatar-initial"
    class="{size} inline-flex items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700"
  >{initial}</span>
{/if}
