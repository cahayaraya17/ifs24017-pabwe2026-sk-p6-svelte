import { describe, it, expect, vi, beforeEach } from "vitest";
import linkTreeApi from "./linkTreeApi";
import apiHelper from "../../../helpers/apiHelper";

describe("linkTreeApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("postLinkTree", () => {
    it("should create new linkTree and return data", async () => {
      const mockData = { id: 1, title: "My Tree", type: "public" };
      vi.spyOn(apiHelper, "post").mockResolvedValue({ data: mockData });

      const res = await linkTreeApi.postLinkTree("My Tree", "public", "Desc");
      expect(res).toEqual(mockData);
      expect(apiHelper.post).toHaveBeenCalledWith("/link-trees", {
        title: "My Tree",
        type: "public",
        description: "Desc",
      });
    });

    it("should throw error if creation fails", async () => {
      vi.spyOn(apiHelper, "post").mockRejectedValue(new Error("Network error"));
      await expect(linkTreeApi.postLinkTree("T", "public")).rejects.toThrow("Network error");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "post").mockRejectedValue({});
      await expect(linkTreeApi.postLinkTree("T", "public")).rejects.toThrow("Gagal menambahkan linkTree");
    });
  });

  describe("postLinkTreeCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      const file = new File(["test"], "cover.png", { type: "image/png" });
      vi.spyOn(apiHelper, "post").mockResolvedValue({ message: "Cover berhasil diunggah" });

      const msg = await linkTreeApi.postLinkTreeCover(1, file);
      expect(msg).toBe("Cover berhasil diunggah");
      expect(apiHelper.post).toHaveBeenCalled();
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "post").mockRejectedValue(new Error("Upload fail"));
      await expect(linkTreeApi.postLinkTreeCover(1, {})).rejects.toThrow("Upload fail");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "post").mockRejectedValue({});
      await expect(linkTreeApi.postLinkTreeCover(1, {})).rejects.toThrow("Gagal mengunggah cover linkTree");
    });
  });

  describe("putLinkTree", () => {
    it("should update linkTree and return message on success", async () => {
      vi.spyOn(apiHelper, "put").mockResolvedValue({ message: "LinkTree berhasil diubah" });

      const msg = await linkTreeApi.putLinkTree(1, "Title", "public", "Desc");
      expect(msg).toBe("LinkTree berhasil diubah");
      expect(apiHelper.put).toHaveBeenCalledWith("/link-trees/1", {
        title: "Title",
        type: "public",
        description: "Desc",
      });
    });

    it("should throw error on update failure", async () => {
      vi.spyOn(apiHelper, "put").mockRejectedValue(new Error("Update fail"));
      await expect(linkTreeApi.putLinkTree(1, "T")).rejects.toThrow("Update fail");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "put").mockRejectedValue({});
      await expect(linkTreeApi.putLinkTree(1, "T")).rejects.toThrow("Gagal mengubah linkTree");
    });
  });

  describe("getLinkTrees", () => {
    it("should fetch all linkTrees", async () => {
      const mockList = [{ id: 1, title: "Tree 1" }];
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: { link_trees: mockList } });

      const res = await linkTreeApi.getLinkTrees();
      expect(res).toEqual(mockList);
    });

    it("should fetch linkTrees with filter query", async () => {
      const mockList = [{ id: 2, title: "Tree 2" }];
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: { link_trees: mockList } });

      const res = await linkTreeApi.getLinkTrees("1");
      expect(res).toEqual(mockList);
      expect(apiHelper.get).toHaveBeenCalledWith("/link-trees?is_finished=1");
    });

    it("should return empty array if link_trees data missing", async () => {
      vi.spyOn(apiHelper, "get").mockResolvedValue({});
      const res = await linkTreeApi.getLinkTrees();
      expect(res).toEqual([]);
    });

    it("should throw error on fetch fail", async () => {
      vi.spyOn(apiHelper, "get").mockRejectedValue(new Error("Fetch fail"));
      await expect(linkTreeApi.getLinkTrees()).rejects.toThrow("Fetch fail");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "get").mockRejectedValue({});
      await expect(linkTreeApi.getLinkTrees()).rejects.toThrow("Gagal mengambil data linkTree");
    });
  });

  describe("getLinkTreeById", () => {
    it("should return single linkTree object on success", async () => {
      const mockTree = { id: 5, title: "Single" };
      vi.spyOn(apiHelper, "get").mockResolvedValue({ data: { link_tree: mockTree } });

      const res = await linkTreeApi.getLinkTreeById(5);
      expect(res).toEqual(mockTree);
    });

    it("should throw error on detail fail", async () => {
      vi.spyOn(apiHelper, "get").mockRejectedValue(new Error("Detail fail"));
      await expect(linkTreeApi.getLinkTreeById(999)).rejects.toThrow("Detail fail");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "get").mockRejectedValue({});
      await expect(linkTreeApi.getLinkTreeById(999)).rejects.toThrow("Gagal mengambil detail linkTree");
    });
  });

  describe("deleteLinkTree & deleteLinkTreesAll", () => {
    it("should delete single linkTree", async () => {
      vi.spyOn(apiHelper, "delete").mockResolvedValue({ message: "LinkTree berhasil dihapus" });
      const msg = await linkTreeApi.deleteLinkTree(1);
      expect(msg).toBe("LinkTree berhasil dihapus");
    });

    it("should use fallback error message on deleteLinkTree fail", async () => {
      vi.spyOn(apiHelper, "delete").mockRejectedValue({});
      await expect(linkTreeApi.deleteLinkTree(1)).rejects.toThrow("Gagal menghapus linkTree");
    });

    it("should delete all linkTrees", async () => {
      vi.spyOn(apiHelper, "delete").mockResolvedValue({ message: "Semua linkTree berhasil dihapus" });
      const msg = await linkTreeApi.deleteLinkTreesAll();
      expect(msg).toBe("Semua linkTree berhasil dihapus");
    });

    it("should use fallback error message on deleteLinkTreesAll fail", async () => {
      vi.spyOn(apiHelper, "delete").mockRejectedValue({});
      await expect(linkTreeApi.deleteLinkTreesAll()).rejects.toThrow("Gagal menghapus semua linkTree");
    });
  });

  describe("Items API", () => {
    it("should post linkTree item", async () => {
      const itemData = { id: 10, title: "GitHub", url: "https://github.com" };
      vi.spyOn(apiHelper, "post").mockResolvedValue({ data: itemData });

      const res = await linkTreeApi.postLinkTreeItem(1, "GitHub", "https://github.com");
      expect(res).toEqual(itemData);
    });

    it("should put linkTree item", async () => {
      vi.spyOn(apiHelper, "put").mockResolvedValue({ message: "Item berhasil diubah" });
      const msg = await linkTreeApi.putLinkTreeItem(1, 10, "GitLab", "https://gitlab.com");
      expect(msg).toBe("Item berhasil diubah");
    });

    it("should delete linkTree item", async () => {
      vi.spyOn(apiHelper, "delete").mockResolvedValue({ message: "Item berhasil dihapus" });
      const msg = await linkTreeApi.deleteLinkTreeItem(1, 10);
      expect(msg).toBe("Item berhasil dihapus");
    });
  });
});
