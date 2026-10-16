import { writable } from "svelte/store";
import linkTreeApi from "../api/linkTreeApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

const defaultState = {
  linkTrees: [],
  linkTree: null,
  isLinkTreeLoading: false,
  isLinkTree: false,
  isLinkTreeAdd: false,
  isLinkTreeAdded: false,
  isLinkTreeChange: false,
  isLinkTreeChanged: false,
  isLinkTreeChangeCover: false,
  isLinkTreeChangedCover: false,
  isLinkTreeDelete: false,
  isLinkTreeDeleted: false,
};

const storeData = writable({ ...defaultState });

export const linkTreesStore = {
  subscribe: storeData.subscribe,
  set: (val) => {
    if (Array.isArray(val)) {
      storeData.update((s) => ({ ...s, linkTrees: val }));
    } else if (typeof val === "object" && val !== null) {
      storeData.set(val);
    }
  },
  update: storeData.update,
  $state: { ...defaultState },
  reset() {
    this.$state = { ...defaultState };
    storeData.set({ ...defaultState });
  },
};

storeData.subscribe((state) => {
  linkTreesStore.$state = state;
  linkTreesStore.linkTrees = state.linkTrees;
  linkTreesStore.linkTree = state.linkTree;
  linkTreesStore.isLinkTreeLoading = state.isLinkTreeLoading;
  linkTreesStore.isLinkTree = state.isLinkTree;
  linkTreesStore.isLinkTreeAdd = state.isLinkTreeAdd;
  linkTreesStore.isLinkTreeAdded = state.isLinkTreeAdded;
  linkTreesStore.isLinkTreeChange = state.isLinkTreeChange;
  linkTreesStore.isLinkTreeChanged = state.isLinkTreeChanged;
  linkTreesStore.isLinkTreeChangeCover = state.isLinkTreeChangeCover;
  linkTreesStore.isLinkTreeChangedCover = state.isLinkTreeChangedCover;
  linkTreesStore.isLinkTreeDelete = state.isLinkTreeDelete;
  linkTreesStore.isLinkTreeDeleted = state.isLinkTreeDeleted;
});

export const linkTreeDetailStore = writable(null);
export const isLinkTreeLoading = writable(false);
export const isLinkTreeAdd = writable(false);
export const isLinkTreeAdded = writable(false);
export const isLinkTreeChange = writable(false);
export const isLinkTreeChanged = writable(false);
export const isLinkTreeChangeCover = writable(false);
export const isLinkTreeChangedCover = writable(false);
export const isLinkTreeDelete = writable(false);
export const isLinkTreeDeleted = writable(false);

const setters = {
  setLinkTrees(items) { storeData.update((s) => ({ ...s, linkTrees: items })); },
  setLinkTree(item) { storeData.update((s) => ({ ...s, linkTree: item })); },
  setIsLinkTreeLoading(val) { storeData.update((s) => ({ ...s, isLinkTreeLoading: val })); },
  setIsLinkTree(val) { storeData.update((s) => ({ ...s, isLinkTree: val })); },
  setIsLinkTreeAdd(val) { storeData.update((s) => ({ ...s, isLinkTreeAdd: val })); },
  setIsLinkTreeAdded(val) { storeData.update((s) => ({ ...s, isLinkTreeAdded: val })); },
  setIsLinkTreeChange(val) { storeData.update((s) => ({ ...s, isLinkTreeChange: val })); },
  setIsLinkTreeChanged(val) { storeData.update((s) => ({ ...s, isLinkTreeChanged: val })); },
  setIsLinkTreeChangeCover(val) { storeData.update((s) => ({ ...s, isLinkTreeChangeCover: val })); },
  setIsLinkTreeChangedCover(val) { storeData.update((s) => ({ ...s, isLinkTreeChangedCover: val })); },
  setIsLinkTreeDelete(val) { storeData.update((s) => ({ ...s, isLinkTreeDelete: val })); },
  setIsLinkTreeDeleted(val) { storeData.update((s) => ({ ...s, isLinkTreeDeleted: val })); },
};

Object.assign(linkTreesStore, setters);

export function useLinkTreesStore() {
  return {
    get linkTrees() { return linkTreesStore.$state.linkTrees; },
    get linkTree() { return linkTreesStore.$state.linkTree; },
    get isLinkTreeLoading() { return linkTreesStore.$state.isLinkTreeLoading; },
    get isLinkTree() { return linkTreesStore.$state.isLinkTree; },
    get isLinkTreeAdd() { return linkTreesStore.$state.isLinkTreeAdd; },
    get isLinkTreeAdded() { return linkTreesStore.$state.isLinkTreeAdded; },
    get isLinkTreeChange() { return linkTreesStore.$state.isLinkTreeChange; },
    get isLinkTreeChanged() { return linkTreesStore.$state.isLinkTreeChanged; },
    get isLinkTreeChangeCover() { return linkTreesStore.$state.isLinkTreeChangeCover; },
    get isLinkTreeChangedCover() { return linkTreesStore.$state.isLinkTreeChangedCover; },
    get isLinkTreeDelete() { return linkTreesStore.$state.isLinkTreeDelete; },
    get isLinkTreeDeleted() { return linkTreesStore.$state.isLinkTreeDeleted; },

    ...setters,

    asyncSetLinkTrees,
    asyncSetLinkTree,
    asyncSetIsLinkTreeAdd,
    asyncSetIsLinkTreeChange,
    asyncSetIsLinkTreeChangeCover,
    asyncSetIsLinkTreeDelete,
  };
}

export async function asyncSetLinkTrees(filter) {
  try {
    const data = await linkTreeApi.getLinkTrees(filter);
    storeData.update((s) => ({ ...s, linkTrees: data }));
  } catch (error) {
    storeData.update((s) => ({ ...s, linkTrees: [] }));
  }
}

export async function asyncSetLinkTree(linkTreeId) {
  try {
    storeData.update((s) => ({ ...s, isLinkTree: false }));
    const data = await linkTreeApi.getLinkTreeById(linkTreeId);
    storeData.update((s) => ({ ...s, linkTree: data, isLinkTree: true }));
    linkTreeDetailStore.set(data);
  } catch (error) {
    storeData.update((s) => ({ ...s, linkTree: null, isLinkTree: true }));
    linkTreeDetailStore.set(null);
  }
}

export async function asyncSetIsLinkTreesGet(filter) {
  await asyncSetLinkTrees(filter);
  return true;
}

export async function asyncSetIsLinkTreeGet(linkTreeId) {
  await asyncSetLinkTree(linkTreeId);
  return true;
}

export async function asyncSetIsLinkTreeAdd(title, type = "public", description = "") {
  try {
    storeData.update((s) => ({ ...s, isLinkTreeAdd: true, isLinkTreeAdded: false }));
    await linkTreeApi.postLinkTree(title, type, description);
    storeData.update((s) => ({ ...s, isLinkTreeAdded: true }));
    toolsHelper.showSuccessDialog("LinkTree berhasil ditambahkan!");
    return true;
  } catch (error) {
    toolsHelper.showErrorDialog(error.message || "Gagal menambahkan linkTree");
    return false;
  }
}

export async function asyncSetIsLinkTreeChange(linkTreeId, title, type = "public", description = "") {
  try {
    storeData.update((s) => ({ ...s, isLinkTreeChange: true, isLinkTreeChanged: false }));
    const msg = await linkTreeApi.putLinkTree(linkTreeId, title, type, description);
    storeData.update((s) => ({ ...s, isLinkTreeChanged: true }));
    toolsHelper.showSuccessDialog(msg || "LinkTree berhasil diperbarui!");
    return true;
  } catch (error) {
    toolsHelper.showErrorDialog(error.message || "Gagal mengubah linkTree");
    return false;
  }
}

export async function asyncSetIsLinkTreeChangeCover(linkTreeId, file) {
  try {
    storeData.update((s) => ({ ...s, isLinkTreeChangeCover: true, isLinkTreeChangedCover: false }));
    const msg = await linkTreeApi.postLinkTreeCover(linkTreeId, file);
    storeData.update((s) => ({ ...s, isLinkTreeChangedCover: true }));
    toolsHelper.showSuccessDialog(msg || "Cover berhasil diperbarui!");
    return true;
  } catch (error) {
    toolsHelper.showErrorDialog(error.message || "Gagal mengunggah cover linkTree");
    return false;
  }
}

export async function asyncSetIsLinkTreeDelete(linkTreeId) {
  try {
    storeData.update((s) => ({ ...s, isLinkTreeDelete: true, isLinkTreeDeleted: false }));
    const msg = await linkTreeApi.deleteLinkTree(linkTreeId);
    storeData.update((s) => ({ ...s, isLinkTreeDeleted: true }));
    toolsHelper.showSuccessDialog(msg || "LinkTree berhasil dihapus!");
    return true;
  } catch (error) {
    toolsHelper.showErrorDialog(error.message || "Gagal menghapus linkTree");
    return false;
  }
}

export async function asyncSetIsLinkTreeDeleteAll() {
  try {
    const msg = await linkTreeApi.deleteLinkTreesAll();
    toolsHelper.showSuccessDialog(msg || "Semua linkTree berhasil dihapus!");
    storeData.update((s) => ({ ...s, linkTrees: [] }));
    return true;
  } catch (error) {
    toolsHelper.showErrorDialog(error.message || "Gagal menghapus semua linkTree");
    return false;
  }
}

export async function asyncSetIsItemSave(linkTreeId, itemId, title, url) {
  try {
    if (itemId) {
      await linkTreeApi.putLinkTreeItem(linkTreeId, itemId, title, url);
      toolsHelper.showSuccessDialog("Item berhasil diubah!");
    } else {
      await linkTreeApi.postLinkTreeItem(linkTreeId, title, url);
      toolsHelper.showSuccessDialog("Item berhasil ditambahkan!");
    }
    return true;
  } catch (error) {
    toolsHelper.showErrorDialog(error.message || "Gagal menyimpan item");
    return false;
  }
}

export async function asyncSetIsItemDelete(linkTreeId, itemId) {
  try {
    const msg = await linkTreeApi.deleteLinkTreeItem(linkTreeId, itemId);
    toolsHelper.showSuccessDialog(msg || "Item berhasil dihapus!");
    return true;
  } catch (error) {
    toolsHelper.showErrorDialog(error.message || "Gagal menghapus item");
    return false;
  }
}

linkTreesStore.asyncSetLinkTrees = asyncSetLinkTrees;
linkTreesStore.asyncSetLinkTree = asyncSetLinkTree;
linkTreesStore.asyncSetIsLinkTreesGet = asyncSetIsLinkTreesGet;
linkTreesStore.asyncSetIsLinkTreeGet = asyncSetIsLinkTreeGet;
linkTreesStore.asyncSetIsLinkTreeAdd = asyncSetIsLinkTreeAdd;
linkTreesStore.asyncSetIsLinkTreeChange = asyncSetIsLinkTreeChange;
linkTreesStore.asyncSetIsLinkTreeChangeCover = asyncSetIsLinkTreeChangeCover;
linkTreesStore.asyncSetIsLinkTreeDelete = asyncSetIsLinkTreeDelete;
linkTreesStore.asyncSetIsLinkTreeDeleteAll = asyncSetIsLinkTreeDeleteAll;
linkTreesStore.asyncSetIsItemSave = asyncSetIsItemSave;
linkTreesStore.asyncSetIsItemDelete = asyncSetIsItemDelete;

export default linkTreesStore;
