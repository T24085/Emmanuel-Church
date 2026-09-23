"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { MediaArchivePage } from "@/lib/media-archive";
import { archiveMediaThumbnail } from "@/lib/media-thumbnail";
import { SermonPlayer, type SermonPlayerItem } from "./sermon-player";
import { ArrowRightIcon } from "./icons";

type MediaArchiveBrowserProps = {
  pages: MediaArchivePage[];
  audioSermons: SermonPlayerItem[];
  bibleAppHref: string;
};

function originalVideoHref(href: string | null | undefined, embedSrc: string | null | undefined) {
  if (href) return href;

  const vimeoId = embedSrc?.match(/^https:\/\/player\.vimeo\.com\/video\/(\d+)/)?.[1];
  if (vimeoId) return `https://vimeo.com/${vimeoId}`;

  const youtubeId = embedSrc?.match(/^https:\/\/www\.youtube\.com\/embed\/([\w-]+)/)?.[1];
  if (youtubeId) return `https://www.youtube.com/watch?v=${youtubeId}`;

  return "https://www.ecabilene.org/resources/sermons";
}

function VideoCard({
  sermon,
  selected,
  onSelect,
}: {
  sermon: SermonPlayerItem;
  selected: boolean;
  onSelect: (sermon: SermonPlayerItem) => void;
}) {
  return (
    <button
      type="button"
      className={`sermons-library__card${selected ? " sermons-library__card--selected" : ""}`}
      onClick={() => onSelect(sermon)}
      aria-pressed={selected}
    >
      <span className="sermons-library__art">
        <span className="sermons-library__art-fallback" aria-hidden="true">
          <span>EMMANUEL CHURCH</span>
          <strong>E</strong>
        </span>
        {sermon.thumbnail ? (
          <img
            src={archiveMediaThumbnail(sermon.thumbnail) || undefined}
            alt=""
            loading="lazy"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
          />
        ) : null}
        <span className="sermons-library__card-shade" aria-hidden="true" />
        <span className="sermons-library__card-play" aria-hidden="true">▶</span>
        <span className="sermons-library__card-copy">
          <strong>{sermon.label}</strong>
          <span>{sermon.date || "Emmanuel Church"}</span>
        </span>
      </span>
    </button>
  );
}

function SearchButton({ onClick, expanded }: { onClick: () => void; expanded: boolean }) {
  return (
    <button
      type="button"
      className="sermons-library__search-trigger"
      data-sermon-search-trigger
      onClick={onClick}
      aria-label="Search sermons"
      aria-controls="sermons-search-panel"
      aria-expanded={expanded}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.7" />
        <path d="m16 16 5 5" />
      </svg>
    </button>
  );
}

function VideoShelf({
  title,
  sermons,
  selectedId,
  onSelect,
  onOpenSearch,
  searchOpen,
}: {
  title: string;
  sermons: SermonPlayerItem[];
  selectedId: number | null;
  onSelect: (sermon: SermonPlayerItem) => void;
  onOpenSearch?: () => void;
  searchOpen?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <div className="sermons-library__shelf">
      <div className="sermons-library__shelf-heading">
        <div>
          <h3>{title}</h3>
          <span>{sermons.length} {sermons.length === 1 ? "message" : "messages"}</span>
        </div>
        <div className="sermons-library__shelf-controls">
          {onOpenSearch ? <SearchButton onClick={onOpenSearch} expanded={Boolean(searchOpen)} /> : null}
          <button type="button" onClick={() => move(-1)} aria-label={`Scroll ${title} backward`}>←</button>
          <button type="button" onClick={() => move(1)} aria-label={`Scroll ${title} forward`}>→</button>
        </div>
      </div>
      <div className="sermons-library__rail" ref={trackRef} aria-label={title}>
        {sermons.map((sermon) => (
          <VideoCard
            key={sermon.mediaId}
            sermon={sermon}
            selected={sermon.mediaId === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function MediaArchiveBrowser({ pages, audioSermons, bibleAppHref }: MediaArchiveBrowserProps) {
  const videos = useMemo<SermonPlayerItem[]>(() => {
    const seen = new Set<number>();
    return pages.flatMap((page) => page.items)
      .filter((item) => item.kind === "video" && Boolean(item.embedSrc))
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => ({
        label: /^\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}$/.test(item.title)
          ? "Service Recording"
          : item.title,
        href: originalVideoHref(item.href, item.embedSrc),
        mediaId: item.id,
        embedSrc: item.embedSrc,
        thumbnail: item.thumbnail,
        date: item.date || null,
        kind: "video" as const,
      }));
  }, [pages]);

  const [selectedId, setSelectedId] = useState<number | null>(videos[0]?.mediaId ?? null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);
  const selected = videos.find((video) => video.mediaId === selectedId) ?? videos[0];

  const openSearch = () => {
    setSearchOpen(true);
  };

  useEffect(() => {
    if (!searchOpen) return;
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => window.clearTimeout(focusTimer);
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>("[data-sermon-search-trigger]")?.focus());
  };

  useEffect(() => {
    if (!searchOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        requestAnimationFrame(() => document.querySelector<HTMLButtonElement>("[data-sermon-search-trigger]")?.focus());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    stageRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    stageRef.current?.querySelector<HTMLButtonElement>(".sermon-player__poster")?.focus({ preventScroll: true });
  }, [selectedId]);

  const selectVideo = (sermon: SermonPlayerItem) => {
    if (sermon.mediaId === selectedId) {
      stageRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
      stageRef.current?.querySelector<HTMLButtonElement>(".sermon-player__poster")?.focus({ preventScroll: true });
      return;
    }
    pendingFocus.current = true;
    setSelectedId(sermon.mediaId);
  };

  const shelves = useMemo(() => {
    const grouped = new Map<string, SermonPlayerItem[]>();
    for (const video of videos) {
      const year = video.date?.match(/\b20\d{2}\b/)?.[0] || "Earlier";
      if (!grouped.has(year)) grouped.set(year, []);
      grouped.get(year)?.push(video);
    }
    return [...grouped.entries()].map(([year, sermons], index) => ({
      title: index === 0 && year !== "Earlier" ? "Latest Messages" : year === "Earlier" ? "Earlier Messages" : `${year} Messages`,
      sermons,
    }));
  }, [videos]);

  const normalizedQuery = query.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? videos.filter((video) => `${video.label} ${video.date || ""}`.toLowerCase().includes(normalizedQuery))
    : [];

  return (
    <div className="media-archive-browser">
      <div className="sermons-page__player-anchor" ref={stageRef}>
        {selected ? <SermonPlayer key={selected.mediaId} sermon={selected} /> : (
          <p className="sermons-library__empty">Video messages are temporarily unavailable. Please check back soon.</p>
        )}
      </div>

      <div className="sermons-library" id="sermon-library" role="region" aria-label="Sermon library">
        <div className="sermons-library__inner">
          {normalizedQuery ? (
            <div className="sermons-library__results">
              <div className="sermons-library__results-heading">
                <p aria-live="polite">{searchResults.length} {searchResults.length === 1 ? "message" : "messages"} found</p>
                <div>
                  <SearchButton onClick={openSearch} expanded={searchOpen} />
                  <button type="button" onClick={() => setQuery("")}>Clear search</button>
                </div>
              </div>
              {searchResults.length ? (
                <div className="sermons-library__result-grid">
                  {searchResults.map((sermon) => (
                    <VideoCard key={sermon.mediaId} sermon={sermon} selected={sermon.mediaId === selected?.mediaId} onSelect={selectVideo} />
                  ))}
                </div>
              ) : <p className="sermons-library__no-results">No messages match that search. Try another title or year.</p>}
            </div>
          ) : (
            <div className="sermons-library__shelves">
              {shelves.map((shelf, index) => (
                <VideoShelf key={shelf.title} title={shelf.title} sermons={shelf.sermons} selectedId={selected?.mediaId ?? null} onSelect={selectVideo} onOpenSearch={index === 0 ? openSearch : undefined} searchOpen={searchOpen} />
              ))}
            </div>
          )}

          <div className="sermons-library__extras">
            <details className="sermons-library__audio">
              <summary>
                <span>Older Audio Teaching</span>
                <span>{audioSermons.length} recordings <span aria-hidden="true">＋</span></span>
              </summary>
              <div className="sermons-library__audio-list">
                {audioSermons.map((sermon) => (
                  <a key={sermon.href} href={sermon.href} target="_blank" rel="noopener noreferrer">
                    <span>{sermon.label}<small>{sermon.date || sermon.series || "Audio archive"}</small></span>
                    <ArrowRightIcon className="icon icon--xs" />
                  </a>
                ))}
              </div>
            </details>
            <div className="sermons-library__resources">
              <p className="eyebrow eyebrow--small">Keep studying</p>
              <a href={bibleAppHref} target="_blank" rel="noopener noreferrer">YouVersion notes <ArrowRightIcon className="icon icon--xs" /></a>
              <Link href="/resources/weekly-sermon-study-guides">Weekly study guides <ArrowRightIcon className="icon icon--xs" /></Link>
            </div>
          </div>
        </div>
      </div>
      <div className={`sermons-library__search-backdrop${searchOpen ? " is-open" : ""}`} onClick={closeSearch} aria-hidden="true" />
      <aside id="sermons-search-panel" className={`sermons-library__search-drawer${searchOpen ? " is-open" : ""}`} role="search" aria-label="Search sermons" aria-hidden={!searchOpen} inert={!searchOpen}>
        <div className="sermons-library__search-drawer-head">
          <p className="eyebrow">Search the archive</p>
          <button type="button" onClick={closeSearch} aria-label="Close search">×</button>
        </div>
        <label className="sermons-library__search">
          <span>Title or year</span>
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages"
          />
        </label>
        <p className="sermons-library__search-count" aria-live="polite">
          {normalizedQuery ? `${searchResults.length} matching ${searchResults.length === 1 ? "video" : "videos"}` : `${videos.length} videos to explore`}
        </p>
        <button className="sermons-library__search-done" type="button" onClick={closeSearch}>
          {normalizedQuery ? "View matching videos" : "Browse all videos"}
          <ArrowRightIcon className="icon icon--xs" />
        </button>
      </aside>
    </div>
  );
}
