import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import HomePage from "./HomePage.svelte";
import * as store from "../states/linkTreesStore";
import * as router from "../../../router";
import { usersStore } from "../../users/states/usersStore";
import { authStore } from "../../auth/states/authStore";

vi.mock("../modals/AddModal.svelte", () => import("./__stubs__/ModalStub.svelte"));

let navSpy;

beforeEach(() => {
  navSpy = vi.spyOn(router, "navigate").mockImplementation(() => {});
  vi.spyOn(store, "asyncSetIsLinkTreesGet").mockResolvedValue(true);
  vi.spyOn(usersStore, "asyncSetUsers").mockResolvedValue(true);
  usersStore.reset();
  authStore.reset({ profile: { id: 10 } });
  store.linkTreesStore.set([]);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const t = (o = {}) => ({ id: 1, title: "Tree", type: "public", user_id: 10, ...o });

describe("HomePage - bentuk data list", () => {
  it("store berupa array", () => {
    store.linkTreesStore.set([t(), t({ id: 2, type: "unlisted", title: "U" }), t({ id: 3, type: "private", title: "P" })]);
    const { getByText } = render(HomePage);
    expect(getByText("Tree")).toBeTruthy();
    expect(getByText("unlisted")).toBeTruthy();
    expect(getByText("private")).toBeTruthy();
  });

  it("store berupa objek dengan linkTrees", () => {
    store.linkTreesStore.set({ linkTrees: [t({ title: "Dari Objek" })] });
    const { getByText } = render(HomePage);
    expect(getByText("Dari Objek")).toBeTruthy();
  });

  it("store objek tanpa linkTrees menampilkan kosong", () => {
    store.linkTreesStore.set({});
    const { getByText } = render(HomePage);
    expect(getByText("Tidak ada Link Tree yang ditemukan.")).toBeTruthy();
  });

  it("store null menampilkan kosong", () => {
    store.linkTreesStore.set(null);
    const { getByText } = render(HomePage);
    expect(getByText("Tidak ada Link Tree yang ditemukan.")).toBeTruthy();
  });

  it("users bukan array tidak error", () => {
    usersStore.reset({ users: null });
    store.linkTreesStore.set([t()]);
    const { getByText } = render(HomePage);
    expect(getByText("Tree")).toBeTruthy();
  });
});

describe("HomePage - nama pemilik", () => {
  const show = (items) => {
    store.linkTreesStore.set(items);
    return render(HomePage);
  };

  it("user.name", () => {
    const { getByText } = show([t({ user: { name: "Nama User" } })]);
    expect(getByText("Nama User")).toBeTruthy();
  });

  it("author_name", () => {
    const { getByText } = show([t({ author_name: "Penulis" })]);
    expect(getByText("Penulis")).toBeTruthy();
  });

  it("username", () => {
    const { getByText } = show([t({ username: "uname" })]);
    expect(getByText("uname")).toBeTruthy();
  });

  it("nama dari usersStore", () => {
    usersStore.setUsers([{ id: 10, name: "Budi" }]);
    const { getByText } = show([t()]);
    expect(getByText("Budi")).toBeTruthy();
  });

  it("fallback User #id", () => {
    const { getByText } = show([t({ user_id: 99 })]);
    expect(getByText("User #99")).toBeTruthy();
  });

  it("fallback Pengguna", () => {
    const { getByText } = show([t({ user_id: undefined })]);
    expect(getByText("Pengguna")).toBeTruthy();
  });
});

describe("HomePage - filter", () => {
  beforeEach(() => {
    usersStore.setUsers([{ id: 11, name: "Siti" }]);
    store.linkTreesStore.set([
      t({ id: 1, title: "Alpha", description: "desk satu", user_id: 10 }),
      t({ id: 2, title: "Beta", description: undefined, user_id: 11 }),
      { id: 3, type: "public", user_id: 12 },
    ]);
  });

  const typeQ = async (r, v) =>
    fireEvent.input(r.getByPlaceholderText("Cari Link Tree..."), { target: { value: v } });

  it("cari berdasarkan judul", async () => {
    const r = render(HomePage);
    await typeQ(r, "alpha");
    expect(r.queryByText("Beta")).toBeNull();
    expect(r.getByText("Alpha")).toBeTruthy();
  });

  it("cari berdasarkan deskripsi", async () => {
    const r = render(HomePage);
    await typeQ(r, "desk satu");
    expect(r.queryByText("Beta")).toBeNull();
    expect(r.getByText("Alpha")).toBeTruthy();
  });

  it("cari berdasarkan nama pengguna", async () => {
    const r = render(HomePage);
    await typeQ(r, "siti");
    expect(r.getByText("Beta")).toBeTruthy();
    expect(r.queryByText("Alpha")).toBeNull();
  });

  it("tidak ada yang cocok", async () => {
    const r = render(HomePage);
    await typeQ(r, "zzzz");
    expect(r.getByText("Tidak ada Link Tree yang ditemukan.")).toBeTruthy();
  });

  it("hanya milik saya", async () => {
    const r = render(HomePage);
    await fireEvent.click(r.getByLabelText("Hanya Milik Saya"));
    expect(r.getByText("Alpha")).toBeTruthy();
    expect(r.queryByText("Beta")).toBeNull();
  });

  it("hanya milik saya tanpa profil", async () => {
    authStore.reset();
    const r = render(HomePage);
    await fireEvent.click(r.getByLabelText("Hanya Milik Saya"));
    expect(r.getByText("Tidak ada Link Tree yang ditemukan.")).toBeTruthy();
  });
});

describe("HomePage - cover, navigasi, modal", () => {
  it("cover tampil dan disembunyikan saat error", async () => {
    store.linkTreesStore.set([t({ cover: "c.png", description: "d" })]);
    const { container } = render(HomePage);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    await fireEvent.error(img);
    expect(img.parentElement.style.display).toBe("none");
  });

  it("tombol Buka memanggil navigate", async () => {
    store.linkTreesStore.set([t({ id: 5 })]);
    const { getByText } = render(HomePage);
    await fireEvent.click(getByText("Buka"));
    expect(navSpy).toHaveBeenCalledWith("/link-trees/5");
  });

  it("modal tambah dibuka dan ditutup", async () => {
    const { getByText, queryByTestId, getByTestId } = render(HomePage);
    expect(queryByTestId("stub-close")).toBeNull();
    await fireEvent.click(getByText("Tambah Link Tree"));
    await fireEvent.click(getByTestId("stub-close"));
    expect(queryByTestId("stub-close")).toBeNull();
  });
});

describe("HomePage - hapus semua", () => {
  it("dibatalkan", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const spy = vi.spyOn(store.linkTreesStore, "asyncSetIsLinkTreeDeleteAll").mockResolvedValue(true);
    const { getByText } = render(HomePage);
    await fireEvent.click(getByText("Hapus Semua"));
    expect(spy).not.toHaveBeenCalled();
  });

  it("memakai method milik store", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const spy = vi.spyOn(store.linkTreesStore, "asyncSetIsLinkTreeDeleteAll").mockResolvedValue(true);
    const { getByText } = render(HomePage);
    await fireEvent.click(getByText("Hapus Semua"));
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it("fallback ke fungsi yang di-import", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const named = vi.spyOn(store, "asyncSetIsLinkTreeDeleteAll").mockResolvedValue(true);
    const orig = store.linkTreesStore.asyncSetIsLinkTreeDeleteAll;
    store.linkTreesStore.asyncSetIsLinkTreeDeleteAll = undefined;
    try {
      const { getByText } = render(HomePage);
      await fireEvent.click(getByText("Hapus Semua"));
      await waitFor(() => expect(named).toHaveBeenCalled());
    } finally {
      store.linkTreesStore.asyncSetIsLinkTreeDeleteAll = orig;
    }
  });
});