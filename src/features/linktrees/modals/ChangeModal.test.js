import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import ChangeModal from "./ChangeModal.svelte";
import * as linkTreesStore from "../states/linkTreesStore";

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false or linkTree is null", () => {
    const { queryByText } = render(ChangeModal, { props: { show: false, linkTree: null } });
    expect(queryByText("Ubah Link Tree")).toBeNull();
  });

  it("should populate data and submit change", async () => {
    const spyChange = vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeChange").mockResolvedValue(true);
    const mockTree = { id: 1, title: "Lama", type: "unlisted", description: "Desc" };
    const { getByLabelText } = render(ChangeModal, { props: { show: true, linkTree: mockTree } });

    const titleInput = getByLabelText("Judul");
    expect(titleInput.value).toBe("Lama");

    await fireEvent.input(titleInput, { target: { value: "Baru" } });
    const form = titleInput.closest("form");
    await fireEvent.submit(form);

    expect(spyChange).toHaveBeenCalledWith(1, "Baru", "unlisted", "Desc");
  });
});
