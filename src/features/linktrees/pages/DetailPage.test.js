import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import DetailPage from "./DetailPage.svelte";
import * as linkTreesStore from "../states/linkTreesStore";

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render detail and item list", () => {
    const mockTree = {
      id: 1,
      title: "My Tree",
      type: "public",
      description: "My Bio",
      items: [{ id: 100, title: "My Portfolio", url: "https://portfolio.com" }]
    };
    linkTreesStore.linkTreeDetailStore.set(mockTree);
    vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeGet").mockResolvedValue(true);

    const { getByText } = render(DetailPage, { props: { params: { linkTreeId: 1 } } });

    expect(getByText("My Tree")).toBeTruthy();
    expect(getByText("My Portfolio")).toBeTruthy();
  });

  it("should trigger item delete when confirmed", async () => {
    const spyItemDelete = vi.spyOn(linkTreesStore, "asyncSetIsItemDelete").mockResolvedValue(true);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    const mockTree = {
      id: 1,
      title: "My Tree",
      type: "public",
      items: [{ id: 100, title: "My Portfolio", url: "https://portfolio.com" }]
    };
    linkTreesStore.linkTreeDetailStore.set(mockTree);

    const { getByTitle } = render(DetailPage, { props: { params: { linkTreeId: 1 } } });
    const deleteBtn = getByTitle("Hapus");
    await fireEvent.click(deleteBtn);

    expect(spyItemDelete).toHaveBeenCalledWith(1, 100);
  });
});
