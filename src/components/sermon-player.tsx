"use client";

import { useState } from "react";
import { ArrowRightIcon } from "./icons";
import { largeMediaThumbnail } from "@/lib/media-thumbnail";

export type SermonPlayerItem = {
  label: string;
  href: string;
  mediaId: number;
  embedSrc: string | null;
  audioUrl?: string | null;
  date?: string | null;
  speaker?: string | null;
  series?: string | null;
  thumbnail?: string | null;
  kind?: "video" | "audio";
};

export function SermonPlayer({ sermon }: { sermon: SermonPlayerItem }) {
  const [playRequested, setPlayRequested] = useState(false);
  const hasAudio = Boolean(sermon.audioUrl);

  return (
    <div className="sermon-player__stage" data-playing={playRequested}>
      <div className="sermon-player__media">
        {sermon.embedSrc && !playRequested ? (
          <button
            type="button"
            className="sermon-player__poster"
            onClick={() => setPlayRequested(true)}
            aria-label={`Play ${sermon.label}`}
          >
            {sermon.thumbnail ? (
              <img
                src={largeMediaThumbnail(sermon.thumbnail) || undefined}
                alt=""
                onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
              />
            ) : null}
            <span className="sermon-player__play"><span aria-hidden="true">▶</span> Play message</span>
          </button>
        ) : sermon.embedSrc ? (
          <iframe
            src={sermon.embedSrc}
            title={sermon.label}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : hasAudio ? (
          <div className="sermon-player__audio-wrap">
            <audio controls src={sermon.audioUrl || undefined} />
            <p className="sermon-player__audio-note">Audio recording for this message.</p>
          </div>
        ) : (
          <div className="sermon-player__fallback">
            <p className="eyebrow eyebrow--small">Video unavailable</p>
            <h3>{sermon.label}</h3>
            <p>The original sermon page is still available below.</p>
            <a className="button button--gold button--small" href={sermon.href} target="_blank" rel="noopener noreferrer">
              <span>Open sermon page</span>
              <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>
        )}
      </div>

      {sermon.embedSrc ? (
        <div className="sermon-player__meta">
          <div>
            <h2 aria-live="polite">{sermon.label}</h2>
            {sermon.date ? <p>{sermon.date}</p> : null}
          </div>
          <a href={sermon.href} target="_blank" rel="noopener noreferrer">
            <span>Original video</span>
            <ArrowRightIcon className="icon icon--xs" />
          </a>
        </div>
      ) : null}
    </div>
  );
}
