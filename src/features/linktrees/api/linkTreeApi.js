import apiHelper from "../../../helpers/apiHelper";

const linkTreeApi = {
  async postLinkTree(title, type = "public", description = "") {
    try {
      const response = await apiHelper.post("/link-trees", {
        title,
        type,
        description,
      });
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal menambahkan linkTree");
      }
      throw error;
    }
  },

  async postLinkTreeCover(linkTreeId, file) {
    try {
      const formData = new FormData();
      formData.append("cover", file);
      const response = await apiHelper.post(
        `/link-trees/${linkTreeId}/cover`,
        formData
      );
      return response.message || "Cover berhasil diunggah";
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal mengunggah cover linkTree");
      }
      throw error;
    }
  },

  async putLinkTree(linkTreeId, title, type = "public", description = "") {
    try {
      const response = await apiHelper.put(`/link-trees/${linkTreeId}`, {
        title,
        type,
        description,
      });
      return response.message || "LinkTree berhasil diubah";
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal mengubah linkTree");
      }
      throw error;
    }
  },

  async getLinkTrees(filter) {
    try {
      let url = "/link-trees";
      if (filter !== undefined && filter !== null) {
        url += `?is_finished=${filter}`;
      }
      const response = await apiHelper.get(url);
      if (Array.isArray(response)) return response;
      if (Array.isArray(response.data)) return response.data;
      if (response.data && Array.isArray(response.data.link_trees)) {
        return response.data.link_trees;
      }
      if (response.data && Array.isArray(response.data.linkTrees)) {
        return response.data.linkTrees;
      }
      if (Array.isArray(response.link_trees)) return response.link_trees;
      if (Array.isArray(response.linkTrees)) return response.linkTrees;
      return [];
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal mengambil data linkTree");
      }
      throw error;
    }
  },

  async getLinkTreeById(linkTreeId) {
    try {
      const response = await apiHelper.get(`/link-trees/${linkTreeId}`);
      if (response && response.data && (response.data.link_tree || response.data.linkTree)) {
        return response.data.link_tree || response.data.linkTree;
      }
      if (response && (response.link_tree || response.linkTree)) {
        return response.link_tree || response.linkTree;
      }
      if (response && response.data !== undefined) {
        return response.data;
      }
      return response;
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal mengambil detail linkTree");
      }
      throw error;
    }
  },

  async deleteLinkTree(linkTreeId) {
    try {
      const response = await apiHelper.delete(`/link-trees/${linkTreeId}`);
      return response.message || "LinkTree berhasil dihapus";
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal menghapus linkTree");
      }
      throw error;
    }
  },

  async deleteLinkTreesAll() {
    try {
      const response = await apiHelper.delete("/link-trees");
      return response.message || "Semua linkTree berhasil dihapus";
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal menghapus semua linkTree");
      }
      throw error;
    }
  },

  async postLinkTreeItem(linkTreeId, title, url) {
    try {
      const response = await apiHelper.post(`/link-trees/${linkTreeId}/items`, {
        title,
        url,
      });
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal menambahkan item linkTree");
      }
      throw error;
    }
  },

  async putLinkTreeItem(linkTreeId, itemId, title, url) {
    try {
      const response = await apiHelper.put(
        `/link-trees/${linkTreeId}/items/${itemId}`,
        { title, url }
      );
      return response.message || "Item berhasil diubah";
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal mengubah item linkTree");
      }
      throw error;
    }
  },

  async deleteLinkTreeItem(linkTreeId, itemId) {
    try {
      const response = await apiHelper.delete(
        `/link-trees/${linkTreeId}/items/${itemId}`
      );
      return response.message || "Item berhasil dihapus";
    } catch (error) {
      if (!error || !error.message) {
        throw new Error("Gagal menghapus item linkTree");
      }
      throw error;
    }
  },
};

export default linkTreeApi;
