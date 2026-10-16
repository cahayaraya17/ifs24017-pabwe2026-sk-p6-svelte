import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import DetailPage from "./DetailPage.svelte";
import { linkTreeDetailStore, linkTreesStore } from "../states/linkTreesStore";

vi.mock("../components/MarkdownViewer.svelte", async () => ({
  default: (await import("./__stubs__/MarkdownStub.svelte")).default,
}));

beforeEach(() => {
  linkTreeDetailStore.set(null);
});

afterEach(() => {
  cleanup();
  linkTreeDetailStore.set(null);
  linkTreesStore.reset();
});

describe("DetailPage - deskripsi dan item", () => {
  it("meneruskan deskripsi ke penampil markdown", () => {
    linkTreeDetailStore.set({
      id: 1,
      title: "Pohon",
      type: "public",
      description: "Isi deskripsi",
      items: [],
    });
    render(DetailPage);
    expect(screen.getByTestId("markdown-stub").textContent).toBe("Isi deskripsi");
  });

  it("item tanpa url tetap tampil", () => {
    linkTreeDetailStore.set({
      id: 1,
      title: "Pohon",
      type: "public",
      items: [{ id: 7, title: "Tanpa URL" }],
    });
    const { container } = render(DetailPage);
    expect(screen.getByText("Tanpa URL")).toBeTruthy();
    expect(container.querySelector('a[target="_blank"]')).toBeTruthy();
  });
});