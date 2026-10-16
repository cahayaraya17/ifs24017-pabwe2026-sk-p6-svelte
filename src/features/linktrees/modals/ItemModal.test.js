import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import ItemModal from "./ItemModal.svelte";
import * as linkTreesStore from "../states/linkTreesStore";

describe("ItemModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { queryByText } = render(ItemModal, { props: { show: false, linkTreeId: 1 } });
    expect(queryByText("Tambah Item Tautan")).toBeNull();
  });

  it("should save new item when item prop is null", async () => {
    const spySave = vi.spyOn(linkTreesStore, "asyncSetIsItemSave").mockResolvedValue(true);
    const { getByLabelText } = render(ItemModal, { props: { show: true, linkTreeId: 1, item: null } });

    await fireEvent.input(getByLabelText("Judul Tautan"), { target: { value: "GitHub" } });
    await fireEvent.input(getByLabelText("URL"), { target: { value: "https://github.com" } });

    const form = getByLabelText("Judul Tautan").closest("form");
    await fireEvent.submit(form);

    expect(spySave).toHaveBeenCalledWith(1, "", "GitHub", "https://github.com");
  });

  it("should edit existing item", async () => {
    const spySave = vi.spyOn(linkTreesStore, "asyncSetIsItemSave").mockResolvedValue(true);
    const existingItem = { id: 99, title: "Lama", url: "https://old.com" };
    const { getByLabelText } = render(ItemModal, { props: { show: true, linkTreeId: 1, item: existingItem } });

    await fireEvent.input(getByLabelText("Judul Tautan"), { target: { value: "Baru" } });
    const form = getByLabelText("Judul Tautan").closest("form");
    await fireEvent.submit(form);

    expect(spySave).toHaveBeenCalledWith(1, 99, "Baru", "https://old.com");
  });
});
