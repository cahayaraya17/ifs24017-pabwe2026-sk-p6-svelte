<script>
  import { currentRoute, currentPath } from "./router";
  import apiHelper from "./helpers/apiHelper";
  import AuthLayout from "./features/auth/layouts/AuthLayout.svelte";
  import LinkTreeLayout from "./features/linktrees/layouts/LinkTreeLayout.svelte";
  import LoginPage from "./features/auth/pages/LoginPage.svelte";
  import RegisterPage from "./features/auth/pages/RegisterPage.svelte";
  import HomePage from "./features/linktrees/pages/HomePage.svelte";
  import DetailPage from "./features/linktrees/pages/DetailPage.svelte";
  import UsersPage from "./features/users/pages/UsersPage.svelte";
  import ProfilePage from "./features/users/pages/ProfilePage.svelte";
  import NotFoundPage from "./features/common/pages/NotFoundPage.svelte";

  function checkToken() {
    try {
      return !!apiHelper.getAccessToken();
    } catch {
      return false;
    }
  }

  $: tokenExists = checkToken();
  $: activePath = $currentPath || window.location.pathname;
  $: routeName = $currentRoute?.name || "home";
  $: routeLayout = $currentRoute?.layout || "linkTree";
</script>

{#if activePath === "/auth/register" || routeName === "register"}
  <AuthLayout>
    <RegisterPage />
  </AuthLayout>
{:else if activePath === "/auth/login" || routeName === "login" || (!tokenExists && routeLayout === "auth")}
  <AuthLayout>
    <LoginPage />
  </AuthLayout>
{:else if activePath === "/" || routeName === "home"}
  <LinkTreeLayout>
    <HomePage />
  </LinkTreeLayout>
{:else if activePath.startsWith("/link-trees") || activePath.startsWith("/todos") || routeName === "linkTree-detail"}
  <LinkTreeLayout>
    <DetailPage params={$currentRoute?.params || {}} />
  </LinkTreeLayout>
{:else if activePath === "/users" || routeName === "users"}
  <LinkTreeLayout>
    <UsersPage />
  </LinkTreeLayout>
{:else if activePath === "/profile" || routeName === "profile"}
  <LinkTreeLayout>
    <ProfilePage />
  </LinkTreeLayout>
{:else}
  <NotFoundPage />
{/if}