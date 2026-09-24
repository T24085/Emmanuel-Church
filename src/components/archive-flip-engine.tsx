"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PageFlip } from "page-flip";
import { type BookPage, dateLabel } from "@/lib/document-archive";
import ArchivePdfPage from "./archive-pdf-page";
import { ArchiveCover } from "./archive-cover";

export default function ArchiveFlipEngine({
  pages,
  kind,
  count,
  current,
  onChange,
  onReady,
}: {
  pages: BookPage[];
  kind: "bulletins" | "guides";
  count: number;
  current: number;
  onChange: (index: number) => void;
  onReady: (engine: PageFlip | null) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<PageFlip | null>(null);
  const currentRef = useRef(current);
  currentRef.current = current;
  const [nodes, setNodes] = useState<HTMLElement[]>([]);
  const [sizing, setSizing] = useState({ width: 0, height: 0, mobile: true });
  useEffect(() => {
    if (!host.current) return;
    const update = () => {
      const available = host.current?.clientWidth || 0;
      const mobile = window.innerWidth < 900;
      const width = Math.floor(
        Math.min(
          mobile ? available - 24 : (available - 64) / 2,
          mobile ? 480 : 500,
        ),
      );
      // Both archives share one publication format; fit each PDF inside it.
      const height = Math.round(width * 1.294);
      setSizing((old) =>
        old.width === width && old.height === height && old.mobile === mobile
          ? old
          : { width, height, mobile },
      );
    };
    const observer = new ResizeObserver(update);
    observer.observe(host.current);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
  useEffect(() => {
    if (!host.current || sizing.width <= 0) return;
    const root = document.createElement("div");
    root.className = "archive-flip-root";
    host.current.append(root);
    const sheets = pages.map((_, index) => {
      const node = document.createElement("div");
      node.className = `archive-sheet${index === 0 ? " archive-sheet--cover" : ""}`;
      root.append(node);
      return node;
    });
    const book = new PageFlip(root, {
      width: sizing.width,
      height: sizing.height,
      size: "fixed",
      showCover: true,
      usePortrait: sizing.mobile,
      autoSize: false,
      startPage: currentRef.current,
      flippingTime: 650,
      maxShadowOpacity: 0.22,
      mobileScrollSupport: false,
      showPageCorners: true,
      disableFlipByClick: true,
      useMouseEvents: true,
    });
    book.on("flip", (event) => onChange(Number(event.data)));
    book.loadFromHTML(sheets);
    engine.current = book;
    setNodes(sheets);
    onReady(book);
    return () => {
      onReady(null);
      engine.current = null;
      book.destroy();
    };
  }, [pages, sizing, onChange, onReady]);
  useEffect(() => {
    // Only visible pages enter the accessibility tree; neighboring pages are pre-rendered.
    nodes.forEach((node, index) => {
      const visible =
        index === current ||
        (!sizing.mobile && current > 0 && index === current + 1);
      node.setAttribute("aria-hidden", String(!visible));
      node.inert = !visible;
    });
  }, [current, nodes, sizing.mobile]);
  return (
    <div
      className={`archive-flip-host${current === 0 && !sizing.mobile ? " is-cover" : ""}`}
      ref={host}
      style={
        {
          minHeight: sizing.height || 440,
          "--sheet-width": `${sizing.width}px`,
          "--sheet-height": `${sizing.height}px`,
        } as React.CSSProperties
      }
    >
      {nodes.map((node, index) => {
        const page = pages[index];
        return Math.abs(index - current) <= 3 || index === 0
          ? createPortal(
              page ? (
                <div className="archive-sheet__inner">
                  <div className="archive-sheet__running">
                    <span>{dateLabel(page.issue.date)}</span>
                    <span>
                      {page.page} / {page.issue.pageCount}
                    </span>
                  </div>
                  <div className="archive-sheet__content">
                    <ArchivePdfPage issue={page.issue} page={page.page} />
                  </div>
                </div>
              ) : (
                <ArchiveCover kind={kind} count={count} />
              ),
              node,
              String(index),
            )
          : null;
      })}
    </div>
  );
}
