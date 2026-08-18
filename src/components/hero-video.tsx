"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/site-path";

const heroVideos = [withBasePath("/videos/hero-1-1.mp4?v=3"), withBasePath("/videos/hero-2-2.mp4?v=3")];
const crossfadeMs = 850;

type LatestSermonPreview = {
  title: string;
  embedSrc: string;
};

function buildAutoplaySrc(embedSrc: string) {
  try {
    const url = new URL(embedSrc);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("muted", "1");
    url.searchParams.set("loop", "1");
    url.searchParams.set("background", "1");
    url.searchParams.set("autopause", "0");
    url.searchParams.set("title", "0");
    url.searchParams.set("byline", "0");
    url.searchParams.set("portrait", "0");
    url.searchParams.set("dnt", "1");
    return url.toString();
  } catch {
    return embedSrc;
  }
}

export function HeroVideo({ latestSermon }: { latestSermon?: LatestSermonPreview | null }) {
  if (latestSermon?.embedSrc) {
    return (
      <div className="hero__media hero__media--sermon">
        <iframe
          className="hero__sermon-frame"
          src={buildAutoplaySrc(latestSermon.embedSrc)}
          title={`Latest sermon: ${latestSermon.title}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="eager"
          aria-hidden="true"
        />
      </div>
    );
  }

  return <RotatingHeroVideo />;
}

function RotatingHeroVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeRef = useRef<HTMLVideoElement | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const activeSrc = heroVideos[activeIndex] ?? heroVideos[0];
  const previousSrc = previousIndex !== null ? heroVideos[previousIndex] ?? null : null;

  useEffect(() => {
    if (!activeRef.current) {
      return;
    }

    const playPromise = activeRef.current.play();
    if (playPromise && typeof playPromise.catch === "function") {
      void playPromise.catch(() => {
        // Autoplay can still be blocked in rare browser states; muted playback
        // should normally succeed, and the next render keeps the video mounted.
      });
    }
  }, [activeSrc]);

  useEffect(() => {
    if (!isTransitioning) {
      return;
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setPreviousIndex(null);
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, crossfadeMs);

    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [isTransitioning]);

  return (
    <div className={`hero__media${isTransitioning ? " hero__media--transitioning" : ""}`}>
      {previousSrc ? (
        <video className="hero__video hero__video--previous" muted playsInline preload="auto" aria-hidden="true">
          <source src={previousSrc} type="video/mp4" />
        </video>
      ) : null}
      <video
        key={activeSrc}
        ref={activeRef}
        className="hero__video hero__video--current"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onEnded={() => {
          if (isTransitioning) {
            return;
          }

          setPreviousIndex(activeIndex);
          setActiveIndex((current) => (current + 1) % heroVideos.length);
          setIsTransitioning(true);
        }}
      >
        <source src={activeSrc} type="video/mp4" />
      </video>
    </div>
  );
}
