<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";

  let { children } = $props();
</script>

<div class="min-h-screen">
  <Navbar />
  <div class="mx-auto flex max-w-6xl flex-col gap-4 p-4 md:flex-row">
    <Sidebar />
    <main class="min-w-0 flex-1">
      {@render children()}
    </main>
  </div>
</div>
