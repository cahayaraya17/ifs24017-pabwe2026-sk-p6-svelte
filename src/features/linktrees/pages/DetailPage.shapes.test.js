import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import DetailPage from "./DetailPage.svelte";
import {
  linkTreesStore,
  linkTreeDetailStore,
  asyncSetIsLinkTreeGet,
  asyncSetIsLinkTreeDelete,
  asyncSetIsItemDelete,
} from "../states/linkTreesStore";
import { navigate } from "../../../router";

vi.mock("../states/linkTreesStore", async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import("svelte/store");
  return {
    ...actual,
    linkTreesStore: writable({}),
    linkTreeDetailStore: writable(null),
    asyncSetIsLinkTreeGet: vi.fn(),
    asyncSetIsLinkTreeDelete: vi.fn(),
    asyncSetIsItemDelete: vi.fn(),
  };
});

vi.mock("../../../router", async (importOriginal) => ({
  ...(await importOriginal()),
  navigate: vi.fn(),
}));

const pohon = (o = {}) => ({ id: 1, title: "Pohon Uji", type: "public", items: [], ...o });

beforeEach(() => {
  vi.clearAllMocks();
  asyncSetIsLinkTreeGet.mockResolvedValue(undefined);
  asyncSetIsLinkTreeDelete.mockResolvedValue(true);
  asyncSetIsItemDelete.mockResolvedValue(undefined);
  linkTreeDetailStore.set(null);
  linkTreesStore.set({});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DetailPage - isi tampilan", () => {
  it("tanpa type, sampul, deskripsi, dan items", () => {
    linkTreeDetailStore.set({ id: 1, title: "Tanpa Tipe" });
    const { container } = render(DetailPage);
    expect(screen.getByText("Tanpa Tipe")).toBeTruthy();
    expect(screen.getByText("public")).toBeTruthy();
    expect(screen.getByText("Belum ada item tautan yang ditambahkan.")).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
  });

  it("badge untuk tipe unlisted, private, dan tipe lain", async () => {
    linkTreeDetailStore.set(pohon({ type: "unlisted" }));
    render(DetailPage);
    expect(screen.getByText("unlisted")).toBeTruthy();

    linkTreeDetailStore.set(pohon({ type: "private" }));
    await waitFor(() => expect(screen.getByText("private")).toBeTruthy());

    linkTreeDetailStore.set(pohon({ type: "lainnya" }));
    await waitFor(() => expect(screen.getByText("lainnya")).toBeTruthy());
  });

  it("menampilkan sampul dan deskripsi", async () => {
    linkTreeDetailStore.set(
      pohon({ title: "Lengkap", cover: "uploads/sampul.png", description: "Deskripsi uji" })
    );
    const { container } = render(DetailPage);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img.getAttribute("src")).toContain("uploads/sampul.png");
    expect(await screen.findByTestId("markdown-viewer")).toBeTruthy();
  });

  it("memakai linkTree dari linkTreesStore bila detail kosong", () => {
    linkTreesStore.set({ linkTree: pohon({ title: "Dari Store" }) });
    render(DetailPage);
    expect(screen.getByText("Dari Store")).toBeTruthy();
  });

  it("pesan tidak ditemukan bila tidak ada data", () => {
    render(DetailPage);
    expect(
      screen.getByText("Link Tree tidak ditemukan atau tidak dapat diakses.")
    ).toBeTruthy();
  });

  it("pesan memuat selama data diambil, lalu tidak ditemukan", async () => {
    let selesai;
    asyncSetIsLinkTreeGet.mockImplementation(
      () =>
        new Promise((resolve) => {
          selesai = resolve;
        })
    );
    render(DetailPage, { props: { params: { id: 5 } } });
    expect(screen.getByText("Memuat data Link Tree...")).toBeTruthy();

    selesai(true);
    await waitFor(() =>
      expect(
        screen.getByText("Link Tree tidak ditemukan atau tidak dapat diakses.")
      ).toBeTruthy()
    );
  });
});

describe("DetailPage - aksi", () => {
  it("memuat data memakai params.id dan params.linkTreeId", () => {
    linkTreeDetailStore.set(pohon());
    render(DetailPage, { props: { params: { id: 9 } } });
    expect(asyncSetIsLinkTreeGet).toHaveBeenCalledWith(9);
    cleanup();

    render(DetailPage, { props: { params: { linkTreeId: 4 } } });
    expect(asyncSetIsLinkTreeGet).toHaveBeenCalledWith(4);
  });

  it("tombol kembali menavigasi ke beranda", async () => {
    linkTreeDetailStore.set(pohon());
    render(DetailPage);
    await fireEvent.click(screen.getByText("Kembali ke Semua Link Tree"));
    expect(navigate).toHaveBeenCalledWith("/");
  });

  it("tambah, ubah, dan hapus item", async () => {
    linkTreeDetailStore.set(
      pohon({
        items: [
          { id: 11, title: "GitHub", url: "https://github.com" },
          { id: 12, title: "Blog", url: "https://blog.test" },
        ],
      })
    );
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(DetailPage, { props: { params: { id: 9 } } });

    await fireEvent.click(screen.getByText("Tambah Tautan"));
    await fireEvent.click(screen.getAllByTitle("Ubah")[0]);

    await fireEvent.click(screen.getAllByTitle("Hapus")[1]);
    await waitFor(() => expect(asyncSetIsItemDelete).toHaveBeenCalledWith(9, 12));

    asyncSetIsItemDelete.mockClear();
    confirmSpy.mockReturnValue(false);
    await fireEvent.click(screen.getAllByTitle("Hapus")[0]);
    expect(asyncSetIsItemDelete).not.toHaveBeenCalled();
  });

  it("hapus link tree: berhasil, gagal, dan dibatalkan", async () => {
    linkTreeDetailStore.set(pohon());
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(DetailPage, { props: { params: { id: 7 } } });

    await fireEvent.click(screen.getByText("Hapus"));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/"));
    expect(asyncSetIsLinkTreeDelete).toHaveBeenCalledWith(7);

    navigate.mockClear();
    asyncSetIsLinkTreeDelete.mockResolvedValue(false);
    await fireEvent.click(screen.getByText("Hapus"));
    await waitFor(() => expect(asyncSetIsLinkTreeDelete).toHaveBeenCalledTimes(2));
    expect(navigate).not.toHaveBeenCalled();

    confirmSpy.mockReturnValue(false);
    await fireEvent.click(screen.getByText("Hapus"));
    expect(asyncSetIsLinkTreeDelete).toHaveBeenCalledTimes(2);
  });
});