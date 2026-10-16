<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { navigate } from "../../../router.js";
  import { register, isAuthRegister } from "../states/authStore.js";
  import NavLink from "../../common/components/NavLink.svelte";

  const name = useInput("");
  const email = useInput("");
  const password = useInput("");

  async function submit(event) {
    event.preventDefault();
    const ok = await register({ name: $name, email: $email, password: $password });
    if (ok) navigate("/auth/login");
  }
</script>

<h2 class="mb-4 text-lg font-bold">Daftar</h2>
<form onsubmit={submit} class="space-y-4">
  <div>
    <label for="register-name-input" class="mb-1 block text-sm font-medium">Nama</label>
    <input
      id="register-name-input"
      type="text"
      required
      value={$name}
      oninput={name.onChange}
      class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-indigo-500"
    />
  </div>
  <div>
    <label for="register-email-input" class="mb-1 block text-sm font-medium">Email</label>
    <input
      id="register-email-input"
      type="email"
      required
      value={$email}
      oninput={email.onChange}
      class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-indigo-500"
    />
  </div>
  <div>
    <label for="register-password-input" class="mb-1 block text-sm font-medium">Kata Sandi</label>
    <input
      id="register-password-input"
      type="password"
      required
      value={$password}
      oninput={password.onChange}
      class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-indigo-500"
    />
  </div>
  <button
    id="register-submit-button"
    type="submit"
    disabled={$isAuthRegister}
    class="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
  >
    {$isAuthRegister ? "Memproses..." : "Daftar"}
  </button>
</form>
<p class="mt-4 text-center text-sm text-slate-600">
  Sudah punya akun?
  <NavLink href="/auth/login" class="font-semibold text-indigo-600">Masuk</NavLink>
</p>
