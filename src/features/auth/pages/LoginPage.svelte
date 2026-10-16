<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { navigate } from "../../../router.js";
  import { login, isAuthLogin } from "../states/authStore.js";
  import NavLink from "../../common/components/NavLink.svelte";

  const email = useInput("");
  const password = useInput("");

  async function submit(event) {
    event.preventDefault();
    const ok = await login({ email: $email, password: $password });
    if (ok) navigate("/");
  }
</script>

<h2 class="mb-4 text-lg font-bold">Masuk</h2>
<form onsubmit={submit} class="space-y-4">
  <div>
    <label for="login-email-input" class="mb-1 block text-sm font-medium">Email</label>
    <input
      id="login-email-input"
      type="email"
      required
      value={$email}
      oninput={email.onChange}
      class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-indigo-500"
    />
  </div>
  <div>
    <label for="login-password-input" class="mb-1 block text-sm font-medium">Kata Sandi</label>
    <input
      id="login-password-input"
      type="password"
      required
      value={$password}
      oninput={password.onChange}
      class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-indigo-500"
    />
  </div>
  <button
    id="login-submit-button"
    type="submit"
    disabled={$isAuthLogin}
    class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
  >
    {$isAuthLogin ? "Memproses..." : "Masuk"}
  </button>
</form>
<p class="mt-4 text-center text-sm text-slate-600">
  Belum punya akun?
  <NavLink href="/auth/register" class="font-semibold text-indigo-600">Daftar</NavLink>
</p>
