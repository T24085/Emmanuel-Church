"use client";

import { useEffect, useRef, useState } from "react";
import type { RenderTask, TextLayer } from "pdfjs-dist";
import { acquirePdf, pdfLibrary } from "@/lib/pdf-client";
import { dateLabel, type ArchiveIssue } from "@/lib/document-archive";
import { withBasePath } from "@/lib/site-path";
import "pdfjs-dist/web/pdf_viewer.css";

export default function ArchivePdfPage({
  issue,
  page,
  readable = false,
}: {
  issue: ArchiveIssue;
  page: number;
  readable?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [status, setStatus] = useState("Loading page…");
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const dimensions = issue.pages[page - 1];
  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) =>
      setWidth(Math.round(entries[0].contentRect.width)),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!width || !canvas.current || !text.current) return;
    const surface = canvas.current;
    const layer = text.current;
    const lease = acquirePdf(issue.pdfPath);
    let stopped = false;
    let rendering: RenderTask | undefined;
    let textLayer: TextLayer | undefined;
    setStatus("Loading page…");
    setFailed(false);
    void (async () => {
      const document = await lease.pdf;
      if (stopped) return;
      const pdfPage = await document.getPage(page);
      if (stopped) return;
      const natural = pdfPage.getViewport({ scale: 1 });
      const viewport = pdfPage.getViewport({ scale: width / natural.width });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.floor(viewport.width * ratio);
      surface.height = Math.floor(viewport.height * ratio);
      surface.style.width = `${viewport.width}px`;
      surface.style.height = `${viewport.height}px`;
      rendering = pdfPage.render({
        canvas: surface,
        viewport,
        transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
      });
      await rendering.promise;
      if (stopped) return;
      layer.replaceChildren();
      if (readable) {
        const { TextLayer } = await pdfLibrary();
        const content = await pdfPage.getTextContent();
        if (stopped) return;
        layer.style.setProperty(
          "--total-scale-factor",
          String(viewport.scale * viewport.userUnit),
        );
        layer.style.setProperty("--scale-round-x", "1px");
        layer.style.setProperty("--scale-round-y", "1px");
        textLayer = new TextLayer({
          textContentSource: content,
          container: layer,
          viewport,
        });
        await textLayer.render();
        if (stopped) return;
        setStatus(
          content.items.length
            ? ""
            : "Scanned page — use the original PDF for additional reading tools.",
        );
      } else setStatus("");
    })().catch((error) => {
      if (stopped || error?.name === "RenderingCancelledException") return;
      setFailed(true);
      setStatus("This page could not load. Retry or open the original PDF.");
    });
    return () => {
      stopped = true;
      rendering?.cancel();
      textLayer?.cancel();
      layer.replaceChildren();
      lease.release();
    };
  }, [issue.pdfPath, page, width, readable, attempt]);
  return (
    <div
      className="archive-pdf"
      ref={frame}
      style={
        {
          aspectRatio: `${dimensions.width} / ${dimensions.height}`,
          "--pdf-ratio": dimensions.width / dimensions.height,
        } as React.CSSProperties
      }
    >
      <canvas
        ref={canvas}
        role={readable ? undefined : "img"}
        aria-hidden={readable || undefined}
        aria-label={`${issue.title}, ${dateLabel(issue.date)}, page ${page} of ${issue.pageCount}`}
      />
      <div ref={text} className="textLayer" aria-hidden={!readable} />
      {status && (
        <div
          className={`archive-pdf__status${failed ? " is-error" : ""}`}
          role="status"
        >
          <p>{status}</p>
          {failed && (
            <>
              <button onClick={() => setAttempt((value) => value + 1)}>
                Retry page
              </button>{" "}
              <a href={withBasePath(issue.pdfPath)} target="_blank" rel="noreferrer">
                Open original PDF ↗
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
