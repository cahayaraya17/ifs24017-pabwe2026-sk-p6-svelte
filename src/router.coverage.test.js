import { describe, it, expect, vi, afterEach } from "vitest";
import { get } from "svelte/store";
import router, {
  matchPath,
  resolveRoute,
  navigate,
  push,
  replace,
  currentPath,
  currentRoute,
  defaultRoutes,
} from "./router";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("router - matchPath", () => {
  it("pattern dan path kosong sama-sama menjadi /", () => {
    expect(matchPath(undefined, undefined)).toEqual({ matches: true, params: {} });
    expect(matchPath(null, null)).toEqual({ matches: true, params: {} });
  });

  it("trailing slash diabaikan", () => {
    expect(matchPath("/a/", "/a")).toEqual({ matches: true, params: {} });
  });

  it("jumlah segmen berbeda", () => {
    expect(matchPath("/a/b", "/a")).toBeNull();
  });

  it("segmen berbeda", () => {
    expect(matchPath("/a/b", "/a/c")).toBeNull();
  });

  it("parameter dinamis", () => {
    expect(matchPath("/x/:id", "/x/5")).toEqual({ matches: true, params: { id: "5" } });
  });
});

describe("router - resolveRoute", () => {
  it("pathname kosong memakai /", () => {
    expect(resolveRoute(undefined).name).toBe("home");
    expect(resolveRoute(null).path).toBe("/");
  });

  it("routesList bukan array memakai defaultRoutes", () => {
    expect(resolveRoute("/users", "bukan-array").name).toBe("users");
  });

  it("route dengan properti pattern", () => {
    const r = resolveRoute("/p/9", [{ pattern: "/p/:id", name: "pp", layout: "auth" }]);
    expect(r).toEqual({ name: "pp", path: "/p/9", params: { id: "9" }, layout: "auth" });
  });

  it("route dengan properti path dan tanpa layout", () => {
    const r = resolveRoute("/q", [{ path: "/q", name: "qq" }]);
    expect(r.layout).toBe("linkTree");
  });

  it("tidak ditemukan", () => {
    expect(resolveRoute("/nope/x/y")).toEqual({
      name: "not-found",
      path: "/nope/x/y",
      params: {},
      layout: "none",
    });
  });

  it("defaultRoutes terdaftar", () => {
    expect(defaultRoutes.length).toBeGreaterThan(0);
    expect(router.resolveRoute).toBe(resolveRoute);
  });
});

describe("router - navigasi dengan window", () => {
  it("navigate, push, replace memperbarui currentPath", () => {
    navigate("/users");
    expect(get(currentPath)).toBe("/users");
    expect(get(currentRoute).name).toBe("users");
    push("/profile");
    expect(get(currentPath)).toBe("/profile");
    replace("/auth/login");
    expect(get(currentPath)).toBe("/auth/login");
  });

  it("popstate memperbarui currentPath", () => {
    window.history.pushState({}, "", "/users");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/users");
  });
});

describe("router - tanpa window", () => {
  it("navigate dan replace tidak melakukan apa-apa", () => {
    navigate("/awal");
    vi.stubGlobal("window", undefined);
    expect(() => navigate("/x")).not.toThrow();
    expect(() => replace("/y")).not.toThrow();
    vi.unstubAllGlobals();
    expect(get(currentPath)).toBe("/awal");
  });

  it("modul dimuat tanpa window: currentPath awal /", async () => {
    vi.resetModules();
    vi.stubGlobal("window", undefined);
    const mod = await import("./router");
    expect(get(mod.currentPath)).toBe("/");
  });
});