<script>
  import { navigate } from "../../../router";
  import { Link, Menu, ChevronDown, User, LogOut } from "lucide-svelte";

  export let profile = null;
  export let onToggleSidebar = () => {};
  export let onLogout = () => {};

  let isDropdownOpen = false;

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  function handleLogoClick() {
    navigate("/");
  }

  function handleProfileClick() {
    isDropdownOpen = false;
    navigate("/profile");
  }

  function handleLogoutClick() {
    isDropdownOpen = false;
    if (onLogout) onLogout();
  }

  function handleWindowMousedown(e) {
    const dropdownBtn = document.querySelector('[data-testid="profile-dropdown-button"]');
    const dropdownMenu = document.querySelector('[data-testid="profile-dropdown-menu"]');

    if (
      dropdownBtn && !dropdownBtn.contains(e.target) &&
      dropdownMenu && !dropdownMenu.contains(e.target)
    ) {
      isDropdownOpen = false;
    }
  }
</script>

<svelte:window on:mousedown={handleWindowMousedown} />

<header class="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-rose-100 bg-white/90 px-4 sm:px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
  <div class="flex items-center gap-3">
    <button
      type="button"
      data-testid="toggle-sidebar-btn"
      class="rounded-xl p-2 text-slate-600 hover:bg-rose-50 hover:text-pink-600 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
      on:click={onToggleSidebar}
      aria-label="Menu"
    >
      <Menu class="h-5 w-5" />
    </button>

    <button
      type="button"
      class="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
      on:click={handleLogoClick}
    >
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-200 transition-transform group-hover:scale-105 dark:shadow-none">
        <Link class="h-5 w-5 stroke-[2.5]" />
      </div>
      <div>
        <span class="block text-base font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          Delcom LinkTree
        </span>
        <span class="block text-[10px] text-slate-500 -mt-1 font-medium">Link in bio</span>
      </div>
    </button>
  </div>

  <div class="relative">
    <button
      id="user-menu-btn"
      data-testid="profile-dropdown-button"
      type="button"
      class="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-1.5 pr-3 text-left transition hover:bg-rose-100/60 dark:border-slate-800 dark:bg-slate-800/60 cursor-pointer"
      on:click={toggleDropdown}
    >
      {#if profile?.photo}
        <img
          src={profile.photo}
          alt={profile.name || "User"}
          class="h-8 w-8 rounded-lg object-cover ring-2 ring-pink-300"
        />
      {:else}
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 text-xs font-bold text-white shadow-inner">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
        </div>
      {/if}

      <div class="hidden text-left sm:block">
        <p class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
          {profile?.name || "Pengguna"}
        </p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {profile?.email || ""}
        </p>
      </div>

      <ChevronDown class="h-4 w-4 text-slate-500 transition-transform duration-200 {isDropdownOpen ? 'rotate-180' : ''}" />
    </button>

    {#if isDropdownOpen}
      <div
        id="user-dropdown"
        data-testid="profile-dropdown-menu"
        class="absolute right-0 mt-2 w-48 rounded-2xl border border-rose-100 bg-white p-1.5 shadow-xl shadow-pink-500/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900"
      >
        <button
          type="button"
          data-testid="dropdown-profile-link"
          on:click={handleProfileClick}
          class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-pink-600 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
        >
          <User class="h-4 w-4" />
          <span>Profil Akun</span>
        </button>

        <div class="my-1 border-t border-rose-50 dark:border-slate-800"></div>

        <button
          type="button"
          data-testid="dropdown-logout-button"
          on:click={handleLogoutClick}
          class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
        >
          <LogOut class="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </div>
    {/if}
  </div>
</header>
