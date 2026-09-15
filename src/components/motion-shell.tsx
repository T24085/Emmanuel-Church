"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelectors = [
  ".page-hero",
  ".section-heading",
  ".hero__copy",
  ".hero__card-row",
  ".feature-card",
  ".value-card",
  ".resource-card",
  ".staff-card",
  ".split-panel",
  ".quote-strip",
  ".inline-banner",
  ".link-list__item",
  ".giving-foundation__heading",
  ".giving-foundation__list",
  ".giving-foundation__item",
  ".giving-foundation__transition",
  ".mission-word-reveal",
].join(", ");

export function MotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector<HTMLElement>(".hero");

    root.classList.add("motion-ready");
    root.classList.toggle("motion-reduce", reducedMotion);

    const givingList = document.querySelector<HTMLElement>(".giving-foundation__list");
    const givingItems = Array.from(
      document.querySelectorAll<HTMLElement>(".giving-foundation__item")
    );

    const updateGivingJourney = () => {
      if (!givingList || givingItems.length === 0) {
        return;
      }

      const listRect = givingList.getBoundingClientRect();
      const focusLine = window.innerHeight * 0.44;
      let activeItem: HTMLElement | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const item of givingItems) {
        const rect = item.getBoundingClientRect();
        const isInFocusRange = rect.bottom > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.86;
        const distance = Math.abs(rect.top + rect.height / 2 - focusLine);

        if (isInFocusRange && distance < closestDistance) {
          activeItem = item;
          closestDistance = distance;
        }
      }

      for (const item of givingItems) {
        item.classList.toggle("is-active", item === activeItem);
      }

      givingList.classList.toggle("has-active", Boolean(activeItem));

      if (activeItem) {
        const marker = activeItem.querySelector<HTMLElement>(".giving-foundation__marker");
        if (marker) {
          const markerRect = marker.getBoundingClientRect();
          const glowTop = markerRect.top - listRect.top + markerRect.height / 2;
          givingList.style.setProperty("--giving-path-glow-top", `${glowTop}px`);
        }
      }

      const quoteShift = Math.max(
        -12,
        Math.min(12, (window.innerHeight * 0.48 - listRect.top) * 0.018)
      );
      givingList.style.setProperty("--giving-quote-shift", `${quoteShift}px`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Content stays visible by default; animation is an enhancement,
            // never a prerequisite for reading the page.
            if (!reducedMotion && !entry.target.classList.contains("is-visible") &&
                !entry.target.classList.contains("value-card--flip")) {
              entry.target.animate(
                [{ opacity: 0.65, translate: "0 16px" }, { opacity: 1, translate: "0 0" }],
                { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
              );
            }
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.01,
        rootMargin: "0px",
      }
    );

    const observed = new WeakSet<Element>();
    const observeTargets = () => {
      document.querySelectorAll(revealSelectors).forEach((element) => {
        if (!observed.has(element)) {
          observed.add(element);
          observer.observe(element);
        }
      });
    };

    observeTargets();

    let mutationRaf = 0;
    const mutationObserver = new MutationObserver(() => {
      if (!mutationRaf) mutationRaf = window.requestAnimationFrame(() => {
        mutationRaf = 0;
        observeTargets();
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    let rafId = 0;
    const updateHeroParallax = () => {
      rafId = 0;
      if (reducedMotion) {
        root.style.removeProperty("--hero-parallax");
        return;
      }
      if (!hero) {
        root.style.removeProperty("--hero-parallax");
        updateGivingJourney();
        return;
      }

      const heroRect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const scrolled = Math.max(0, -heroRect.top);
      const travel = heroRect.height || viewportHeight;
      const progress = Math.min(1, scrolled / travel);
      const maxShift = window.innerWidth < 768 ? 18 : 56;
      const shift = Math.round(progress * maxShift);

      root.style.setProperty("--hero-parallax", `${shift}px`);
      updateGivingJourney();
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateHeroParallax);
      }

      root.classList.toggle("site-scrolled", window.scrollY > 12);
    };

    updateHeroParallax();
    root.classList.toggle("site-scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      mutationObserver.disconnect();
      window.cancelAnimationFrame(mutationRaf);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      root.style.removeProperty("--hero-parallax");
    };
  }, [pathname]);

  return children;
}
