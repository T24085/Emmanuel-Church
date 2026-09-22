"use client";

import { useEffect } from "react";

export function MinistryMotion() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".ministries-page");
    if (!page || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const targets = Array.from(page.querySelectorAll<HTMLElement>(".ministry-reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    page.classList.add("ministries-motion-ready");

    return () => observer.disconnect();
  }, []);

  return null;
}
