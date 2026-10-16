import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import AddModal from "./AddModal.svelte";
import * as store from "../states/linkTreesStore";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AddModal - status menyimpan", () => {
  it("menampilkan Menyimpan..., lalu mereset form saat sukses", async () => {
    let selesai;
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeAdd").mockImplementation(
      () =>
        new Promise((resolve) => {
          selesai = resolve;
        })
    );
    const { container } = render(AddModal, { props: { show: true } });

    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Baru" } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "unlisted" } });
    await fireEvent.submit(container.querySelector("form"));

    expect(await screen.findByText("Menyimpan...")).toBeTruthy();
    expect(screen.getByLabelText("Judul").disabled).toBe(true);
    expect(screen.getByLabelText("Tipe").disabled).toBe(true);

    selesai(true);
    await waitFor(() => expect(screen.getByLabelText("Judul").value).toBe(""));
    expect(screen.queryByText("Menyimpan...")).toBeNull();
    expect(screen.getByLabelText("Tipe").value).toBe("public");
    expect(spy).toHaveBeenCalledWith("Baru", "unlisted", expect.any(String));
  });

  it("judul kosong tidak menyimpan", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeAdd").mockResolvedValue(true);
    const { container } = render(AddModal, { props: { show: true } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "   " } });
    await fireEvent.submit(container.querySelector("form"));
    expect(spy).not.toHaveBeenCalled();
  });

  it("tombol Batal dan X mereset form", async () => {
    render(AddModal, { props: { show: true } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Sementara" } });
    await fireEvent.click(screen.getByText("Batal"));
    await waitFor(() => expect(screen.getByLabelText("Judul").value).toBe(""));
  });

  it("tidak menampilkan apa pun saat show false", () => {
    render(AddModal, { props: { show: false } });
    expect(screen.queryByText("Tambah Link Tree")).toBeNull();
  });
});