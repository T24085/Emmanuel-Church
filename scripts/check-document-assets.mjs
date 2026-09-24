import { readFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  await readFile(resolve(root, "src/data/document-archives.json"), "utf8"),
);
for (const issue of [...manifest.bulletins, ...manifest.guides]) {
  if (
    !/^\/documents\/[\w-]+\.pdf$/.test(issue.pdfPath) ||
    issue.pageCount !== issue.pages.length ||
    !issue.pageCount
  )
    throw new Error(`Invalid archive manifest: ${issue.id}`);
  try {
    if (!(await stat(resolve(root, `public${issue.pdfPath}`))).size)
      throw new Error("Empty PDF");
  } catch {
    throw new Error(
      `Missing PDF for ${issue.date}: run npm run sync:documents with DRIVE_ARCHIVE_API_KEY first.`,
    );
  }
}
console.log("All archive PDF assets are present.");
