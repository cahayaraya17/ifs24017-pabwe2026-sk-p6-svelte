import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import ChangeModal from "./ChangeModal.svelte";
import * as store from "../states/linkTreesStore";

vi.mock("../components/MarkdownEditor.svelte", async () => ({
  default: (await import("./__stubs__/EditorStub.svelte")).default,
}));

const pohon = { id: 3, title: "Lama", type: "private", description: "Isi" };

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ChangeModal - deskripsi dari editor", () => {
  it("deskripsi yang diubah ikut terkirim saat menyimpan", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeChange").mockResolvedValue(true);
    const { container } = render(ChangeModal, { props: { show: true, linkTree: pohon } });

    expect(screen.getByTestId("editor-stub").value).toBe("Isi");
    await fireEvent.input(screen.getByTestId("editor-stub"), {
      target: { value: "Deskripsi baru" },
    });
    await fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(3, "Lama", "private", "Deskripsi baru")
    );
  });
});