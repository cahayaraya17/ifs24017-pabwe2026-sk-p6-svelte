import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");

describe("index.html", () => {
  const html = read("index.html");

  it("memiliki bahasa dokumen dan meta description", () => {
    expect(html).toMatch(/<html lang="id">/);
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]{20,}"/);
  });
});

describe("vercel.json", () => {
  const { rewrites } = JSON.parse(read("vercel.json"));

  it("mem-proxy /delcom-api ke API Delcom sebelum fallback SPA", () => {
    const proxyIndex = rewrites.findIndex((r) => r.source.startsWith("/delcom-api/"));
    const spaIndex = rewrites.findIndex((r) => r.destination === "/index.html");
    expect(proxyIndex).toBeGreaterThanOrEqual(0);
    expect(proxyIndex).toBeLessThan(spaIndex);
    expect(rewrites[proxyIndex].destination).toBe("https://open-api.delcom.org/api/v1/:path*");
  });

  it("fallback SPA tidak menangkap /delcom-api tetapi menangkap rute aplikasi", () => {
    const spa = rewrites.find((r) => r.destination === "/index.html");
    const re = new RegExp(`^${spa.source}$`);
    expect(re.test("/delcom-api/users/me")).toBe(false);
    expect(re.test("/users")).toBe(true);
    expect(re.test("/link-trees/7")).toBe(true);
  });
});
