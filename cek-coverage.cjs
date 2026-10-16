const fs = require("fs");
const path = require("path");
const cov = JSON.parse(fs.readFileSync("coverage/coverage-final.json", "utf8"));
const targets = ["DetailPage.svelte", "UsersPage.svelte", "AddModal.svelte", "ChangeModal.svelte", "link-treesStore.js"];
const out = [];
for (const file of Object.keys(cov)) {
  if (!targets.some((t) => file.endsWith(t))) continue;
  const c = cov[file];
  const src = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/) : [];
  const baris = (n) => (src[n - 1] ?? "").trim();
  out.push("=== " + path.basename(file) + " ===");
  for (const [id, n] of Object.entries(c.s)) {
    if (n === 0) {
      const p = c.statementMap[id].start;
      out.push("STATEMENT belum jalan @" + p.line + ":" + p.column + " | " + baris(p.line));
    }
  }
  for (const [id, n] of Object.entries(c.f)) {
    if (n === 0) {
      const m = c.fnMap[id];
      out.push("FUNGSI " + m.name + " belum jalan @" + m.loc.start.line + " | " + baris(m.loc.start.line));
    }
  }
  for (const [id, arr] of Object.entries(c.b)) {
    arr.forEach((n, i) => {
      if (n === 0) {
        const m = c.branchMap[id];
        const p = m.locations[i].start;
        out.push("CABANG " + m.type + " #" + i + " belum jalan @" + p.line + ":" + p.column + " | " + baris(p.line));
      }
    });
  }
}
fs.writeFileSync("uncovered.txt", out.join("\n"));