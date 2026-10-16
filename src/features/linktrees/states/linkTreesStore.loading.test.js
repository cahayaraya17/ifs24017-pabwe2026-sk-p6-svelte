import { describe, it, expect, beforeEach } from "vitest";
import linkTreesStore, { useLinkTreesStore } from "./linkTreesStore";

describe("linkTreesStore - isLinkTreeLoading", () => {
  beforeEach(() => {
    linkTreesStore.reset();
  });

  it("setter dan getter isLinkTreeLoading", () => {
    const s = useLinkTreesStore();
    expect(s.isLinkTreeLoading).toBe(false);
    s.setIsLinkTreeLoading(true);
    expect(s.isLinkTreeLoading).toBe(true);
  });
});