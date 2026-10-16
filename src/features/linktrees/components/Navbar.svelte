<script>
  import { Link2, LogOut } from "lucide-svelte";
  import { authProfile, logout } from "../../auth/states/authStore.js";
  import { navigate } from "../../../router.js";
  import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
  import NavLink from "../../common/components/NavLink.svelte";
  import Avatar from "../../common/components/Avatar.svelte";

  async function handleLogout() {
    const confirmed = await showConfirmDialog("Yakin ingin keluar dari akun?");
    if (!confirmed) return;
    await logout();
    navigate("/auth/login");
  }
</script>

<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
    <NavLink href="/" class="flex items-center gap-2 font-extrabold text-slate-900">
      <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
        <Link2 size={18} />
      </span>
      Delcom Link Tree
    </NavLink>
    <div class="flex items-center gap-3">
      <NavLink href="/profile" class="flex items-center gap-2">
        <Avatar name={$authProfile.name} photo={$authProfile.photo} />
        <span class="sr-only text-sm font-semibold sm:not-sr-only">{$authProfile.name}</span>
      </NavLink>
      <button
        type="button"
        aria-label="Keluar"
        onclick={handleLogout}
        class="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
      >
        <LogOut size={18} />
      </button>
    </div>
  </div>
</header>
