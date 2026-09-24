import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import { withBasePath } from "./site-path";

const documents = new Map<
  string,
  {
    refs: number;
    task: Promise<PDFDocumentLoadingTask>;
    pdf: Promise<PDFDocumentProxy>;
    timer?: ReturnType<typeof setTimeout>;
  }
>();
export async function pdfLibrary() {
  const library = await import("pdfjs-dist");
  library.GlobalWorkerOptions.workerSrc = withBasePath(
    "/pdfjs/pdf.worker.min.mjs",
  );
  return library;
}

// At most the documents referenced by mounted nearby pages stay in memory.
export function acquirePdf(path: string) {
  let entry = documents.get(path);
  if (!entry) {
    const task = pdfLibrary().then((pdf) =>
      pdf.getDocument({
        url: withBasePath(path),
        cMapUrl: withBasePath("/pdfjs/cmaps/"),
        cMapPacked: true,
        standardFontDataUrl: withBasePath("/pdfjs/standard_fonts/"),
        wasmUrl: withBasePath("/pdfjs/wasm/"),
        disableAutoFetch: true,
        disableStream: true,
      }),
    );
    entry = { refs: 0, task, pdf: task.then((value) => value.promise) };
    documents.set(path, entry);
  }
  const held = entry;
  clearTimeout(held.timer);
  held.refs++;
  return {
    pdf: held.pdf,
    release() {
      held.refs--;
      if (held.refs === 0)
        held.timer = setTimeout(() => {
          if (held.refs !== 0) return;
          documents.delete(path);
          void held.task.then((task) => task.destroy()).catch(() => {});
        }, 800);
    },
  };
}
