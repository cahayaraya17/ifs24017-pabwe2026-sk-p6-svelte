import { describe, it, expect, vi, afterEach } from "vitest";
import { getBaseUrl, fetchData } from "./apiHelper";
import { getImageUrl } from "./toolsHelper";

const FALLBACK = "https://open-api.delcom.org/api/v1";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("apiHelper - base URL", () => {
  it("memakai nilai DELCOM_BASEURL bila ada", () => {
    vi.stubGlobal("DELCOM_BASEURL", "http://custom.test/api/v1");
    expect(getBaseUrl()).toBe("http://custom.test/api/v1");
  });

  it("memakai alamat bawaan bila DELCOM_BASEURL tidak ada", () => {
    vi.stubGlobal("DELCOM_BASEURL", undefined);
    expect(getBaseUrl()).toBe(FALLBACK);
  });

  it("fetchData memakai alamat bawaan", async () => {
    vi.stubGlobal("DELCOM_BASEURL", undefined);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    await fetchData("/auth/login/");
    expect(fetchMock.mock.calls[0][0]).toBe(`${FALLBACK}/auth/login`);
  });

  it("fetchData memakai DELCOM_BASEURL", async () => {
    vi.stubGlobal("DELCOM_BASEURL", "http://custom.test/api/v1/");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    await fetchData("auth/login");
    expect(fetchMock.mock.calls[0][0]).toBe("http://custom.test/api/v1/auth/login");
  });
});

describe("toolsHelper - getImageUrl", () => {
  it("path kosong menghasilkan null", () => {
    expect(getImageUrl("")).toBeNull();
    expect(getImageUrl(undefined)).toBeNull();
  });

  it("URL absolut dikembalikan apa adanya", () => {
    expect(getImageUrl("http://a.test/x.png")).toBe("http://a.test/x.png");
    expect(getImageUrl("https://a.test/x.png")).toBe("https://a.test/x.png");
    expect(getImageUrl("data:image/png;base64,AAA")).toBe("data:image/png;base64,AAA");
  });

  it("path relatif memakai DELCOM_BASEURL", () => {
    vi.stubGlobal("DELCOM_BASEURL", "http://custom.test/api/v1/");
    expect(getImageUrl("uploads/a.png")).toBe("http://custom.test/uploads/a.png");
    expect(getImageUrl("/uploads/a.png")).toBe("http://custom.test/uploads/a.png");
  });

  it("path relatif memakai alamat bawaan bila DELCOM_BASEURL tidak ada", () => {
    vi.stubGlobal("DELCOM_BASEURL", undefined);
    expect(getImageUrl("uploads/a.png")).toBe("https://open-api.delcom.org/uploads/a.png");
  });
});