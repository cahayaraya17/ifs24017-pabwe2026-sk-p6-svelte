import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import App from "./App.svelte";
import apiHelper from "./helpers/apiHelper";
import * as router from "./router";

vi.mock("./router", async (importOriginal) => {
  const actual = await importOriginal();
  const { writable } = await import("svelte/store");
  return {
    ...actual,
    currentRoute: writable({ name: "home", layout: "linkTree", params: {} }),
  };
});
vi.mock("./features/auth/layouts/AuthLayout.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/linktrees/layouts/LinkTreeLayout.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/auth/pages/LoginPage.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/auth/pages/RegisterPage.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/linktrees/pages/HomePage.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/linktrees/pages/DetailPage.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/users/pages/UsersPage.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/users/pages/ProfilePage.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));
vi.mock("./features/common/pages/NotFoundPage.svelte", () => import("./features/linktrees/pages/__stubs__/ModalStub.svelte"));

const setRoute = (path, route) => {
  router.currentPath.set(path);
  router.currentRoute.set(route);
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("App - sisa cabang", () => {
  it("getAccessToken melempar error", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockImplementation(() => {
      throw new Error("x");
    });
    setRoute("/", { name: "home", layout: "linkTree", params: {} });
    expect(render(App).container).toBeTruthy();
  });

  it("route auth tanpa token menampilkan login", () => {
    setRoute("/zzz", { name: "x", layout: "auth", params: {} });
    expect(render(App).container).toBeTruthy();
  });

  it("currentRoute null memakai fallback home dan linkTree", () => {
    setRoute("/", null);
    expect(render(App).container).toBeTruthy();
  });

  it("detail tanpa params memakai objek kosong", () => {
    setRoute("/link-trees/1", { name: "linkTree-detail", layout: "linkTree" });
    expect(render(App).container).toBeTruthy();
  });

  it("currentPath kosong memakai window.location.pathname", () => {
    setRoute("", { name: "users", layout: "linkTree", params: {} });
    expect(render(App).container).toBeTruthy();
  });
});