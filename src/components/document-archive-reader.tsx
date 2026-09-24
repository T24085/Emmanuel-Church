"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PageFlip } from "page-flip";
import {
  bookPages,
  dateLabel,
  type ArchiveIssue,
} from "@/lib/document-archive";
import { withBasePath } from "@/lib/site-path";
import { ArchiveCover } from "./archive-cover";

const FlipEngine = dynamic(() => import("./archive-flip-engine"), {
  ssr: false,
  loading: () => (
    <p className="archive-loading" role="status">
      Opening the collection…
    </p>
  ),
});
const PdfPage = dynamic(() => import("./archive-pdf-page"), {
  ssr: false,
  loading: () => (
    <p className="archive-loading" role="status">
      Preparing this page…
    </p>
  ),
});

export function DocumentArchiveReader({
  kind,
  issues,
}: {
  kind: "bulletins" | "guides";
  issues: ArchiveIssue[];
}) {
  const pages = useMemo(() => bookPages(issues), [issues]);
  const [current, setCurrent] = useState(0);
  const [query, setQuery] = useState("");
  const [indexOpen, setIndexOpen] = useState(false);
  const [plain, setPlain] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [wide, setWide] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const engine = useRef<PageFlip | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const focusBack = useRef<HTMLElement | null>(null);
  const region = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const item = pages[current];
  const title =
    kind === "bulletins" ? "Sunday Bulletins" : "Weekly Study Guides";
  const reading = plain || reduced;
  const rightPage =
    !reading && !expanded && wide && current > 0 ? pages[current + 1] : null;
  const atEnd = current + (rightPage ? 1 : 0) >= pages.length - 1;
  const onReady = useCallback((book: PageFlip | null) => {
    engine.current = book;
  }, []);
  const onChange = useCallback((index: number) => {
    setCurrent(index);
    setZoom(1);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");
    const update = () => {
      setReduced(media.matches);
      setWide(desktop.matches);
    };
    update();
    media.addEventListener("change", update);
    desktop.addEventListener("change", update);
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("issue");
      const number = Math.max(
        1,
        Number.parseInt(params.get("page") || "1", 10) || 1,
      );
      const index = pages.findIndex(
        (page) =>
          page?.issue.id === id &&
          page.page === Math.min(number, page.issue.pageCount),
      );
      const next = Math.max(0, index);
      setCurrent(next);
      engine.current?.turnToPage(next);
    };
    restore();
    setHydrated(true);
    window.addEventListener("popstate", restore);
    return () => {
      media.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      window.removeEventListener("popstate", restore);
    };
  }, [pages]);
  useEffect(() => {
    if (!hydrated) return;
    const url = new URL(window.location.href);
    if (item) {
      url.searchParams.set("issue", item.issue.id);
      url.searchParams.set("page", String(item.page));
    } else {
      url.searchParams.delete("issue");
      url.searchParams.delete("page");
    }
    window.history.replaceState(null, "", url);
  }, [current, item, hydrated]);
  useEffect(() => {
    if (!expanded || !dialog.current) return;
    const node = dialog.current;
    focusBack.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node.showModal();
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      focusBack.current?.focus();
    };
  }, [expanded]);
  useEffect(() => {
    if (indexOpen) {
      searchInput.current?.focus({ preventScroll: true });
      document
        .getElementById("archive-date-index")
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [indexOpen]);

  function go(index: number) {
    const next = Math.min(Math.max(index, 0), pages.length - 1);
    setZoom(1);
    setCurrent(next);
    if (!expanded && !reading) engine.current?.turnToPage(next);
  }
  function step(direction: number) {
    if (!expanded && !reading && engine.current) {
      if (direction > 0) engine.current.flipNext();
      else engine.current.flipPrev();
    } else go(current + direction);
  }
  function keyboard(event: React.KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (
      ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(target.tagName) ||
      target.isContentEditable
    )
      return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      go(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      go(pages.length - 1);
    }
  }
  function openIssue(issue: ArchiveIssue) {
    go(pages.findIndex((page) => page?.issue.id === issue.id));
    region.current?.focus({ preventScroll: true });
    region.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matching = issues.filter((issue) => {
    const label =
      `${dateLabel(issue.date)} ${issue.date} ${issue.title} ${issue.series || ""}`.toLowerCase();
    return terms.every((term) => label.includes(term));
  });
  const groups = matching.reduce<Record<string, ArchiveIssue[]>>(
    (result, issue) => {
      (result[issue.date.slice(0, 7)] ??= []).push(issue);
      return result;
    },
    {},
  );

  function navigation() {
    return (
      <div className="archive-reader__navigation">
        <button
          onClick={() => step(-1)}
          disabled={current === 0}
          aria-label="Previous page"
        >
          ← <span>Previous</span>
        </button>
        <p aria-live="polite" aria-atomic="true">
          {item ? (
            <>
              <strong>
                {dateLabel(item.issue.date)}
                {rightPage && rightPage.issue.id !== item.issue.id
                  ? ` / ${dateLabel(rightPage.issue.date)}`
                  : ""}
              </strong>
              <span>
                Page {item.page}
                {rightPage?.issue.id === item.issue.id
                  ? `–${rightPage.page}`
                  : ""}{" "}
                of {item.issue.pageCount} · {item.issue.title}
              </span>
            </>
          ) : (
            <>
              <strong>The Emmanuel collection</strong>
              <span>Open the cover to begin</span>
            </>
          )}
        </p>
        <button onClick={() => step(1)} disabled={atEnd} aria-label="Next page">
          <span>Next</span> →
        </button>
      </div>
    );
  }
  function plainPage() {
    return (
      <div className="archive-reading-scroll">
        <div
          className="archive-reading-page"
          style={{ width: `${zoom * 100}%`, maxWidth: `${zoom * 900}px` }}
        >
          {item ? (
            <PdfPage
              key={`${item.issue.id}-${item.page}`}
              issue={item.issue}
              page={item.page}
              readable
            />
          ) : (
            <ArchiveCover kind={kind} count={issues.length} />
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      className={`document-archive document-archive--${kind}`}
      aria-labelledby="document-archive-title"
    >
      <header className="document-archive__heading">
        <div>
          <p className="document-archive__eyebrow">
            Emmanuel Church · The reading room
          </p>
          <h1 id="document-archive-title">{title}</h1>
        </div>
        <p>
          {issues.length} editions, newest first. <br />A little space to read,
          reflect, and stay connected.
        </p>
      </header>
      <div
        className="archive-reader"
        ref={region}
        tabIndex={0}
        role="region"
        aria-label={`${title} reader. Use left and right arrow keys to turn pages.`}
        onKeyDown={keyboard}
      >
        <div className="archive-reader__toolbar">
          <div>
            <button
              aria-expanded={indexOpen}
              aria-controls="archive-date-index"
              onClick={() => setIndexOpen(!indexOpen)}
            >
              Browse dates{" "}
              <span aria-hidden="true">{indexOpen ? "−" : "+"}</span>
            </button>
            <button onClick={() => go(1)} disabled={!issues.length}>
              Latest issue
            </button>
            <button onClick={() => go(0)}>Back to cover</button>
          </div>
          <div>
            <button
              aria-pressed={reading}
              disabled={reduced}
              onClick={() => {
                setPlain(!plain);
                setZoom(1);
              }}
            >
              {reduced
                ? "Reading mode · reduced motion"
                : reading
                  ? "Book view"
                  : "Reading mode"}
            </button>
            <button onClick={() => setExpanded(true)}>Expand / zoom ↗</button>
          </div>
        </div>
        <div className="archive-reader__stage">
          {!hydrated ? (
            <div className="archive-cover-static">
              <ArchiveCover kind={kind} count={issues.length} />
            </div>
          ) : reading ? (
            plainPage()
          ) : (
            !expanded && (
              <FlipEngine
                pages={pages}
                kind={kind}
                count={issues.length}
                current={current}
                onChange={onChange}
                onReady={onReady}
              />
            )
          )}
          {current === 0 && (
            <button className="archive-open" onClick={() => step(1)}>
              Open the collection <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
        {navigation()}
        <div className="archive-reader__utility">
          <span>
            {reading
              ? "Select text, or open a PDF for printing."
              : "Turn a corner, swipe, or use the arrows."}
          </span>
          {item && (
            <a
              href={withBasePath(item.issue.pdfPath)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open original PDF ↗
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {rightPage && rightPage.issue.id !== item?.issue.id && (
            <a
              href={withBasePath(rightPage.issue.pdfPath)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {dateLabel(rightPage.issue.date)} PDF ↗
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
      <div
        id="archive-date-index"
        className="archive-index"
        hidden={!indexOpen}
      >
        <div className="archive-index__heading">
          <div>
            <p className="document-archive__eyebrow">The contents</p>
            <h2>Find Your Week.</h2>
          </div>
          <label>
            Search dates{kind === "guides" ? ", titles, or series" : ""}
            <input
              ref={searchInput}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try August 2026"
            />
          </label>
        </div>
        {!matching.length && (
          <p role="status">No editions match. Try another date or title.</p>
        )}
        {Object.entries(groups).map(([month, group]) => (
          <section className="archive-index__month" key={month}>
            <h3>
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(`${month}-01T12:00:00Z`))}
            </h3>
            <ul>
              {group?.map((issue) => (
                <li key={issue.id}>
                  <button onClick={() => openIssue(issue)}>
                    <time dateTime={issue.date}>{dateLabel(issue.date)}</time>
                    <span>
                      {kind === "guides" ? issue.title : "Sunday bulletin"}
                      {issue.series && <small>{issue.series}</small>}
                    </span>
                    <span aria-hidden="true">Read →</span>
                  </button>
                  <a
                    href={withBasePath(issue.pdfPath)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open PDF: ${issue.title}, ${dateLabel(issue.date)} (new tab)`}
                  >
                    PDF ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <noscript>
        <div className="archive-index">
          <h2>Read the collection</h2>
          <p>Enable JavaScript for the flipbook, or open any PDF below.</p>
          <ul>
            {issues.map((issue) => (
              <li key={issue.id}>
                <a href={withBasePath(issue.pdfPath)}>
                  {dateLabel(issue.date)} — {issue.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
      {expanded && (
        <dialog
          className="archive-expanded"
          ref={dialog}
          aria-label={`${title}: expanded reading mode`}
          onCancel={() => setExpanded(false)}
          onKeyDown={keyboard}
        >
          <div className="archive-expanded__toolbar">
            <strong>{title}</strong>
            <div>
              <button
                onClick={() => setZoom((value) => Math.max(1, value - 0.25))}
                disabled={zoom <= 1}
                aria-label="Zoom out"
              >
                −
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((value) => Math.min(2.5, value + 0.25))}
                disabled={zoom >= 2.5}
                aria-label="Zoom in"
              >
                +
              </button>
              <button onClick={() => setExpanded(false)} autoFocus>
                Close ✕
              </button>
            </div>
          </div>
          {plainPage()}
          {navigation()}
          {item && (
            <a
              className="archive-expanded__pdf"
              href={withBasePath(item.issue.pdfPath)}
              target="_blank"
              rel="noreferrer"
            >
              Open original PDF ↗
            </a>
          )}
        </dialog>
      )}
    </section>
  );
}
