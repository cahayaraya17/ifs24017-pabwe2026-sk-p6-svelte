<script>
  import { Layers, Users, User } from "lucide-svelte";
  import { currentPath } from "../../../router.js";
  import { cn } from "../../../helpers/toolsHelper.js";
  import NavLink from "../../common/components/NavLink.svelte";

  const menus = [
    { href: "/", label: "Semua Link Tree", icon: Layers, match: /^\/($|link-trees)/ },
    { href: "/users", label: "Pengguna", icon: Users, match: /^\/users/ },
    { href: "/profile", label: "Profil", icon: User, match: /^\/profile/ },
  ];
</script>

<aside class="md:w-56 md:shrink-0">
  <nav class="flex gap-2 overflow-x-auto md:flex-col">
    {#each menus as menu (menu.href)}
      <NavLink
        href={menu.href}
        class={cn(
          "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold",
          menu.match.test($currentPath)
            ? "bg-indigo-600 text-white"
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        <menu.icon size={18} />
        <span>{menu.label}</span>
      </NavLink>
    {/each}
  </nav>
</aside>
