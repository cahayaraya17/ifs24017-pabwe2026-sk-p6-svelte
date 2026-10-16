import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import HomePage from "./HomePage.svelte";
import DetailPage from "./DetailPage.svelte";
import * as store from "../states/linkTreesStore";
import { usersStore } from "../../users/states/usersStore";

vi.mock("../modals/AddModal.svelte", () => import("./__stubs__/ModalStub.svelte"));
vi.mock("../modals/ChangeModal.svelte", () => import("./__stubs__/ModalStub.svelte"));
vi.mock("../modals/ChangeCoverModal.svelte", () => import("./__stubs__/ModalStub.svelte"));
vi.mock("../modals/ItemModal.svelte", () => import("./__stubs__/ModalStub.svelte"));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("sisa cabang", () => {
  it("HomePage: linkTreesStore undefined", () => {
    vi.spyOn(store, "asyncSetIsLinkTreesGet").mockResolvedValue(true);
    vi.spyOn(usersStore, "asyncSetUsers").mockResolvedValue(true);
    store.linkTreesStore.set(undefined);
    const { getByText } = render(HomePage);
    expect(getByText("Tidak ada Link Tree yang ditemukan.")).toBeTruthy();
  });

  it("DetailPage: hapus item dikonfirmasi", async () => {
    vi.spyOn(store, "asyncSetIsLinkTreeGet").mockResolvedValue(true);
    const del = vi.spyOn(store, "asyncSetIsItemDelete").mockResolvedValue(true);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    store.linkTreeDetailStore.set({
      id: 1, title: "T", type: "public",
      items: [{ id: 100, title: "I", url: "https://i.com" }],
    });
    const { getByTitle } = render(DetailPage, { props: { params: { linkTreeId: 1 } } });
    await fireEvent.click(getByTitle("Hapus"));
    await waitFor(() => expect(del).toHaveBeenCalledWith(1, 100));
  });
});