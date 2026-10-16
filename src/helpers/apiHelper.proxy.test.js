import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

const okResponse = () => ({
  ok: true,
  status: 200,
  json: async () => ({ status: "success", data: { user: { id: 1 }, token: "tkn" } }),
});

describe("apiHelper - proxy same-origin (DELCOM_API_URL)", () => {
  let fetchMock;

  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("DELCOM_API_URL", "/delcom-api");
    fetchMock = vi.fn().mockResolvedValue(okResponse());
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getBaseUrl memprioritaskan DELCOM_API_URL", async () => {
    const { getBaseUrl } = await import("./apiHelper");
    expect(getBaseUrl()).toBe("/delcom-api");
  });

  it("fetchData dengan path relatif diawali /delcom-api", async () => {
    const { fetchData } = await import("./apiHelper");
    await fetchData("/link-trees");
    expect(fetchMock.mock.calls[0][0]).toBe("/delcom-api/link-trees");
  });

  it("fetchData tidak menggandakan prefix pada URL yang sudah lengkap", async () => {
    const { fetchData } = await import("./apiHelper");
    await fetchData("/delcom-api/users/");
    expect(fetchMock.mock.calls[0][0]).toBe("/delcom-api/users");
  });

  it("userApi.getProfile memanggil /delcom-api/users/me", async () => {
    localStorage.setItem("accessToken", "tkn");
    const { default: userApi } = await import("../features/users/api/userApi");
    await userApi.getProfile();
    expect(fetchMock.mock.calls[0][0]).toBe("/delcom-api/users/me");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer tkn");
    localStorage.removeItem("accessToken");
  });

  it("authApi.postLogin memanggil /delcom-api/auth/login", async () => {
    const { default: authApi } = await import("../features/auth/api/authApi");
    await authApi.postLogin("a@a.com", "secret");
    expect(fetchMock.mock.calls[0][0]).toBe("/delcom-api/auth/login");
  });
});
