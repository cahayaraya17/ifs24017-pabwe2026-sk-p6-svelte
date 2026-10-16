import { describe, it, expect, vi, afterEach } from "vitest";
import linkTreeApi from "./linkTreeApi";
import apiHelper from "../../../helpers/apiHelper";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("linkTreeApi - tambahan coverage", () => {
  describe("fallback message saat error null/undefined", () => {
    const cases = [
      ["postLinkTree", "post", ["T"], "Gagal menambahkan linkTree"],
      ["postLinkTreeCover", "post", [1, {}], "Gagal mengunggah cover linkTree"],
      ["putLinkTree", "put", [1, "T"], "Gagal mengubah linkTree"],
      ["getLinkTrees", "get", [], "Gagal mengambil data linkTree"],
      ["getLinkTreeById", "get", [1], "Gagal mengambil detail linkTree"],
      ["deleteLinkTree", "delete", [1], "Gagal menghapus linkTree"],
      ["deleteLinkTreesAll", "delete", [], "Gagal menghapus semua linkTree"],
      ["postLinkTreeItem", "post", [1, "T", "u"], "Gagal menambahkan item linkTree"],
      ["putLinkTreeItem", "put", [1, 2, "T", "u"], "Gagal mengubah item linkTree"],
      ["deleteLinkTreeItem", "delete", [1, 2], "Gagal menghapus item linkTree"],
    ];

    it.each(cases)("%s: error null", async (fn, method, args, msg) => {
      vi.spyOn(apiHelper, method).mockRejectedValue(null);
      await expect(linkTreeApi[fn](...args)).rejects.toThrow(msg);
    });

    it.each(cases)("%s: error tanpa message", async (fn, method, args, msg) => {
      vi.spyOn(apiHelper, method).mockRejectedValue({});
      await expect(linkTreeApi[fn](...args)).rejects.toThrow(msg);
    });

    it.each(cases)("%s: error dengan message di-throw ulang", async (fn, method, args) => {
      vi.spyOn(apiHelper, method).mockRejectedValue(new Error("Custom error"));
      await expect(linkTreeApi[fn](...args)).rejects.toThrow("Custom error");
    });
  });

  describe("pesan default saat response tanpa message", () => {
    it("postLinkTreeCover", async () => {
      vi.spyOn(apiHelper, "post").mockResolvedValue({});
      expect(await linkTreeApi.postLinkTreeCover(1, new File(["x"], "c.png"))).toBe("Cover berhasil diunggah");
    });

    it("putLinkTree", async () => {
      vi.spyOn(apiHelper, "put").mockResolvedValue({});
      expect(await linkTreeApi.putLinkTree(1, "T")).toBe("LinkTree berhasil diubah");
    });

    it("deleteLinkTree", async () => {
      vi.spyOn(apiHelper, "delete").mockResolvedValue({});
      expect(await linkTreeApi.deleteLinkTree(1)).toBe("LinkTree berhasil dihapus");
    });

    it("deleteLinkTreesAll", async () => {
      vi.spyOn(apiHelper, "delete").mockResolvedValue({});
      expect(await linkTreeApi.deleteLinkTreesAll()).toBe("Semua linkTree berhasil dihapus");
    });

    it("putLinkTreeItem", async () => {
      vi.spyOn(apiHelper, "put").mockResolvedValue({});
      expect(await linkTreeApi.putLinkTreeItem(1, 2, "T", "u")).toBe("Item berhasil diubah");
    });

    it("deleteLinkTreeItem", async () => {
      vi.spyOn(apiHelper, "delete").mockResolvedValue({});
      expect(await linkTreeApi.deleteLinkTreeItem(1, 2)).toBe("Item berhasil dihapus");
    });
  });

  describe("response tanpa field data", () => {
    it("postLinkTree mengembalikan response utuh", async () => {
      const res = { id: 1 };
      vi.spyOn(apiHelper, "post").mockResolvedValue(res);
      expect(await linkTreeApi.postLinkTree("T")).toEqual(res);
    });

    it("postLinkTreeItem mengembalikan response utuh", async () => {
      const res = { id: 2 };
      vi.spyOn(apiHelper, "post").mockResolvedValue(res);
      expect(await linkTreeApi.postLinkTreeItem(1, "T", "u")).toEqual(res);
    });

    it("postLinkTree memakai default type & description", async () => {
      vi.spyOn(apiHelper, "post").mockResolvedValue({ data: {} });
      await linkTreeApi.postLinkTree("T");
      expect(apiHelper.post).toHaveBeenCalledWith("/link-trees", {
        title: "T",
        type: "public",
        description: "",
      });
    });
  });

  describe("getLinkTrees - variasi bentuk response", () => {
    const list = [{ id: 1 }];

    it("filter null tidak menambah query string", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue([]);
      await linkTreeApi.getLinkTrees(null);
      expect(apiHelper.get).toHaveBeenCalledWith("/link-trees");
    });

    it("response berupa array", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue(list);
      expect(await linkTreeApi.getLinkTrees()).toEqual(list);
    });

    it("response.data berupa array", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: list });
      expect(await linkTreeApi.getLinkTrees()).toEqual(list);
    });

    it("response.data.linkTrees", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: { linkTrees: list } });
      expect(await linkTreeApi.getLinkTrees()).toEqual(list);
    });

    it("response.link_trees", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ link_trees: list });
      expect(await linkTreeApi.getLinkTrees()).toEqual(list);
    });

    it("response.linkTrees", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ linkTrees: list });
      expect(await linkTreeApi.getLinkTrees()).toEqual(list);
    });

    it("response.data ada tapi tidak berisi array", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: {} });
      expect(await linkTreeApi.getLinkTrees()).toEqual([]);
    });
  });

  describe("getLinkTreeById - variasi bentuk response", () => {
    const tree = { id: 5 };

    it("response.data.link_tree", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: { link_tree: tree } });
      expect(await linkTreeApi.getLinkTreeById(5)).toEqual(tree);
    });

    it("response.data.linkTree", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: { linkTree: tree } });
      expect(await linkTreeApi.getLinkTreeById(5)).toEqual(tree);
    });

    it("response.link_tree", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ link_tree: tree });
      expect(await linkTreeApi.getLinkTreeById(5)).toEqual(tree);
    });

    it("response.linkTree", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ linkTree: tree });
      expect(await linkTreeApi.getLinkTreeById(5)).toEqual(tree);
    });

    it("response.data tanpa link_tree mengembalikan data", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: tree });
      expect(await linkTreeApi.getLinkTreeById(5)).toEqual(tree);
    });

    it("response tanpa data mengembalikan response utuh", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({ foo: "bar" });
      expect(await linkTreeApi.getLinkTreeById(5)).toEqual({ foo: "bar" });
    });

    it("response null mengembalikan null", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue(null);
      expect(await linkTreeApi.getLinkTreeById(5)).toBeNull();
    });
  });
});
