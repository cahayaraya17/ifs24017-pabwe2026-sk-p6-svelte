import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import AddModal from "./AddModal.svelte";
import * as linkTreesStore from "../states/linkTreesStore";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { queryByText } = render(AddModal, { props: { show: false } });
    expect(queryByText("Tambah Link Tree")).toBeNull();
  });

  it("should render and handle submit correctly", async () => {
    const spyAdd = vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeAdd").mockResolvedValue(true);
    const { getByLabelText, getByRole } = render(AddModal, { props: { show: true } });

    const titleInput = getByLabelText("Judul");
    await fireEvent.input(titleInput, { target: { value: "Tautan Saya" } });

    const form = titleInput.closest("form");
    await fireEvent.submit(form);

    expect(spyAdd).toHaveBeenCalledWith("Tautan Saya", "public", "");
  });

  it("should not submit if title is empty", async () => {
    const spyAdd = vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeAdd").mockResolvedValue(true);
    const { getByLabelText } = render(AddModal, { props: { show: true } });

    const titleInput = getByLabelText("Judul");
    const form = titleInput.closest("form");
    await fireEvent.submit(form);

    expect(spyAdd).not.toHaveBeenCalled();
  });
});
