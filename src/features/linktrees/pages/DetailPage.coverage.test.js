import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import DetailPage from "./DetailPage.svelte";
import * as store from "../states/linkTreesStore";
import * as router from "../../../router";

vi.mock("../modals/ChangeModal.svelte", () => import("./__stubs__/ModalStub.svelte"));
vi.mock("../modals/ChangeCoverModal.svelte", () => import("./__stubs__/ModalStub.svelte"));
vi.mock("../modals/ItemModal.svelte", () => import("./__stubs__/ModalStub.svelte"));

const makeTree = (o = {}) => ({
  id: 1,
  title: "My Tree",
  type: "public",
  items: [{ id: 100, title: "My Portfolio", url: "https://portfolio.com" }],
  ...o,
});

let navSpy, getSpy, delTreeSpy, delItemSpy;

function setup(tree, props = { params: { linkTreeId: 1 } }) {
  store.linkTreeDetailStore.set(tree);
  return render(DetailPage, { props });
}

describe("DetailPage - tambahan coverage", () => {
  beforeEach(() => {
    navSpy = vi.spyOn(router, "navigate").mockImplementation(() => {});
    getSpy = vi.spyOn(store, "asyncSetIsLinkTreeGet").mockResolvedValue(true);
    delTreeSpy = vi.spyOn(store, "asyncSetIsLinkTreeDelete").mockResolvedValue(true);
    delItemSpy = vi.spyOn(store, "asyncSetIsItemDelete").mockResolvedValue(true);
    store.linkTreeDetailStore.set(null);
    store.linkTreesStore.set({ isLinkTree: false, linkTree: null });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe("params & onMount", () => {
    it("tanpa props: tidak memanggil get", () => {
      render(DetailPage);
      expect(getSpy).not.toHaveBeenCalled();
    });

    it("memakai params.id", async () => {
      render(DetailPage, { props: { params: { id: 7 } } });
      await waitFor(() => expect(getSpy).toHaveBeenCalledWith(7));
    });

    it("memakai params.linkTreeId", async () => {
      render(DetailPage, { props: { params: { linkTreeId: 3 } } });
      await waitFor(() => expect(getSpy).toHaveBeenCalledWith(3));
    });
  });

  describe("state tampilan", () => {
    it("menampilkan pesan memuat selama data diambil", async () => {
      getSpy.mockImplementation(() => new Promise(() => {}));
      const { getByText } = render(DetailPage, { props: { params: { id: 1 } } });
      expect(getByText("Memuat data Link Tree...")).toBeTruthy();
    });

    it("pesan memuat hilang setelah data selesai diambil", async () => {
      let selesai;
      getSpy.mockImplementation(
        () =>
          new Promise((resolve) => {
            selesai = resolve;
          })
      );
      const { getByText, queryByText } = render(DetailPage, { props: { params: { id: 1 } } });
      expect(getByText("Memuat data Link Tree...")).toBeTruthy();
      selesai(true);
      await waitFor(() => expect(queryByText("Memuat data Link Tree...")).toBeNull());
      expect(getByText(/tidak ditemukan/)).toBeTruthy();
    });

    it("menampilkan pesan tidak ditemukan", () => {
      store.linkTreesStore.set({ isLinkTree: true, linkTree: null });
      const { getByText } = render(DetailPage);
      expect(getByText(/tidak ditemukan/)).toBeTruthy();
    });

    it("fallback ke linkTreesStore.linkTree", () => {
      store.linkTreesStore.set({ isLinkTree: true, linkTree: makeTree({ title: "Dari Store" }) });
      const { getByText } = render(DetailPage);
      expect(getByText("Dari Store")).toBeTruthy();
    });

    it("menampilkan cover", () => {
      const { container } = setup(makeTree({ cover: "cover.png" }));
      const img = container.querySelector("img");
      expect(img).toBeTruthy();
      expect(img.getAttribute("alt")).toBe("My Tree");
    });

    it("tanpa cover tidak ada img", () => {
      const { container } = setup(makeTree());
      expect(container.querySelector("img")).toBeNull();
    });

    it("tipe unlisted", () => {
      const { getByText } = setup(makeTree({ type: "unlisted" }));
      expect(getByText("unlisted")).toBeTruthy();
    });

    it("tipe private", () => {
      const { getByText } = setup(makeTree({ type: "private" }));
      expect(getByText("private")).toBeTruthy();
    });

    it("tipe kosong jatuh ke public", () => {
      const { getByText } = setup(makeTree({ type: undefined }));
      expect(getByText("public")).toBeTruthy();
    });

    it("menampilkan deskripsi", () => {
      const { container } = setup(makeTree({ description: "Bio saya" }));
      expect(container.querySelector(".mt-3")).toBeTruthy();
    });

    it("tanpa deskripsi", () => {
      const { container } = setup(makeTree({ description: "" }));
      expect(container.querySelector(".mt-3")).toBeNull();
    });

    it("items undefined menampilkan pesan kosong", () => {
      const { getByText } = setup(makeTree({ items: undefined }));
      expect(getByText("Belum ada item tautan yang ditambahkan.")).toBeTruthy();
    });

    it("items kosong menampilkan pesan kosong", () => {
      const { getByText } = setup(makeTree({ items: [] }));
      expect(getByText("Belum ada item tautan yang ditambahkan.")).toBeTruthy();
    });
  });

  describe("navigasi", () => {
    it("link kembali memanggil navigate('/')", async () => {
      const { getByText } = setup(makeTree());
      await fireEvent.click(getByText("Kembali ke Semua Link Tree"));
      expect(navSpy).toHaveBeenCalledWith("/");
    });
  });

  describe("hapus link tree", () => {
    it("dikonfirmasi & sukses: navigate ke /", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      const { getAllByText } = setup(makeTree());
      await fireEvent.click(getAllByText("Hapus")[0]);
      await waitFor(() => expect(navSpy).toHaveBeenCalledWith("/"));
      expect(delTreeSpy).toHaveBeenCalledWith(1);
    });

    it("dikonfirmasi tapi gagal: tidak navigate", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(true);
      delTreeSpy.mockResolvedValue(false);
      const { getAllByText } = setup(makeTree());
      await fireEvent.click(getAllByText("Hapus")[0]);
      await waitFor(() => expect(delTreeSpy).toHaveBeenCalled());
      expect(navSpy).not.toHaveBeenCalled();
    });

    it("dibatalkan: tidak menghapus", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);
      const { getAllByText } = setup(makeTree());
      await fireEvent.click(getAllByText("Hapus")[0]);
      expect(delTreeSpy).not.toHaveBeenCalled();
    });
  });

  describe("item", () => {
    it("tambah item membuka modal lalu menutupnya", async () => {
      const { getByText, queryByTestId, getByTestId } = setup(makeTree());
      expect(queryByTestId("stub-close")).toBeNull();
      await fireEvent.click(getByText("Tambah Tautan"));
      await fireEvent.click(getByTestId("stub-close"));
      expect(queryByTestId("stub-close")).toBeNull();
    });

    it("ubah item membuka modal lalu menutupnya", async () => {
      const { getByTitle, queryByTestId, getByTestId } = setup(makeTree());
      await fireEvent.click(getByTitle("Ubah"));
      await fireEvent.click(getByTestId("stub-close"));
      expect(queryByTestId("stub-close")).toBeNull();
    });

    it("hapus item dibatalkan", async () => {
      vi.spyOn(window, "confirm").mockReturnValue(false);
      const { getByTitle } = setup(makeTree());
      await fireEvent.click(getByTitle("Hapus"));
      expect(delItemSpy).not.toHaveBeenCalled();
    });
  });

  describe("modal tree", () => {
    it("modal Ganti Sampul dibuka dan ditutup", async () => {
      const { getAllByText, queryByTestId, getByTestId } = setup(makeTree());
      await fireEvent.click(getAllByText("Ganti Sampul")[0]);
      await fireEvent.click(getByTestId("stub-close"));
      expect(queryByTestId("stub-close")).toBeNull();
    });

    it("modal Ubah dibuka dan ditutup", async () => {
      const { getAllByText, queryByTestId, getByTestId } = setup(makeTree());
      await fireEvent.click(getAllByText("Ubah")[0]);
      await fireEvent.click(getByTestId("stub-close"));
      expect(queryByTestId("stub-close")).toBeNull();
    });
  });
});
