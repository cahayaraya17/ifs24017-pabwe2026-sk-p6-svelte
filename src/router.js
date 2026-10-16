import { writable, derived } from "svelte/store";

export const currentPath = writable(
  typeof window !== "undefined" ? window.location.pathname : "/"
);

export function matchPath(pattern, pathname) {
  const normPattern = (pattern || "").replace(/\/+$/, "") || "/";
  const normPath = (pathname || "").replace(/\/+$/, "") || "/";

  if (normPattern === normPath) {
    return { matches: true, params: {} };
  }

  const pSegs = normPattern.split("/").filter(Boolean);
  const uSegs = normPath.split("/").filter(Boolean);

  if (pSegs.length !== uSegs.length) {
    return null;
  }

  const params = {};
  for (let i = 0; i < pSegs.length; i++) {
    if (pSegs[i].startsWith(":")) {
      params[pSegs[i].slice(1)] = uSegs[i];
    } else if (pSegs[i] !== uSegs[i]) {
      return null;
    }
  }

  return { matches: true, params };
}

export const defaultRoutes = [
  { path: "/", name: "home", layout: "linkTree" },
  { path: "/auth/login", name: "login", layout: "auth" },
  { path: "/auth/register", name: "register", layout: "auth" },
  { path: "/users", name: "users", layout: "linkTree" },
  { path: "/profile", name: "profile", layout: "linkTree" },
  { path: "/link-trees/:linkTreeId", name: "linkTree-detail", layout: "linkTree" },
  { path: "/todos/:linkTreeId", name: "linkTree-detail", layout: "linkTree" },
];

export function resolveRoute(pathname, routesList) {
  const normPath = (pathname || "").replace(/\/+$/, "") || "/";
  const list = Array.isArray(routesList) ? routesList : defaultRoutes;

  for (const r of list) {
    const res = matchPath(r.pattern ?? r.path, normPath);
    if (res && res.matches) {
      return {
        name: r.name,
        path: normPath,
        params: res.params,
        layout: r.layout || "linkTree",
      };
    }
  }

  return {
    name: "not-found",
    path: normPath,
    params: {},
    layout: "none",
  };
}

export const currentRoute = derived(currentPath, ($path) => resolveRoute($path));

export function navigate(to) {
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", to);
    currentPath.set(to);
  }
}

export function push(to) {
  navigate(to);
}

export function replace(to) {
  if (typeof window !== "undefined") {
    window.history.replaceState({}, "", to);
    currentPath.set(to);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    currentPath.set(window.location.pathname);
  });
}

export const router = {
  currentPath,
  currentRoute,
  navigate,
  push,
  replace,
  resolveRoute,
  matchPath,
};

export default router;
