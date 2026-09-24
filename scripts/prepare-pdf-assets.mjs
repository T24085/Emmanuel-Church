import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// StPageFlip 2.0.7 leaves its RAF loop alive after destroy(). Apply this narrow,
// version-checked vendor fix so resizing/reading-mode switches release old books.
const flipPackage = JSON.parse(
  await readFile(resolve(root, "node_modules/page-flip/package.json"), "utf8"),
);
if (flipPackage.version !== "2.0.7")
  throw new Error("Review the StPageFlip cleanup patch before upgrading.");
const flipPath = resolve(
  root,
  "node_modules/page-flip/dist/js/page-flip.browser.js",
);
let flip = await readFile(flipPath, "utf8");
const oldLoop =
  "start(){this.update();const t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}";
const newLoop =
  "start(){this.update();this.emmanuelStopped=false;const t=e=>{if(this.emmanuelStopped)return;this.render(e);this.emmanuelFrame=requestAnimationFrame(t)};this.emmanuelFrame=requestAnimationFrame(t)}stop(){this.emmanuelStopped=true;cancelAnimationFrame(this.emmanuelFrame);this.animation=null}";
const oldDestroy = "destroy(){this.ui.destroy(),this.block.remove()}";
const newDestroy =
  "destroy(){this.render.stop(),this.ui.destroy(),this.block.remove()}";
if (!flip.includes(newLoop)) {
  if (!flip.includes(oldLoop) || !flip.includes(oldDestroy))
    throw new Error(
      "Unexpected page-flip distribution; cleanup patch not applied.",
    );
  flip = flip.replace(oldLoop, newLoop).replace(oldDestroy, newDestroy);
  await writeFile(flipPath, flip);
}
const source = resolve(root, "node_modules/pdfjs-dist");
const target = resolve(root, "public/pdfjs");
await mkdir(target, { recursive: true });
await cp(
  resolve(source, "build/pdf.worker.min.mjs"),
  resolve(target, "pdf.worker.min.mjs"),
);
for (const folder of ["cmaps", "standard_fonts", "wasm"])
  await cp(resolve(source, folder), resolve(target, folder), {
    recursive: true,
  });
