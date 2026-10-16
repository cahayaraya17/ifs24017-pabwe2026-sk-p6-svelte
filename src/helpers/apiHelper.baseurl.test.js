import { describe, it, expect, vi } from "vitest";

describe("apiHelper - DELCOM_BASEURL terdefinisi", () => {
  it("memakai base URL dari global", async () => {
    vi.stubGlobal("DELCOM_BASEURL", "http://custom.test/api/v1/");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    const mod = await import("./apiHelper");
    await mod.fetchData("/users");
    expect(fetchMock.mock.calls[0][0]).toBe("http://custom.test/api/v1/users");
  });
});