import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import apiHelper, { getAccessToken, putAccessToken, fetchData } from "./apiHelper";

const res = (data, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
});

let fetchMock;

beforeEach(() => {
  localStorage.clear();
  fetchMock = vi.fn().mockResolvedValue(res({ ok: 1 }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("apiHelper - token tanpa window / localStorage", () => {
  it("getAccessToken: window undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(getAccessToken()).toBeNull();
  });

  it("getAccessToken: localStorage tidak ada", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(getAccessToken()).toBeNull();
  });

  it("putAccessToken: window undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(() => putAccessToken("x")).not.toThrow();
  });

  it("putAccessToken: localStorage tidak ada", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(() => putAccessToken("x")).not.toThrow();
  });
});

describe("apiHelper - fetchData", () => {
  it("endpoint relatif memakai base URL default", async () => {
    await fetchData("/users/");
    expect(fetchMock.mock.calls[0][0]).toBe("https://open-api.delcom.org/api/v1/users");
  });

  it("endpoint tanpa slash di depan", async () => {
    await fetchData("users");
    expect(fetchMock.mock.calls[0][0]).toBe("https://open-api.delcom.org/api/v1/users");
  });

  it("endpoint undefined dan options default", async () => {
    await fetchData();
    expect(fetchMock.mock.calls[0][0]).toBe("https://open-api.delcom.org/api/v1/");
  });

  it("POST string body menambah Content-Type", async () => {
    await fetchData("x", { method: "POST", body: "{}" });
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBe("application/json");
  });

  it("POST FormData tidak menambah Content-Type", async () => {
    await fetchData("x", { method: "POST", body: new FormData() });
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBeUndefined();
  });

  it("Content-Type yang sudah ada dipertahankan", async () => {
    await fetchData("x", { method: "POST", body: "a", headers: { "Content-Type": "text/plain" } });
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBe("text/plain");
  });

  it("tanpa method tidak menambah Content-Type", async () => {
    await fetchData("x", { body: "a" });
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBeUndefined();
  });

  it("GET tidak menambah Content-Type", async () => {
    await fetchData("x", { method: "GET" });
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBeUndefined();
  });
});

describe("apiHelper - request lewat get/post/put/delete", () => {
  it("get sukses tanpa options", async () => {
    expect(await apiHelper.get("/a")).toEqual({ ok: 1 });
    expect(fetchMock.mock.calls[0][1].method).toBe("GET");
  });

  it("get dengan options", async () => {
    await apiHelper.get("/a", { headers: { X: "1" } });
    expect(fetchMock.mock.calls[0][1].headers.X).toBe("1");
  });

  it("post body objek di-stringify", async () => {
    await apiHelper.post("/a", { n: 1 });
    expect(fetchMock.mock.calls[0][1].body).toBe('{"n":1}');
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  it("post FormData dikirim apa adanya", async () => {
    const fd = new FormData();
    await apiHelper.post("/a", fd, {});
    expect(fetchMock.mock.calls[0][1].body).toBe(fd);
  });

  it("put body objek di-stringify", async () => {
    await apiHelper.put("/a", { n: 2 });
    expect(fetchMock.mock.calls[0][1].body).toBe('{"n":2}');
    expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
  });

  it("put FormData dikirim apa adanya", async () => {
    const fd = new FormData();
    await apiHelper.put("/a", fd, {});
    expect(fetchMock.mock.calls[0][1].body).toBe(fd);
  });

  it("delete", async () => {
    await apiHelper.delete("/a");
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  it("delete dengan options", async () => {
    await apiHelper.delete("/a", { headers: { Y: "2" } });
    expect(fetchMock.mock.calls[0][1].headers.Y).toBe("2");
  });

  it("respons gagal dengan message", async () => {
    fetchMock.mockResolvedValue(res({ message: "Ditolak" }, false, 401));
    await expect(apiHelper.get("/a")).rejects.toMatchObject({
      message: "Ditolak",
      status: 401,
      data: { message: "Ditolak" },
    });
  });

  it("respons gagal tanpa message", async () => {
    fetchMock.mockResolvedValue(res({}, false, 500));
    await expect(apiHelper.get("/a")).rejects.toThrow("Request failed with status 500");
  });

  it("JSON rusak jatuh ke objek kosong", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("bad json");
      },
    });
    expect(await apiHelper.get("/a")).toEqual({});
  });
});

describe("apiHelper - DELCOM_BASEURL terdefinisi", () => {
  it("memakai base URL dari global", async () => {
    vi.resetModules();
    vi.stubGlobal("DELCOM_BASEURL", "http://custom.test/api/v1/");
    const mod = await import("./apiHelper");
    await mod.fetchData("/users");
    expect(fetchMock.mock.calls[0][0]).toBe("http://custom.test/api/v1/users");
  });
});