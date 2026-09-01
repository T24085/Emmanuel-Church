"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/site-path";

const minimumDisplayMs = 1150;
const maximumDisplayMs = 3500;
const exitDurationMs = 900;

type LoaderState = "hidden" | "loading" | "exiting";

function heroIsReady() {
  const video = document.querySelector<HTMLVideoElement>(".hero__video--current");
  if (video && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return true;
  }

  const frame = document.querySelector<HTMLIFrameElement>(".hero__sermon-frame");
  return Boolean(frame?.contentDocument?.readyState === "complete");
}

export function LandingLoader() {
  const pathname = usePathname();
  const [state, setState] = useState<LoaderState>(pathname === "/" ? "loading" : "hidden");

  useEffect(() => {
    if (pathname !== "/") {
      setState("hidden");
      return;
    }

    const startedAt = performance.now();
    let exitTimer: number | null = null;
    let maxWaitTimer: number | null = null;
    let didReveal = false;

    setState("loading");

    const finish = () => {
      if (didReveal) {
        return;
      }

      didReveal = true;
      const remainingMinimumTime = Math.max(0, minimumDisplayMs - (performance.now() - startedAt));

      window.setTimeout(() => {
        setState("exiting");
        exitTimer = window.setTimeout(() => setState("hidden"), exitDurationMs);
      }, remainingMinimumTime);
    };

    const handleHeroReady = () => finish();
    window.addEventListener("emmanuel:hero-ready", handleHeroReady);

    const readinessCheck = window.setTimeout(() => {
      if (heroIsReady()) {
        finish();
      }
    }, 80);

    maxWaitTimer = window.setTimeout(finish, maximumDisplayMs);

    return () => {
      window.clearTimeout(readinessCheck);
      if (maxWaitTimer !== null) {
        window.clearTimeout(maxWaitTimer);
      }
      if (exitTimer !== null) {
        window.clearTimeout(exitTimer);
      }
      window.removeEventListener("emmanuel:hero-ready", handleHeroReady);
    };
  }, [pathname]);

  if (state === "hidden") {
    return null;
  }

  return (
    <div
      className={`landing-loader${state === "exiting" ? " landing-loader--exiting" : ""}`}
      role="status"
      aria-label="Loading Emmanuel Church"
    >
      <div className="landing-loader__glow" aria-hidden="true" />
      <div className="landing-loader__mark">
        <span className="landing-loader__orbit landing-loader__orbit--outer" aria-hidden="true" />
        <span className="landing-loader__orbit landing-loader__orbit--inner" aria-hidden="true" />
        <Image
          src={withBasePath("/images/emmanuel-church-logo.png")}
          alt="Emmanuel Church"
          width={440}
          height={170}
          priority
          className="landing-loader__logo"
        />
      </div>
      <div className="landing-loader__footer">
        <span>Emmanuel Church</span>
        <span className="landing-loader__rule" aria-hidden="true" />
        <span>Making Him known</span>
      </div>
    </div>
  );
}
