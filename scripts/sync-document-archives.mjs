import {
  readFile,
  writeFile,
  mkdir,
  rename,
  readdir,
  unlink,
} from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { bulletins } from "../src/data/bulletins.ts";
import { studyGuides } from "../src/data/study-guides.ts";
import {
  folders,
  describeArchive,
  listFolder,
  pdfHash,
} from "./archive-core.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assets = resolve(root, "public/documents");
const manifestPath = resolve(root, "src/data/document-archives.json");
const local = process.argv.includes("--from-cache");
const key = process.env.DRIVE_ARCHIVE_API_KEY;
if (!local && !key)
  throw new Error(
    "Set DRIVE_ARCHIVE_API_KEY (Drive API only). No Firebase credential is used.",
  );
await mkdir(assets, { recursive: true });
let previous = { bulletins: [], guides: [] };
try {
  previous = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {}
try {
  previous = JSON.parse(
    await readFile(resolve(assets, "manifest.json"), "utf8"),
  );
} catch {}
const inventory = local
  ? JSON.parse(
      await readFile(
        resolve(root, ".cache/archive-source/inventory.json"),
        "utf8",
      ),
    )
  : null;
const manifest = { version: 1, bulletins: [], guides: [] };
const keep = new Set();

// Both listings and date validation must succeed before attempting publication.
const planned = {};
for (const [kind, folder] of Object.entries(folders)) {
  planned[kind] = describeArchive(
    local ? inventory[kind] : await listFolder(folder, key),
    kind,
    kind === "bulletins" ? bulletins : studyGuides,
  );
}
for (const kind of Object.keys(folders)) {
  for (const { source, ...issue } of planned[kind]) {
    const old = previous[kind]?.find((item) => item.id === issue.id);
    const signature =
      source.md5Checksum || `${source.modifiedTime}:${source.size}`;
    let bytes;
    if (old?.sourceSignature === signature) {
      if (/^\/documents\/[\w-]+\.pdf$/.test(old.pdfPath)) {
        try {
          bytes = await readFile(resolve(root, `public${old.pdfPath}`));
        } catch {}
      }
    }
    if (!bytes) {
      if (local)
        bytes = await readFile(
          resolve(root, `.cache/archive-source/${issue.id}.pdf`),
        );
      else {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${issue.id}?alt=media&key=${encodeURIComponent(key)}`,
        );
        if (!response.ok)
          throw new Error(
            `PDF download failed: ${issue.sourceName} (${response.status})`,
          );
        bytes = Buffer.from(await response.arrayBuffer());
      }
    }
    if (bytes.length > 75 * 1024 * 1024)
      throw new Error(`PDF exceeds 75 MB: ${issue.sourceName}`);
    const hash = pdfHash(bytes);
    const filename = `${issue.id}-${hash}.pdf`;
    const task = getDocument({
      data: new Uint8Array(bytes),
      isEvalSupported: false,
      useSystemFonts: true,
    });
    let pdf;
    const pages = [];
    try {
      pdf = await task.promise;
      if (!pdf.numPages || pdf.numPages > 200)
        throw new Error("PDF must contain between 1 and 200 pages");
      for (let number = 1; number <= pdf.numPages; number++) {
        const page = await pdf.getPage(number);
        const view = page.getViewport({ scale: 1 });
        // Force content parsing during sync, not just inspection of the header.
        await page.getOperatorList();
        pages.push({ width: view.width, height: view.height });
        page.cleanup();
      }
    } catch (error) {
      throw new Error(`Invalid PDF ${issue.sourceName}: ${error.message}`);
    } finally {
      await task.destroy();
    }
    await writeFile(resolve(assets, filename), bytes);
    keep.add(filename);
    manifest[kind].push({
      ...issue,
      sourceSignature: signature,
      pdfPath: `/documents/${filename}`,
      pageCount: pages.length,
      pages,
    });
    console.log(`${kind}: ${issue.date}, ${pages.length} pages`);
  }
}
// Write only after every PDF passed validation. Never replace the manifest on a partial sync.
const content = `${JSON.stringify(manifest, null, 2)}\n`;
await writeFile(`${manifestPath}.tmp`, content);
await rename(`${manifestPath}.tmp`, manifestPath);
await writeFile(resolve(assets, "manifest.json"), content);
// Delete only obsolete generated PDFs in the explicitly scoped assets directory.
for (const name of await readdir(assets)) {
  if (/^[\w-]+-[a-f0-9]{20}\.pdf$/.test(name) && !keep.has(name))
    await unlink(resolve(assets, name));
}
const summary = `Validated ${manifest.bulletins.length} bulletins and ${manifest.guides.length} study guides.\n`;
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY)
  await writeFile(process.env.GITHUB_STEP_SUMMARY, summary, { flag: "a" });
