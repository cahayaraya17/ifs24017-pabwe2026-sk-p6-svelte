import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import AddModal from "./AddModal.svelte";
import * as store from "../states/linkTreesStore";

vi.mock("../components/MarkdownEditor.svelte", async () => ({
  default: (await import("./__stubs__/EditorStub.svelte")).default,
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AddModal - deskripsi dari editor", () => {
  it("deskripsi yang diketik ikut terkirim saat menyimpan", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeAdd").mockResolvedValue(true);
    const { container } = render(AddModal, { props: { show: true } });

    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Baru" } });
    await fireEvent.input(screen.getByTestId("editor-stub"), {
      target: { value: "Isi deskripsi" },
    });
    await fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith("Baru", "public", "Isi deskripsi")
    );
  });
});