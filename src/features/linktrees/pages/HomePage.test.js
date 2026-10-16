import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import HomePage from "./HomePage.svelte";
import * as linkTreesStoreModule from "../states/linkTreesStore";

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render statistics and search link trees", async () => {
    const mockTrees = [
      { id: 1, title: "Tree Public", type: "public", user_id: 10, items: [] },
      { id: 2, title: "Tree Private", type: "private", user_id: 11, items: [] }
    ];
    linkTreesStoreModule.linkTreesStore.set(mockTrees);
    vi.spyOn(linkTreesStoreModule.linkTreesStore, "asyncSetIsLinkTreesGet").mockImplementation(async () => {
      linkTreesStoreModule.linkTreesStore.set(mockTrees);
      return true;
    });

    const { findByText, getByText, getByPlaceholderText } = render(HomePage);

    expect(getByText("Public")).toBeTruthy();
    expect(getByText("Private")).toBeTruthy();
    expect(await findByText("Tree Public")).toBeTruthy();

    const searchInput = getByPlaceholderText("Cari Link Tree...");
    await fireEvent.input(searchInput, { target: { value: "Public" } });

    expect(await findByText("Tree Public")).toBeTruthy();
  });

  it("should call asyncSetIsLinkTreeDeleteAll on confirmation", async () => {
    const spyDeleteAll = vi.spyOn(linkTreesStoreModule.linkTreesStore, "asyncSetIsLinkTreeDeleteAll").mockResolvedValue(true);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const { getByText } = render(HomePage);
    const deleteBtn = getByText("Hapus Semua");
    await fireEvent.click(deleteBtn);

    expect(spyDeleteAll).toHaveBeenCalled();
  });
});
