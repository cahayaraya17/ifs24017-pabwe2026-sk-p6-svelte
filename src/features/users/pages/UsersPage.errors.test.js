import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/svelte";
import UsersPage from "./UsersPage.svelte";
import { usersStore } from "../states/usersStore";

vi.mock("../states/usersStore", async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import("svelte/store");
  return {
    ...actual,
    usersStore: Object.assign(writable({ users: [] }), { asyncSetUsers: vi.fn() }),
  };
});

const KOSONG = "Tidak ada data pengguna ditemukan.";

beforeEach(() => {
  usersStore.asyncSetUsers = vi.fn().mockResolvedValue(undefined);
  usersStore.set({ users: [] });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("UsersPage - kegagalan memuat", () => {
  it("error dicatat dan halaman berhenti memuat", async () => {
    const catatan = vi.spyOn(console, "error").mockImplementation(() => {});
    const galat = new Error("gagal jaringan");
    usersStore.asyncSetUsers = vi.fn().mockRejectedValue(galat);

    render(UsersPage);

    await waitFor(() =>
      expect(catatan).toHaveBeenCalledWith("Gagal memuat daftar pengguna:", galat)
    );
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());
  });

  it("store tanpa asyncSetUsers tetap berhenti memuat", async () => {
    usersStore.asyncSetUsers = undefined;
    render(UsersPage);
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());
  });
});