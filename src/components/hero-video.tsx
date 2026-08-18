"use client";

import Player from "@vimeo/player";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/site-path";

const heroVideos = [withBasePath("/videos/hero-1-1.mp4?v=3"), withBasePath("/videos/hero-2-2.mp4?v=3")];
const crossfadeMs = 850;
const heroPositionPrefix = "emmanuel-hero-position:";

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

function getPositionKey(source: string) {
  return `${heroPositionPrefix}${source}`;
}

function readStoredPosition(key: string) {
  try {
    const value = Number(sessionStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function writeStoredPosition(key: string, seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return;
  }

  try {
    sessionStorage.setItem(key, String(Math.floor(seconds)));
  } catch {
    // Storage can be unavailable in private browsing; playback still works.
  }
}

export function HeroVideo({ latestSermon }: { latestSermon?: LatestSermonPreview | null }) {
  if (latestSermon?.embedSrc) {
    return <VimeoHeroVideo latestSermon={latestSermon} />;
  }

  return <RotatingHeroVideo />;
}

function VimeoHeroVideo({ latestSermon }: { latestSermon: LatestSermonPreview }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const player = new Player(iframe);
    const positionKey = getPositionKey(latestSermon.embedSrc);
    const restorePosition = async () => {
      const storedPosition = readStoredPosition(positionKey);
      if (storedPosition === null) {
        return;
      }

      try {
        await player.setCurrentTime(storedPosition);
      } catch {
        // The video may have changed or the player may not be ready yet.
      }
    };
    const savePosition = async () => {
      try {
        const currentTime = await player.getCurrentTime();
        writeStoredPosition(positionKey, currentTime);
      } catch {
        // The iframe may already be unloading during a route change.
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void savePosition();
      }
    };

    const saveInterval = window.setInterval(() => {
      void savePosition();
    }, 2000);

    void player.ready().then(() => restorePosition()).catch(() => {
      // Autoplay or player initialization can be blocked without affecting the page.
    });
    window.addEventListener("pagehide", savePosition);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(saveInterval);
      window.removeEventListener("pagehide", savePosition);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void savePosition();
      void player.destroy().catch(() => {
        // The iframe may already be gone after a route transition.
      });
    };
  }, [latestSermon.embedSrc]);

  return (
    <div className="hero__media hero__media--sermon">
      <iframe
        ref={iframeRef}
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

function RotatingHeroVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeRef = useRef<HTMLVideoElement | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const activeSrc = heroVideos[activeIndex] ?? heroVideos[0];
  const previousSrc = previousIndex !== null ? heroVideos[previousIndex] ?? null : null;

  useEffect(() => {
    const video = activeRef.current;
    if (!video) {
      return;
    }

    const positionKey = getPositionKey(activeSrc);
    const startPlayback = () => {
      const storedPosition = readStoredPosition(positionKey);
      if (storedPosition !== null && Number.isFinite(video.duration) && storedPosition < video.duration) {
        video.currentTime = storedPosition;
      }

      void video.play().catch(() => {
        // Muted autoplay should normally succeed, but playback can still be blocked.
      });
    };
    const savePosition = () => writeStoredPosition(positionKey, video.currentTime);
    const saveInterval = window.setInterval(savePosition, 2000);

    if (video.readyState >= 1) {
      startPlayback();
    } else {
      video.addEventListener("loadedmetadata", startPlayback, { once: true });
    }

    window.addEventListener("pagehide", savePosition);
    return () => {
      window.clearInterval(saveInterval);
      video.removeEventListener("loadedmetadata", startPlayback);
      window.removeEventListener("pagehide", savePosition);
      savePosition();
    };
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
