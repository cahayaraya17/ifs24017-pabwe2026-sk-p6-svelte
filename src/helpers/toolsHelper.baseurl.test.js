import { describe, it, expect, vi } from "vitest";

vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn(), close: vi.fn() },
}));

describe("toolsHelper - DELCOM_BASEURL terdefinisi", () => {
  it("getImageUrl memakai base URL dari global", async () => {
    vi.stubGlobal("DELCOM_BASEURL", "http://custom.test/api/v1/");
    const mod = await import("./toolsHelper");
    expect(mod.getImageUrl("a.png")).toBe("http://custom.test/a.png");
  });
});