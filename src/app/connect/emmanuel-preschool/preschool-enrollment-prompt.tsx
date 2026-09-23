"use client";

import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";

type PreschoolEnrollmentPromptProps = {
  enrollmentHref: string;
};

export function PreschoolEnrollmentPrompt({ enrollmentHref }: PreschoolEnrollmentPromptProps) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [closingVisible, setClosingVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("#preschool-hero");
    const closing = document.querySelector("#preschool-enrollment");
    const footer = document.querySelector(".site-footer");

    if (!hero || !closing || !footer || !("IntersectionObserver" in window)) {
      setHeroVisible(false);
      return;
    }

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.08, rootMargin: "-12% 0px 0px" },
    );
    const closingObserver = new IntersectionObserver(
      ([entry]) => setClosingVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );
    const footerObserver = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );

    heroObserver.observe(hero);
    closingObserver.observe(closing);
    footerObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      closingObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const isVisible = !heroVisible && !closingVisible && !footerVisible;

  return (
    <a
      className={`preschool-enrollment-prompt${isVisible ? " preschool-enrollment-prompt--visible" : ""}`}
      href={enrollmentHref}
      target="_blank"
      rel="noreferrer"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <span className="preschool-enrollment-prompt__eyebrow">Now enrolling</span>
      <strong>Begin Enrollment</strong>
      <ArrowRightIcon className="icon icon--sm" />
    </a>
  );
}
