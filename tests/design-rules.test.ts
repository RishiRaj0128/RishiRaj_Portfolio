import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

function getAllSourceFiles(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllSourceFiles(fullPath, fileList);
    } else if (/\.(tsx|ts|js|jsx|css)$/.test(entry)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

test("Design Rules: Prohibit shadow-*, gradient, backdrop-blur-(sm|md|lg|xl), check glyphs, and Inter/Geist/Space Grotesk fonts in src", () => {
  const srcDir = path.resolve(__dirname, "../src");
  const files = getAllSourceFiles(srcDir);
  assert.ok(files.length > 0, "Source files must be found in src/");

  const checks = [
    {
      name: "shadow-*",
      regex: /\bshadow-(?:sm|md|lg|xl|2xl|inner|[a-z0-9]+)\b/,
      description: "Elevation must be 1px borders and luminosity steps, not drop shadows",
    },
    {
      name: "gradient",
      regex: /\bgradient\b/i,
      description: "Gradients look generic/AI-generated; use solid backgrounds and 1px borders",
    },
    {
      name: "backdrop-blur-(sm|md|lg|xl)",
      regex: /\bbackdrop-blur-(?:sm|md|lg|xl)\b/,
      description: "Backdrop blur is prohibited; use solid backgrounds",
    },
    {
      name: "check glyphs",
      regex: /[✓✔✅☑]/,
      description: "Checkmark glyphs prohibited; use plain text labels [OK] or CSS square markers",
    },
    {
      name: "forbidden fonts (Inter, Geist, Space Grotesk)",
      regex: /\b(Inter|Geist|Space Grotesk)\b/,
      description: "Strictly adhere to IBM Plex Mono, Public Sans, and Newsreader",
    },
  ];

  const violations: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(path.resolve(__dirname, ".."), file);

    for (const check of checks) {
      const match = content.match(check.regex);
      if (match) {
        violations.push(
          `[${check.name}] in ${relativePath}: found "${match[0]}" - ${check.description}`
        );
      }
    }
  }

  assert.equal(
    violations.length,
    0,
    `Design rule violations detected:\n${violations.join("\n")}`
  );
});
