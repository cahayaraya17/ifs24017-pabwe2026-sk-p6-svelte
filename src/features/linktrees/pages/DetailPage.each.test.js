import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/svelte";
import DetailPage from "./DetailPage.svelte";
import * as store from "../states/linkTreesStore";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const base = { id: 1, title: "T", type: "public" };
const a = { id: 1, title: "A", url: "https://a.com" };
const b = { id: 2, title: "B", url: "https://b.com" };
const c = { id: 3, title: "C", url: "https://c.com" };

describe("DetailPage - perubahan daftar item", () => {
  it("memperbarui, menambah, mengurutkan ulang, dan menghapus item", async () => {
    vi.spyOn(store, "asyncSetIsLinkTreeGet").mockResolvedValue(true);
    store.linkTreeDetailStore.set({ ...base, items: [a, b] });

    const { getByText, queryByText } = render(DetailPage, {
      props: { params: { linkTreeId: 1 } },
    });

    store.linkTreeDetailStore.set({
      ...base,
      items: [{ ...b, title: "B2" }, c, a],
    });
    await waitFor(() => expect(getByText("C")).toBeTruthy());
    expect(getByText("B2")).toBeTruthy();

    store.linkTreeDetailStore.set({ ...base, items: [c] });
    await waitFor(() => expect(queryByText("A")).toBeNull());
    expect(queryByText("B2")).toBeNull();
  });
});