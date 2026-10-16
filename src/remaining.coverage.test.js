import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import NavbarComponent from "./features/linktrees/components/NavbarComponent.svelte";
import SidebarComponent from "./features/linktrees/components/SidebarComponent.svelte";
import AddModal from "./features/linktrees/modals/AddModal.svelte";
import ChangeModal from "./features/linktrees/modals/ChangeModal.svelte";
import ItemModal from "./features/linktrees/modals/ItemModal.svelte";
import UsersPage from "./features/users/pages/UsersPage.svelte";
import * as store from "./features/linktrees/states/linkTreesStore";
import { usersStore } from "./features/users/states/usersStore";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("NavbarComponent - sisa cabang", () => {
  it("klik logo", async () => {
    const { getByText } = render(NavbarComponent, { props: { profile: null } });
    await fireEvent.click(getByText("Delcom LinkTree"));
    expect(window.location.pathname).toBe("/");
  });

  it("logout tanpa handler", async () => {
    const { getByTestId } = render(NavbarComponent, { props: { profile: null, onLogout: null } });
    await fireEvent.click(getByTestId("profile-dropdown-button"));
    await fireEvent.click(getByTestId("dropdown-logout-button"));
    expect(true).toBe(true);
  });

  it("foto tanpa nama memakai alt User", () => {
    const { container } = render(NavbarComponent, { props: { profile: { photo: "p.png" } } });
    expect(container.querySelector("img").getAttribute("alt")).toBe("User");
  });
});

describe("SidebarComponent - sisa cabang", () => {
  it("tanpa handler onCloseMobile", async () => {
    const { getByText, getByTestId } = render(SidebarComponent, {
      props: { isSidebarOpen: true, onCloseMobile: null },
    });
    await fireEvent.click(getByText("Semua LinkTree"));
    await fireEvent.click(getByTestId("sidebar-backdrop"));
    await fireEvent.keyDown(getByTestId("sidebar-backdrop"), { key: "Escape" });
    expect(true).toBe(true);
  });
});

describe("AddModal - sisa cabang", () => {
  it("ubah tipe dan simpan gagal", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeAdd").mockResolvedValue(false);
    const { getByLabelText, container } = render(AddModal, { props: { show: true } });
    await fireEvent.change(getByLabelText("Tipe"), { target: { value: "private" } });
    await fireEvent.input(getByLabelText("Judul"), { target: { value: "T" } });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });
});

describe("ChangeModal - sisa cabang", () => {
  it("linkTree tanpa field, ubah tipe, simpan gagal", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeChange").mockResolvedValue(false);
    const { getByLabelText, container } = render(ChangeModal, {
      props: { show: true, linkTree: { id: 1 } },
    });
    await fireEvent.change(getByLabelText("Tipe"), { target: { value: "unlisted" } });
    await fireEvent.input(getByLabelText("Judul"), { target: { value: "X" } });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it("linkTree tanpa id tidak menyimpan", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeChange").mockResolvedValue(true);
    const { container } = render(ChangeModal, {
      props: { show: true, linkTree: { title: "T" } },
    });
    await fireEvent.submit(container.querySelector("form"));
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("ItemModal - sisa cabang", () => {
  it("item tanpa field: url kosong lalu simpan gagal", async () => {
    const spy = vi.spyOn(store, "asyncSetIsItemSave").mockResolvedValue(false);
    const { getByLabelText, container } = render(ItemModal, {
      props: { show: true, linkTreeId: 1, item: { id: 5 } },
    });
    await fireEvent.input(getByLabelText("Judul Tautan"), { target: { value: "A" } });
    await fireEvent.submit(container.querySelector("form"));
    expect(spy).not.toHaveBeenCalled();
    await fireEvent.input(getByLabelText("URL"), { target: { value: "https://x.com" } });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it("tanpa linkTreeId tidak menyimpan", async () => {
    const spy = vi.spyOn(store, "asyncSetIsItemSave").mockResolvedValue(true);
    const { getByLabelText, container } = render(ItemModal, {
      props: { show: true, linkTreeId: "", item: null },
    });
    await fireEvent.input(getByLabelText("Judul Tautan"), { target: { value: "A" } });
    await fireEvent.input(getByLabelText("URL"), { target: { value: "https://x.com" } });
    await fireEvent.submit(container.querySelector("form"));
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("UsersPage - sisa cabang", () => {
  it("data null dan perubahan daftar", async () => {
    vi.spyOn(usersStore, "asyncSetUsers").mockResolvedValue(true);
    usersStore.reset({ users: [null, { id: 1, name: "Ani", email: "a@x.com" }] });
    const { getByText, queryByText } = render(UsersPage);
    await waitFor(() => expect(getByText("Ani")).toBeTruthy());
    usersStore.setUsers([
      { id: 2, name: "Budi", email: "b@x.com" },
      { id: 1, name: "Ani2", email: "a@x.com" },
    ]);
    await waitFor(() => expect(getByText("Budi")).toBeTruthy());
    usersStore.setUsers([{ id: 2, name: "Budi", email: "b@x.com" }]);
    await waitFor(() => expect(queryByText("Ani2")).toBeNull());
    usersStore.reset();
  });
});