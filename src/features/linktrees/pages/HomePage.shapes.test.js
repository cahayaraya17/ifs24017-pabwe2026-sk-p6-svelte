import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import HomePage from "./HomePage.svelte";
import {
  linkTreesStore,
  asyncSetIsLinkTreesGet,
  asyncSetIsLinkTreeDeleteAll,
} from "../states/linkTreesStore";
import { usersStore } from "../../users/states/usersStore";
import { authStore } from "../../auth/states/authStore";
import { navigate } from "../../../router";

vi.mock("../states/linkTreesStore", async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import("svelte/store");
  return {
    ...actual,
    linkTreesStore: writable([]),
    asyncSetIsLinkTreesGet: vi.fn(),
    asyncSetIsLinkTreeDeleteAll: vi.fn(),
  };
});

vi.mock("../../users/states/usersStore", async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import("svelte/store");
  return {
    ...actual,
    usersStore: Object.assign(writable({ users: [] }), { asyncSetUsers: vi.fn() }),
  };
});

vi.mock("../../auth/states/authStore", async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import("svelte/store");
  return { ...actual, authStore: writable({ profile: { id: 1 } }) };
});

vi.mock("../../../router", async (importOriginal) => ({
  ...(await importOriginal()),
  navigate: vi.fn(),
}));

const KOSONG = "Tidak ada Link Tree yang ditemukan.";

const item = (o = {}) => ({
  id: 1,
  title: "Judul A",
  description: "Deskripsi A",
  type: "public",
  user_id: 1,
  user: { name: "Ani" },
  ...o,
});

beforeEach(() => {
  vi.clearAllMocks();
  asyncSetIsLinkTreesGet.mockResolvedValue(undefined);
  asyncSetIsLinkTreeDeleteAll.mockResolvedValue(undefined);
  usersStore.asyncSetUsers.mockResolvedValue(undefined);
  linkTreesStore.set([]);
  usersStore.set({ users: [] });
  authStore.set({ profile: { id: 1 } });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete linkTreesStore.asyncSetIsLinkTreeDeleteAll;
});

describe("HomePage - bentuk isi store", () => {
  it("memuat data saat mount dan membaca berbagai bentuk store", async () => {
    render(HomePage);
    expect(asyncSetIsLinkTreesGet).toHaveBeenCalled();
    expect(usersStore.asyncSetUsers).toHaveBeenCalled();
    expect(screen.getByText(KOSONG)).toBeTruthy();

    linkTreesStore.set([item({ title: "Dari Array" })]);
    await waitFor(() => expect(screen.getByText("Dari Array")).toBeTruthy());

    linkTreesStore.set({ linkTrees: [item({ title: "Dari Objek" })] });
    await waitFor(() => expect(screen.getByText("Dari Objek")).toBeTruthy());

    linkTreesStore.set({ linkTrees: "bukan array" });
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());

    linkTreesStore.set([item({ title: "Kembali Ada" })]);
    await waitFor(() => expect(screen.getByText("Kembali Ada")).toBeTruthy());

    linkTreesStore.set(null);
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());
  });

  it("menghitung statistik per tipe", () => {
    linkTreesStore.set([
      item({ id: 1, type: "public" }),
      item({ id: 2, type: "public" }),
      item({ id: 3, type: "unlisted" }),
      item({ id: 4, type: "private" }),
    ]);
    render(HomePage);
    const angka = (label) =>
      screen.getByText(label).parentElement.querySelector("h4").textContent.trim();
    expect(angka("Public")).toBe("2");
    expect(angka("Unlisted")).toBe("1");
    expect(angka("Private")).toBe("1");
  });
});

describe("HomePage - nama pemilik", () => {
  it("memakai berbagai sumber nama", async () => {
    usersStore.set({ users: null });
    linkTreesStore.set([
      item({ id: 1, title: "O1", user: { name: "Ani" } }),
      item({ id: 2, title: "O2", user: undefined, author_name: "Budi" }),
      item({ id: 3, title: "O3", user: undefined, username: "cici" }),
      item({ id: 4, title: "O4", user: undefined, user_id: 7 }),
      item({ id: 5, title: "O5", user: undefined, user_id: 99 }),
      item({ id: 6, title: "O6", user: undefined, user_id: undefined }),
    ]);
    render(HomePage);

    expect(screen.getByText("Ani")).toBeTruthy();
    expect(screen.getByText("Budi")).toBeTruthy();
    expect(screen.getByText("cici")).toBeTruthy();
    expect(screen.getByText("User #7")).toBeTruthy();
    expect(screen.getByText("User #99")).toBeTruthy();
    expect(screen.getByText("Pengguna")).toBeTruthy();

    usersStore.set({ users: [{ id: 7, name: "Dedi" }] });
    await waitFor(() => expect(screen.getByText("Dedi")).toBeTruthy());
  });
});

describe("HomePage - pencarian dan filter", () => {
  const data = () => [
    item({ id: 1, title: "T1", description: "Deskripsi Satu", user_id: 1, user: { name: "Ani" } }),
    item({ id: 2, title: "T2", description: "Deskripsi Kucing", user_id: 2, user: { name: "Budi" } }),
    item({ id: 4, title: "T4", description: "", user_id: 7, user: undefined }),
    item({ id: 5, title: undefined, description: undefined, user_id: 99, user: undefined }),
  ];

  it("mencari berdasarkan judul, deskripsi, dan nama pemilik", async () => {
    usersStore.set({ users: [{ id: 7, name: "Dedi" }] });
    linkTreesStore.set(data());
    render(HomePage);
    const cari = screen.getByPlaceholderText("Cari Link Tree...");

    await fireEvent.input(cari, { target: { value: "t1" } });
    await waitFor(() => expect(screen.queryByText("T2")).toBeNull());
    expect(screen.getByText("T1")).toBeTruthy();

    await fireEvent.input(cari, { target: { value: "kucing" } });
    await waitFor(() => expect(screen.getByText("T2")).toBeTruthy());
    expect(screen.queryByText("T1")).toBeNull();

    await fireEvent.input(cari, { target: { value: "dedi" } });
    await waitFor(() => expect(screen.getByText("T4")).toBeTruthy());
    expect(screen.queryByText("T2")).toBeNull();

    await fireEvent.input(cari, { target: { value: "zzz" } });
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());

    await fireEvent.input(cari, { target: { value: "" } });
    await waitFor(() => expect(screen.getByText("T1")).toBeTruthy());
  });

  it("filter hanya milik saya", async () => {
    linkTreesStore.set(data());
    render(HomePage);
    const cek = screen.getByLabelText("Hanya Milik Saya");

    await fireEvent.click(cek);
    await waitFor(() => expect(screen.queryByText("T2")).toBeNull());
    expect(screen.getByText("T1")).toBeTruthy();

    authStore.set({});
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());

    await fireEvent.click(cek);
    await waitFor(() => expect(screen.getByText("T2")).toBeTruthy());
  });
});

describe("HomePage - kartu dan aksi", () => {
  it("sampul gagal dimuat disembunyikan", async () => {
    linkTreesStore.set([item({ cover: "uploads/a.png" })]);
    const { container } = render(HomePage);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    await fireEvent.error(img);
    expect(img.parentElement.style.display).toBe("none");
  });

  it("tombol Buka menavigasi ke detail", async () => {
    linkTreesStore.set([item({ id: 3 })]);
    render(HomePage);
    await fireEvent.click(screen.getByText("Buka"));
    expect(navigate).toHaveBeenCalledWith("/link-trees/3");
  });

  it("hapus semua: dibatalkan, memakai fungsi impor, dan memakai method store", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(HomePage);
    const tombol = screen.getByText("Hapus Semua");

    await fireEvent.click(tombol);
    expect(asyncSetIsLinkTreeDeleteAll).not.toHaveBeenCalled();

    confirmSpy.mockReturnValue(true);
    await fireEvent.click(tombol);
    await waitFor(() => expect(asyncSetIsLinkTreeDeleteAll).toHaveBeenCalledTimes(1));

    const methodStore = vi.fn().mockResolvedValue(undefined);
    linkTreesStore.asyncSetIsLinkTreeDeleteAll = methodStore;
    await fireEvent.click(tombol);
    await waitFor(() => expect(methodStore).toHaveBeenCalledTimes(1));
    expect(asyncSetIsLinkTreeDeleteAll).toHaveBeenCalledTimes(1);
  });

  it("membuka dan menutup AddModal", async () => {
    render(HomePage);
    await fireEvent.click(screen.getByText("Tambah Link Tree"));
    expect(await screen.findByLabelText("Judul")).toBeTruthy();

    await fireEvent.click(screen.getByText("Batal"));
    await waitFor(() => expect(screen.queryByLabelText("Judul")).toBeNull());
  });
});