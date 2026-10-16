<script>
  import { onMount } from "svelte";
  import { currentPath, navigate, resolveRoute } from "./router.js";
  import { authProfile, isPreload, loadProfile } from "./features/auth/states/authStore.js";
  import AuthLayout from "./features/auth/layouts/AuthLayout.svelte";
  import LoginPage from "./features/auth/pages/LoginPage.svelte";
  import RegisterPage from "./features/auth/pages/RegisterPage.svelte";
  import LinkTreeLayout from "./features/linktrees/layouts/LinkTreeLayout.svelte";
  import HomePage from "./features/linktrees/pages/HomePage.svelte";
  import DetailPage from "./features/linktrees/pages/DetailPage.svelte";
  import UsersPage from "./features/users/pages/UsersPage.svelte";
  import ProfilePage from "./features/users/pages/ProfilePage.svelte";
  import NotFoundPage from "./features/common/pages/NotFoundPage.svelte";

  const pages = {
    login: LoginPage,
    register: RegisterPage,
    home: HomePage,
    detail: DetailPage,
    users: UsersPage,
    profile: ProfilePage,
    notFound: NotFoundPage,
  };

  const route = $derived(resolveRoute($currentPath));
  const Page = $derived(pages[route.name]);

  onMount(() => {
    loadProfile();
  });

  // Penjaga rute: tamu diarahkan ke login, pengguna login diarahkan ke beranda.
  $effect(() => {
    if ($isPreload) return;
    if (route.layout === "auth" && $authProfile) navigate("/", true);
    if (route.layout === "app" && !$authProfile) navigate("/auth/login", true);
  });
</script>

{#if $isPreload}
  <main>
    <h1 class="py-20 text-center text-base font-normal text-slate-600">Memuat...</h1>
  </main>
{:else if route.layout === "auth" && !$authProfile}
  <AuthLayout>
    <Page />
  </AuthLayout>
{:else if route.layout === "app" && $authProfile}
  <LinkTreeLayout>
    <Page {...route.params} />
  </LinkTreeLayout>
{:else if route.layout === "plain"}
  <Page />
{/if}
