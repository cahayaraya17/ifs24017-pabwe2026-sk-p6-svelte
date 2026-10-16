import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(), close: vi.fn() },
}));

import { getImageUrl } from "./toolsHelper";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("toolsHelper - getImageUrl", () => {
  it("path kosong mengembalikan null", () => {
    expect(getImageUrl("")).toBeNull();
    expect(getImageUrl(null)).toBeNull();
    expect(getImageUrl(undefined)).toBeNull();
  });

  it("http dikembalikan apa adanya", () => {
    expect(getImageUrl("http://a.com/x.png")).toBe("http://a.com/x.png");
  });

  it("https dikembalikan apa adanya", () => {
    expect(getImageUrl("https://a.com/x.png")).toBe("https://a.com/x.png");
  });

  it("data URI dikembalikan apa adanya", () => {
    expect(getImageUrl("data:image/png;base64,AAA")).toBe("data:image/png;base64,AAA");
  });

  it("path dengan slash di depan", () => {
    expect(getImageUrl("/uploads/a.png")).toBe("https://open-api.delcom.org/uploads/a.png");
  });

  it("path tanpa slash di depan", () => {
    expect(getImageUrl("uploads/a.png")).toBe("https://open-api.delcom.org/uploads/a.png");
  });

  it("memakai DELCOM_BASEURL bila terdefinisi", async () => {
    vi.resetModules();
    vi.stubGlobal("DELCOM_BASEURL", "http://custom.test/api/v1/");
    const mod = await import("./toolsHelper");
    expect(mod.getImageUrl("a.png")).toBe("http://custom.test/a.png");
  });
});