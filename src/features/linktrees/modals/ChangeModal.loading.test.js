import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import ChangeModal from "./ChangeModal.svelte";
import * as store from "../states/linkTreesStore";

const pohon = { id: 3, title: "Lama", type: "private", description: "Isi" };

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("ChangeModal - status menyimpan", () => {
  it("menampilkan Menyimpan..., lalu kembali ke tombol semula", async () => {
    let selesai;
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeChange").mockImplementation(
      () =>
        new Promise((resolve) => {
          selesai = resolve;
        })
    );
    const { container } = render(ChangeModal, { props: { show: true, linkTree: pohon } });

    expect(screen.getByLabelText("Judul").value).toBe("Lama");
    expect(screen.getByLabelText("Tipe").value).toBe("private");

    await fireEvent.submit(container.querySelector("form"));
    expect(await screen.findByText("Menyimpan...")).toBeTruthy();
    expect(screen.getByLabelText("Judul").disabled).toBe(true);

    selesai(false);
    expect(await screen.findByText("Simpan Perubahan")).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(3, "Lama", "private", expect.any(String));

    spy.mockResolvedValue(true);
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
  });

  it("judul kosong tidak menyimpan", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeChange").mockResolvedValue(true);
    const { container } = render(ChangeModal, { props: { show: true, linkTree: pohon } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "  " } });
    await fireEvent.submit(container.querySelector("form"));
    expect(spy).not.toHaveBeenCalled();
  });

  it("tombol Batal menutup modal tanpa menyimpan", async () => {
    const spy = vi.spyOn(store, "asyncSetIsLinkTreeChange").mockResolvedValue(true);
    render(ChangeModal, { props: { show: true, linkTree: pohon } });
    await fireEvent.click(screen.getByText("Batal"));
    expect(spy).not.toHaveBeenCalled();
  });

  it("tidak tampil bila show false atau linkTree kosong", () => {
    render(ChangeModal, { props: { show: false, linkTree: pohon } });
    expect(screen.queryByText("Ubah Link Tree")).toBeNull();
    cleanup();

    render(ChangeModal, { props: { show: true, linkTree: null } });
    expect(screen.queryByText("Ubah Link Tree")).toBeNull();
  });
});