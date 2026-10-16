import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/svelte";
import ChangeCoverModal from "./ChangeCoverModal.svelte";
import { linkTreesStore } from "../states/linkTreesStore";
import * as toolsHelper from "../../../helpers/toolsHelper";

const pohon = { id: 5, title: "Pohon" };

function buatFile(nama, tipe, ukuran = 10) {
  const berkas = new File(["x"], nama, { type: tipe });
  Object.defineProperty(berkas, "size", { value: ukuran });
  return berkas;
}

const formModal = () => screen.getByTestId("submit-cover-modal-btn").closest("form");
const pilihFile = (berkas) =>
  fireEvent.change(screen.getByTestId("cover-file-input"), { target: { files: [berkas] } });

let ubahSpy;
let muatSpy;
let errorSpy;

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview");
  ubahSpy = vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeChangeCover").mockResolvedValue(true);
  muatSpy = vi.spyOn(linkTreesStore, "asyncSetLinkTree").mockResolvedValue(undefined);
  errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  delete URL.createObjectURL;
});

describe("ChangeCoverModal - tampilan", () => {
  it("tidak tampil dan membuka scroll saat show false", () => {
    render(ChangeCoverModal, { props: { show: false, linkTree: pohon } });
    expect(screen.queryByTestId("change-cover-modal")).toBeNull();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("tidak tampil bila linkTree kosong", () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: null } });
    expect(screen.queryByTestId("change-cover-modal")).toBeNull();
  });

  it("tampil dan mengunci scroll saat show true", () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon } });
    expect(screen.getByTestId("change-cover-modal")).toBeTruthy();
    expect(screen.getByText("Klik untuk memilih foto")).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
  });
});

describe("ChangeCoverModal - menutup", () => {
  it("tombol X dan Batal memanggil onClose", async () => {
    const onClose = vi.fn();
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon, onClose } });
    await fireEvent.click(screen.getByTestId("close-cover-modal-btn"));
    await fireEvent.click(screen.getByTestId("cancel-cover-modal-btn"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("menutup tanpa onClose tidak error", async () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon } });
    await fireEvent.click(screen.getByTestId("cancel-cover-modal-btn"));
    expect(screen.getByTestId("change-cover-modal")).toBeTruthy();
  });
});

describe("ChangeCoverModal - memilih file", () => {
  it("tidak ada file dipilih diabaikan", async () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon } });
    await fireEvent.change(screen.getByTestId("cover-file-input"), { target: { files: [] } });
    expect(screen.queryByAltText("Preview")).toBeNull();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("file bukan gambar ditolak", async () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon } });
    await pilihFile(buatFile("a.pdf", "application/pdf"));
    expect(errorSpy).toHaveBeenCalledWith("Pilih file gambar (JPG/PNG)!");
    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("gambar lebih dari 1MB ditolak", async () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon } });
    await pilihFile(buatFile("besar.png", "image/png", 2 * 1024 * 1024));
    expect(errorSpy).toHaveBeenCalledWith("Ukuran gambar maksimal 1MB!");
    expect(screen.queryByAltText("Preview")).toBeNull();
  });

  it("gambar valid menampilkan pratinjau", async () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon } });
    await pilihFile(buatFile("a.png", "image/png"));
    expect(screen.getByAltText("Preview").getAttribute("src")).toBe("blob:preview");
  });
});

describe("ChangeCoverModal - menyimpan", () => {
  it("menyimpan tanpa memilih file menampilkan error", async () => {
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon } });
    await fireEvent.submit(formModal());
    expect(errorSpy).toHaveBeenCalledWith("Silakan pilih cover baru!");
    expect(ubahSpy).not.toHaveBeenCalled();
  });

  it("berhasil: status unggah tampil, data dimuat ulang, lalu modal menutup", async () => {
    let selesai;
    ubahSpy.mockImplementation(
      () =>
        new Promise((resolve) => {
          selesai = resolve;
        })
    );
    const onClose = vi.fn();
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon, onClose } });

    const berkas = buatFile("a.png", "image/png");
    await pilihFile(berkas);
    await fireEvent.submit(formModal());

    expect(await screen.findByText("Mengunggah...")).toBeTruthy();
    expect(screen.getByTestId("submit-cover-modal-btn").disabled).toBe(true);
    expect(screen.getByTestId("cancel-cover-modal-btn").disabled).toBe(true);

    selesai(true);
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(ubahSpy).toHaveBeenCalledWith(5, berkas);
    expect(muatSpy).toHaveBeenCalledWith(5);
  });

  it("gagal: modal tetap terbuka dan tombol kembali normal", async () => {
    ubahSpy.mockResolvedValue(false);
    const onClose = vi.fn();
    render(ChangeCoverModal, { props: { show: true, linkTree: pohon, onClose } });

    await pilihFile(buatFile("a.png", "image/png"));
    await fireEvent.submit(formModal());

    await waitFor(() => expect(ubahSpy).toHaveBeenCalled());
    expect(await screen.findByText("Unggah Cover")).toBeTruthy();
    expect(muatSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});