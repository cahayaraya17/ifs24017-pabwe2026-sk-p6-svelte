import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/svelte";
import apiHelper from "./helpers/apiHelper";
import { currentRoute, currentPath } from "./router";
import App from "./App.svelte";

vi.mock("./router", async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import("svelte/store");
  return {
    ...actual,
    currentRoute: writable(null),
    currentPath: writable(""),
  };
});

vi.mock("./features/auth/layouts/AuthLayout.svelte", async () => ({
  default: (await import("./__stubs__/AuthLayoutStub.svelte")).default,
}));

vi.mock("./features/linktrees/layouts/LinkTreeLayout.svelte", async () => ({
  default: (await import("./__stubs__/LinkTreeLayoutStub.svelte")).default,
}));

const TEKS_HOME = "Daftar LinkTrees";
const TEKS_DETAIL = "Kembali ke Semua Link Tree";
const TEKS_USERS = "Semua Pengguna";

function renderApp({ path = "/", route = null, token = null, tokenError = false } = {}) {
  currentPath.set(path);
  currentRoute.set(route);
  const spy = vi.spyOn(apiHelper, "getAccessToken");
  if (tokenError) {
    spy.mockImplementation(() => {
      throw new Error("storage rusak");
    });
  } else {
    spy.mockReturnValue(token);
  }
  return render(App);
}

beforeEach(() => {
  window.history.replaceState({}, "", "/");
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("App - halaman autentikasi", () => {
  it("path /auth/register memakai AuthLayout", () => {
    renderApp({ path: "/auth/register", route: { name: "lain" } });
    expect(screen.getByTestId("layout-auth")).toBeTruthy();
    expect(screen.queryByTestId("layout-linktree")).toBeNull();
  });

  it("routeName register memakai AuthLayout", () => {
    renderApp({ path: "/apa-saja", route: { name: "register" } });
    expect(screen.getByTestId("layout-auth")).toBeTruthy();
  });

  it("path /auth/login memakai AuthLayout", () => {
    renderApp({ path: "/auth/login", route: { name: "lain" } });
    expect(screen.getByTestId("layout-auth")).toBeTruthy();
  });

  it("routeName login memakai AuthLayout", () => {
    renderApp({ path: "/apa-saja", route: { name: "login" } });
    expect(screen.getByTestId("layout-auth")).toBeTruthy();
  });

  it("layout auth tanpa token diarahkan ke login", () => {
    renderApp({ path: "/rahasia", route: { name: "lain", layout: "auth" }, token: null });
    expect(screen.getByTestId("layout-auth")).toBeTruthy();
  });

  it("layout auth dengan token valid tidak ke login (jatuh ke 404)", () => {
    renderApp({ path: "/rahasia", route: { name: "lain", layout: "auth" }, token: "abc" });
    expect(screen.queryByTestId("layout-auth")).toBeNull();
    expect(screen.queryByTestId("layout-linktree")).toBeNull();
  });

  it("getAccessToken melempar error dianggap tidak ada token", () => {
    renderApp({
      path: "/rahasia",
      route: { name: "lain", layout: "auth" },
      tokenError: true,
    });
    expect(screen.getByTestId("layout-auth")).toBeTruthy();
  });
});

describe("App - halaman utama", () => {
  it("path kosong memakai window.location.pathname", () => {
    window.history.replaceState({}, "", "/");
    renderApp({ path: "", route: null });
    expect(screen.getByTestId("layout-linktree")).toBeTruthy();
    expect(screen.getByText(TEKS_HOME)).toBeTruthy();
  });

  it("path / dengan route bernama lain", () => {
    renderApp({ path: "/", route: { name: "lain" } });
    expect(screen.getByText(TEKS_HOME)).toBeTruthy();
  });

  it("routeName home dengan path lain", () => {
    renderApp({ path: "/apa-saja", route: { name: "home" } });
    expect(screen.getByText(TEKS_HOME)).toBeTruthy();
  });
});

describe("App - halaman detail", () => {
  it("path /link-trees tanpa params memakai objek kosong", () => {
    renderApp({ path: "/link-trees/5", route: { name: "lain" } });
    expect(screen.getByTestId("layout-linktree")).toBeTruthy();
    expect(screen.getByText(TEKS_DETAIL)).toBeTruthy();
    expect(screen.queryByText(TEKS_HOME)).toBeNull();
  });

  it("path /todos juga membuka detail", () => {
    renderApp({ path: "/todos/5", route: { name: "lain" } });
    expect(screen.getByText(TEKS_DETAIL)).toBeTruthy();
  });

  it("routeName linkTree-detail dengan params", () => {
    renderApp({
      path: "/apa-saja",
      route: { name: "linkTree-detail", params: { id: "3" } },
    });
    expect(screen.getByText(TEKS_DETAIL)).toBeTruthy();
  });
});

describe("App - halaman pengguna dan profil", () => {
  it("path /users", () => {
    renderApp({ path: "/users", route: { name: "lain" } });
    expect(screen.getByTestId("layout-linktree")).toBeTruthy();
    expect(screen.getByText(TEKS_USERS)).toBeTruthy();
  });

  it("routeName users", () => {
    renderApp({ path: "/apa-saja", route: { name: "users" } });
    expect(screen.getByText(TEKS_USERS)).toBeTruthy();
  });

  it("path /profile", () => {
    renderApp({ path: "/profile", route: { name: "lain" } });
    expect(screen.getByTestId("layout-linktree")).toBeTruthy();
    expect(screen.queryByText(TEKS_USERS)).toBeNull();
    expect(screen.queryByText(TEKS_HOME)).toBeNull();
    expect(screen.queryByText(TEKS_DETAIL)).toBeNull();
  });

  it("routeName profile", () => {
    renderApp({ path: "/apa-saja", route: { name: "profile" } });
    expect(screen.getByTestId("layout-linktree")).toBeTruthy();
    expect(screen.queryByText(TEKS_USERS)).toBeNull();
  });
});

describe("App - halaman tidak ditemukan", () => {
  it("rute tak dikenal tidak memakai layout apa pun", () => {
    renderApp({ path: "/tidak-ada", route: { name: "lain" } });
    expect(screen.queryByTestId("layout-auth")).toBeNull();
    expect(screen.queryByTestId("layout-linktree")).toBeNull();
  });
});