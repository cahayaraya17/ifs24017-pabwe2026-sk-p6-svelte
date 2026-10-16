import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { get } from "svelte/store";
import linkTreesStore, * as mod from "./linkTreesStore";
import linkTreeApi from "../api/linkTreeApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

let okSpy, errSpy;

beforeEach(() => {
  linkTreesStore.reset();
  okSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
  errSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("linkTreesStore - set/update/reset", () => {
  it("set dengan array mengisi linkTrees", () => {
    linkTreesStore.set([{ id: 1 }]);
    expect(get(linkTreesStore).linkTrees).toEqual([{ id: 1 }]);
  });

  it("set dengan objek mengganti seluruh state", () => {
    linkTreesStore.set({ linkTrees: [{ id: 2 }], foo: 1 });
    expect(get(linkTreesStore).foo).toBe(1);
  });

  it("set dengan null diabaikan", () => {
    linkTreesStore.set([{ id: 1 }]);
    linkTreesStore.set(null);
    expect(get(linkTreesStore).linkTrees).toEqual([{ id: 1 }]);
  });

  it("set dengan string diabaikan", () => {
    linkTreesStore.set([{ id: 1 }]);
    linkTreesStore.set("abc");
    expect(get(linkTreesStore).linkTrees).toEqual([{ id: 1 }]);
  });

  it("update", () => {
    linkTreesStore.update((s) => ({ ...s, isLinkTree: true }));
    expect(get(linkTreesStore).isLinkTree).toBe(true);
  });

  it("reset mengembalikan state awal", () => {
    linkTreesStore.set([{ id: 1 }]);
    linkTreesStore.reset();
    expect(get(linkTreesStore).linkTrees).toEqual([]);
  });
});

describe("linkTreesStore - get wrappers", () => {
  it("asyncSetIsLinkTreesGet", async () => {
    vi.spyOn(linkTreeApi, "getLinkTrees").mockResolvedValue([{ id: 1 }]);
    expect(await mod.asyncSetIsLinkTreesGet("1")).toBe(true);
    expect(get(linkTreesStore).linkTrees).toEqual([{ id: 1 }]);
  });

  it("asyncSetIsLinkTreeGet", async () => {
    vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({ id: 3 });
    expect(await mod.asyncSetIsLinkTreeGet(3)).toBe(true);
    expect(get(mod.linkTreeDetailStore)).toEqual({ id: 3 });
  });
});

describe("linkTreesStore - default parameter & fallback pesan", () => {
  it("add: default type & description, sukses", async () => {
    const spy = vi.spyOn(linkTreeApi, "postLinkTree").mockResolvedValue({});
    expect(await mod.asyncSetIsLinkTreeAdd("T")).toBe(true);
    expect(spy).toHaveBeenCalledWith("T", "public", "");
  });

  it("add: error tanpa message", async () => {
    vi.spyOn(linkTreeApi, "postLinkTree").mockRejectedValue({});
    expect(await mod.asyncSetIsLinkTreeAdd("T")).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Gagal menambahkan linkTree");
  });

  it("change: default type & description", async () => {
    const spy = vi.spyOn(linkTreeApi, "putLinkTree").mockResolvedValue("ok");
    expect(await mod.asyncSetIsLinkTreeChange(1, "T")).toBe(true);
    expect(spy).toHaveBeenCalledWith(1, "T", "public", "");
  });

  it("change: error tanpa message", async () => {
    vi.spyOn(linkTreeApi, "putLinkTree").mockRejectedValue({});
    expect(await mod.asyncSetIsLinkTreeChange(1, "T")).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Gagal mengubah linkTree");
  });

  it("change cover: error tanpa message", async () => {
    vi.spyOn(linkTreeApi, "postLinkTreeCover").mockRejectedValue({});
    expect(await mod.asyncSetIsLinkTreeChangeCover(1, {})).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Gagal mengunggah cover linkTree");
  });

  it("delete: error tanpa message", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTree").mockRejectedValue({});
    expect(await mod.asyncSetIsLinkTreeDelete(1)).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Gagal menghapus linkTree");
  });
});

describe("linkTreesStore - deleteAll", () => {
  it("sukses dengan pesan API", async () => {
    linkTreesStore.set([{ id: 1 }]);
    vi.spyOn(linkTreeApi, "deleteLinkTreesAll").mockResolvedValue("Semua dihapus");
    expect(await mod.asyncSetIsLinkTreeDeleteAll()).toBe(true);
    expect(okSpy).toHaveBeenCalledWith("Semua dihapus");
    expect(get(linkTreesStore).linkTrees).toEqual([]);
  });

  it("sukses dengan pesan fallback", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTreesAll").mockResolvedValue("");
    await mod.asyncSetIsLinkTreeDeleteAll();
    expect(okSpy).toHaveBeenCalledWith("Semua linkTree berhasil dihapus!");
  });

  it("gagal dengan pesan API", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTreesAll").mockRejectedValue(new Error("Boom"));
    expect(await mod.asyncSetIsLinkTreeDeleteAll()).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Boom");
  });

  it("gagal tanpa message", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTreesAll").mockRejectedValue({});
    await mod.asyncSetIsLinkTreeDeleteAll();
    expect(errSpy).toHaveBeenCalledWith("Gagal menghapus semua linkTree");
  });
});

describe("linkTreesStore - item save", () => {
  it("ubah item (itemId ada)", async () => {
    const put = vi.spyOn(linkTreeApi, "putLinkTreeItem").mockResolvedValue("ok");
    expect(await mod.asyncSetIsItemSave(1, 5, "T", "u")).toBe(true);
    expect(put).toHaveBeenCalledWith(1, 5, "T", "u");
    expect(okSpy).toHaveBeenCalledWith("Item berhasil diubah!");
  });

  it("tambah item (itemId kosong)", async () => {
    const post = vi.spyOn(linkTreeApi, "postLinkTreeItem").mockResolvedValue({});
    expect(await mod.asyncSetIsItemSave(1, null, "T", "u")).toBe(true);
    expect(post).toHaveBeenCalledWith(1, "T", "u");
    expect(okSpy).toHaveBeenCalledWith("Item berhasil ditambahkan!");
  });

  it("gagal dengan pesan API", async () => {
    vi.spyOn(linkTreeApi, "postLinkTreeItem").mockRejectedValue(new Error("Item gagal"));
    expect(await mod.asyncSetIsItemSave(1, null, "T", "u")).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Item gagal");
  });

  it("gagal tanpa message", async () => {
    vi.spyOn(linkTreeApi, "putLinkTreeItem").mockRejectedValue({});
    expect(await mod.asyncSetIsItemSave(1, 5, "T", "u")).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Gagal menyimpan item");
  });
});

describe("linkTreesStore - item delete", () => {
  it("sukses dengan pesan API", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockResolvedValue("Terhapus");
    expect(await mod.asyncSetIsItemDelete(1, 2)).toBe(true);
    expect(okSpy).toHaveBeenCalledWith("Terhapus");
  });

  it("sukses dengan pesan fallback", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockResolvedValue("");
    await mod.asyncSetIsItemDelete(1, 2);
    expect(okSpy).toHaveBeenCalledWith("Item berhasil dihapus!");
  });

  it("gagal dengan pesan API", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockRejectedValue(new Error("Hapus gagal"));
    expect(await mod.asyncSetIsItemDelete(1, 2)).toBe(false);
    expect(errSpy).toHaveBeenCalledWith("Hapus gagal");
  });

  it("gagal tanpa message", async () => {
    vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockRejectedValue({});
    await mod.asyncSetIsItemDelete(1, 2);
    expect(errSpy).toHaveBeenCalledWith("Gagal menghapus item");
  });
});

describe("linkTreesStore - useLinkTreesStore", () => {
  it("mengekspos fungsi async dan getter", () => {
    const s = mod.useLinkTreesStore();
    expect(typeof s.asyncSetLinkTrees).toBe("function");
    expect(typeof s.asyncSetIsLinkTreeAdd).toBe("function");
    expect(s.linkTrees).toEqual([]);
  });
});