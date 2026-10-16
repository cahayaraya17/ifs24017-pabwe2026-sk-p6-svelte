import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
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
const MEMUAT = "Memuat daftar pengguna...";

beforeEach(() => {
  vi.clearAllMocks();
  usersStore.asyncSetUsers.mockResolvedValue(undefined);
  usersStore.set({ users: [] });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("UsersPage - status tampilan", () => {
  it("menampilkan status memuat sampai data datang", async () => {
    usersStore.asyncSetUsers.mockImplementation(() => new Promise(() => {}));
    render(UsersPage);
    expect(screen.getByText(MEMUAT)).toBeTruthy();

    usersStore.set({ users: [{ id: 1, name: "Ani", email: "a@x.com" }] });
    await waitFor(() => expect(screen.getByText("Ani")).toBeTruthy());
    expect(screen.queryByText(MEMUAT)).toBeNull();
  });

  it("menampilkan pesan kosong setelah selesai memuat", async () => {
    render(UsersPage);
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());
  });

  it("isi store bukan array dianggap kosong", async () => {
    usersStore.set({ users: undefined });
    render(UsersPage);
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());

    usersStore.set({ users: "bukan array" });
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());

    usersStore.set(null);
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());
  });
});

describe("UsersPage - kartu pengguna", () => {
  it("menampilkan foto, inisial, dan tanggal", async () => {
    usersStore.set({
      users: [
        null,
        { id: 1, name: "Ani", email: "a@x.com", photo: "ani.png", created_at: "2024-01-02T03:04:05Z" },
        { id: 2, name: "zara", email: "z@x.com" },
        { id: 3, email: "c@x.com" },
      ],
    });
    const { container } = render(UsersPage);
    await waitFor(() => expect(screen.getByText("Ani")).toBeTruthy());

    const img = container.querySelector("img");
    expect(img.getAttribute("src")).toBe("ani.png");
    expect(img.getAttribute("alt")).toBe("Ani");
    expect(screen.getByText("Z")).toBeTruthy();
    expect(screen.getByText("U")).toBeTruthy();
    expect(screen.getAllByText("-").length).toBe(2);
  });
});

describe("UsersPage - pencarian", () => {
  it("mencari berdasarkan nama dan email", async () => {
    usersStore.set({
      users: [
        { id: 1, name: "Ani", email: "ani@x.com" },
        { id: 2, name: "Budi", email: "budi@y.com" },
        { id: 3, name: "Eko" },
        { id: 4, email: "tanpa-nama@z.com" },
      ],
    });
    render(UsersPage);
    const cari = screen.getByTestId("search-user-input");
    await waitFor(() => expect(screen.getByText("Ani")).toBeTruthy());

    await fireEvent.input(cari, { target: { value: "  budi " } });
    await waitFor(() => expect(screen.queryByText("Ani")).toBeNull());
    expect(screen.getByText("Budi")).toBeTruthy();

    await fireEvent.input(cari, { target: { value: "@z.com" } });
    await waitFor(() => expect(screen.getByText("tanpa-nama@z.com")).toBeTruthy());

    await fireEvent.input(cari, { target: { value: "eko" } });
    await waitFor(() => expect(screen.getByText("Eko")).toBeTruthy());

    await fireEvent.input(cari, { target: { value: "tidak-ada" } });
    await waitFor(() => expect(screen.getByText(KOSONG)).toBeTruthy());

    await fireEvent.input(cari, { target: { value: "   " } });
    await waitFor(() => expect(screen.getByText("Ani")).toBeTruthy());
  });
});

describe("UsersPage - perubahan daftar", () => {
  it("menambah, mengurutkan ulang, memperbarui, dan menghapus pengguna", async () => {
    usersStore.set({
      users: [
        { id: 1, name: "Ani", email: "a@x.com" },
        { id: 2, name: "Budi", email: "b@x.com" },
      ],
    });
    render(UsersPage);
    await waitFor(() => expect(screen.getByText("Budi")).toBeTruthy());

    usersStore.set({
      users: [
        { id: 2, name: "Budi", email: "b@x.com" },
        { id: 1, name: "Ani2", email: "a@x.com" },
      ],
    });
    await waitFor(() => expect(screen.getByText("Ani2")).toBeTruthy());

    usersStore.set({ users: [{ id: 2, name: "Budi", email: "b@x.com" }] });
    await waitFor(() => expect(screen.queryByText("Ani2")).toBeNull());

    usersStore.set({
      users: [
        { id: 3, name: "Cici", email: "c@x.com" },
        { id: 2, name: "Budi", email: "b@x.com" },
      ],
    });
    await waitFor(() => expect(screen.getByText("Cici")).toBeTruthy());
  });
});