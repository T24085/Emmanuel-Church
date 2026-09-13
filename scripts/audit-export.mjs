import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "out");
const basePath = "/Emmanuel-Church";
const issues = [];
const report = [];
const titles = new Set();
const decode = (value) => value.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
const readAttribute = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

assert(existsSync(output), "Run npm run build before auditing the static export.");
const pages = walk(join(root, "src", "app")).filter((file) => file.endsWith(`${sep}page.tsx`));

for (const source of pages) {
  const route = relative(join(root, "src", "app"), dirname(source)).split(sep).join("/");
  const file = join(output, route, "index.html");
  if (!existsSync(file)) { issues.push(`${route || "/"}: missing exported page`); continue; }
  const html = readFileSync(file, "utf8").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const title = decode(html.match(/<title>(.*?)<\/title>/i)?.[1] || "");
  const fail = (message) => issues.push(`${route || "/"}: ${message}`);
  if (!title || titles.has(title)) fail("missing or duplicate document title");
  titles.add(title);
  if (!/<meta\b[^>]*name="description"[^>]*content="[^"]+"/i.test(html)) fail("missing description");
  if ([...html.matchAll(/<h1\b/gi)].length !== 1) fail("expected exactly one h1");
  if (!html.includes('id="main-content"')) fail("missing skip-link destination");
  if (/<div\b[^>]*class="landing-loader(?:\s|")/.test(html)) fail("loader blocks the static page without JavaScript");
  for (const tag of html.match(/<(?:a|link|img|iframe|video|source)\b[^>]*>/gi) || []) {
    if (/^<img\b/i.test(tag) && readAttribute(tag, "alt") === undefined) fail("image without alt attribute");
    if (/^<iframe\b/i.test(tag) && !readAttribute(tag, "title")) fail("iframe without title");
    const raw = readAttribute(tag, "href") ?? readAttribute(tag, "src");
    if (!raw || /^(?:https?:|mailto:|tel:|data:|blob:|\/\/)/i.test(raw)) continue;
    const url = new URL(decode(raw), `https://export.invalid${basePath}/${route ? `${route}/` : ""}`);
    if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
      fail(`link or asset escapes GitHub Pages base path: ${raw}`); continue;
    }
    let target = resolve(output, `.${decodeURIComponent(url.pathname.slice(basePath.length)) || "/"}`);
    if (target !== output && !target.startsWith(`${output}${sep}`)) { fail(`unsafe target: ${raw}`); continue; }
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
    if (!existsSync(target)) { fail(`missing link or asset: ${raw}`); continue; }
    if (url.hash && target.endsWith(".html")) {
      const id = decodeURIComponent(url.hash.slice(1));
      const destination = readFileSync(target, "utf8");
      if (!destination.includes(`id="${id}"`)) fail(`missing anchor: ${raw}`);
    }
  }
  report.push({ route: `/${route}${route ? "/" : ""}`, title });
}

// Stylesheets and scripts are essential to Pages; check these separately from content.
for (const file of walk(output).filter((path) => path.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:src|href)="([^"?#]+\.(?:css|js))(?:[?#][^"]*)?"/g)) {
    const path = match[1];
    if (!path.startsWith(`${basePath}/`)) continue;
    if (!existsSync(join(output, path.slice(basePath.length)))) issues.push(`Missing stylesheet or script: ${path}`);
  }
}

console.table(report);
if (issues.length) {
  console.error([...new Set(issues)].join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${report.length} pages; unique titles, descriptions, headings, image labels, iframe titles, local links, anchors, styles, and scripts.`);
  console.log("Static checks only. Browser interactions and external providers still require a separate visual smoke test.");
}
