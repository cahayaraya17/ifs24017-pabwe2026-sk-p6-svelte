<script>
  import { onMount } from "svelte";
  import { navigate } from "../../../router";
  import apiHelper from "../../../helpers/apiHelper";
  import { usersStore } from "../../users/states/usersStore";
  import { authStore } from "../../auth/states/authStore";
  import NavbarComponent from "../components/NavbarComponent.svelte";
  import SidebarComponent from "../components/SidebarComponent.svelte";

  let isMobileSidebarOpen = false;
  let isMounted = false;
  let hasToken = !!apiHelper.getAccessToken();

  $: profile = $usersStore?.profile;

  onMount(async () => {
    isMounted = true;
    hasToken = !!apiHelper.getAccessToken();

    if (!hasToken) {
      navigate("/auth/login");
      return;
    }

    if (!profile) {
      await usersStore.asyncSetProfile();
    }
  });

  $: if ($authStore?.isAuthLogout) {
    navigate("/auth/login");
  }

  $: if ($usersStore?.isProfile && !profile && isMounted) {
    apiHelper.putAccessToken("");
    navigate("/auth/login");
  }

  function handleToggleMobileSidebar() {
    isMobileSidebarOpen = !isMobileSidebarOpen;
  }

  function handleCloseMobileSidebar() {
    isMobileSidebarOpen = false;
  }

  async function handleLogout() {
    await authStore.asyncSetIsAuthLogout();
  }
</script>

{#if !hasToken}
  <div class="flex h-screen items-center justify-center bg-rose-50/50">
    <div class="flex flex-col items-center gap-3">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-pink-400 border-t-transparent"></div>
      <p class="text-sm font-medium text-pink-700">Memuat sesi pengguna...</p>
    </div>
  </div>
{:else}
  <div class="flex h-dvh flex-col bg-slate-50 dark:bg-slate-950 font-sans">
    <NavbarComponent
      {profile}
      onToggleSidebar={handleToggleMobileSidebar}
      onLogout={handleLogout}
    />

    <div class="flex min-h-0 flex-1 relative overflow-hidden">
      <SidebarComponent
        isSidebarOpen={isMobileSidebarOpen}
        onCloseMobile={handleCloseMobileSidebar}
      />

      <main class="flex-1 w-full min-w-0 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
        <div class="mx-auto max-w-7xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
{/if}