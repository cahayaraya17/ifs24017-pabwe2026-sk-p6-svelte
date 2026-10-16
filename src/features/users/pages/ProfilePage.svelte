<script>
  import { authProfile } from "../../auth/states/authStore.js";
  import {
    updateProfile,
    changePhoto,
    changePassword,
    isProfileUpdating,
    isPhotoUpdating,
    isPasswordUpdating,
  } from "../states/userStore.js";
  import { useInput } from "../../../hooks/useInput.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import Avatar from "../../common/components/Avatar.svelte";

  const name = useInput($authProfile.name);
  const email = useInput($authProfile.email);
  const password = useInput("");
  const newPassword = useInput("");
  const confirmation = useInput("");

  let photoFile = $state(null);

  function pickPhoto(event) {
    photoFile = event.target.files[0];
  }

  async function submitProfile(event) {
    event.preventDefault();
    await updateProfile({ name: $name, email: $email });
  }

  async function submitPhoto(event) {
    event.preventDefault();
    if (!photoFile) {
      await showWarningDialog("Pilih foto terlebih dahulu");
      return;
    }
    await changePhoto(photoFile);
  }

  async function submitPassword(event) {
    event.preventDefault();
    if ($newPassword !== $confirmation) {
      await showWarningDialog("Konfirmasi kata sandi tidak sama");
      return;
    }
    const ok = await changePassword({
      password: $password,
      newPassword: $newPassword,
      confirmation: $confirmation,
    });
    if (ok) {
      password.reset();
      newPassword.reset();
      confirmation.reset();
    }
  }
</script>

<div class="space-y-5">
  <h1 class="text-2xl font-extrabold">Profil</h1>

  <section class="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
    <h2 class="mb-3 font-bold">Foto Profil</h2>
    <form onsubmit={submitPhoto} class="flex flex-wrap items-center gap-4">
      <Avatar name={$authProfile.name} photo={$authProfile.photo} size="h-16 w-16" />
      <input id="photo-file" type="file" accept="image/*" aria-label="Foto profil" onchange={pickPhoto} class="text-sm" />
      <button
        type="submit"
        disabled={$isPhotoUpdating}
        class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {$isPhotoUpdating ? "Mengunggah..." : "Ubah Foto"}
      </button>
    </form>
  </section>

  <section class="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
    <h2 class="mb-3 font-bold">Data Diri</h2>
    <form onsubmit={submitProfile} class="space-y-4">
      <div>
        <label for="profile-name" class="mb-1 block text-sm font-medium">Nama</label>
        <input id="profile-name" type="text" value={$name} oninput={name.onChange}
          class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label for="profile-email" class="mb-1 block text-sm font-medium">Email</label>
        <input id="profile-email" type="email" value={$email} oninput={email.onChange}
          class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <button
        type="submit"
        disabled={$isProfileUpdating}
        class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {$isProfileUpdating ? "Menyimpan..." : "Simpan Data"}
      </button>
    </form>
  </section>

  <section class="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
    <h2 class="mb-3 font-bold">Ubah Kata Sandi</h2>
    <form onsubmit={submitPassword} class="space-y-4">
      <div>
        <label for="current-password" class="mb-1 block text-sm font-medium">Kata Sandi Saat Ini</label>
        <input id="current-password" type="password" value={$password} oninput={password.onChange}
          class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label for="new-password" class="mb-1 block text-sm font-medium">Kata Sandi Baru</label>
        <input id="new-password" type="password" value={$newPassword} oninput={newPassword.onChange}
          class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label for="confirm-password" class="mb-1 block text-sm font-medium">Konfirmasi Kata Sandi Baru</label>
        <input id="confirm-password" type="password" value={$confirmation} oninput={confirmation.onChange}
          class="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <button
        type="submit"
        disabled={$isPasswordUpdating}
        class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {$isPasswordUpdating ? "Menyimpan..." : "Ubah Kata Sandi"}
      </button>
    </form>
  </section>
</div>
