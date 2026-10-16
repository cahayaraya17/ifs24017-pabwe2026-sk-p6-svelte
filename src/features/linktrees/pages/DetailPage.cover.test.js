import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import DetailPage from "./DetailPage.svelte";
import { linkTreeDetailStore, linkTreesStore } from "../states/linkTreesStore";

beforeEach(() => {
  linkTreeDetailStore.set({ id: 1, title: "Pohon Uji", type: "public", items: [] });
});

afterEach(() => {
  cleanup();
  linkTreeDetailStore.set(null);
  linkTreesStore.reset();
});

describe("DetailPage - ganti sampul", () => {
  it("tombol Ganti Sampul membuka dan menutup modal sampul", async () => {
    render(DetailPage);
    expect(screen.queryByTestId("change-cover-modal")).toBeNull();

    await fireEvent.click(screen.getByText("Ganti Sampul"));
    expect(await screen.findByTestId("change-cover-modal")).toBeTruthy();

    await fireEvent.click(screen.getByTestId("close-cover-modal-btn"));
    await waitFor(() => expect(screen.queryByTestId("change-cover-modal")).toBeNull());
  });
});