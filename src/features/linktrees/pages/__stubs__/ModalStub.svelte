<script>
  import { createEventDispatcher } from "svelte";
  export let show = false;
  export let linkTree = null;
  export let linkTreeId = null;
  export let item = null;
  const dispatch = createEventDispatcher();
</script>

{#if show}
  <button type="button" data-testid="stub-close" on:click={() => dispatch("close")}>stub-close</button>
{/if}
