"use client";

import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import { givingJourneyStages } from "@/data/giving";
import { ArrowRightIcon, CloseIcon } from "./icons";

type GivingJourneyModalProps = {
  className?: string;
};

export function GivingJourneyModal({ className }: GivingJourneyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const triggerClassName = className || "giving-journey-trigger";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimeout = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimeout);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      <button
        ref={triggerRef}
        className={triggerClassName}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <span>Start Your Journey Now</span>
        <ArrowRightIcon className="icon icon--xs" />
      </button>

      {isOpen
        ? createPortal(
            <div
              className="giving-journey-modal"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div
                className="giving-journey-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
              >
                <div className="giving-journey-modal__chrome">
                  <p className="eyebrow eyebrow--small">Emmanuel Church · Generosity</p>
                  <button
                    ref={closeRef}
                    className="giving-journey-modal__close"
                    type="button"
                    aria-label="Close The Giving Journey"
                    onClick={closeModal}
                  >
                    <CloseIcon className="icon icon--sm" />
                  </button>
                </div>

                <header className="giving-journey-modal__intro">
                  <div>
                    <p className="giving-journey-modal__kicker">Generosity is more than what we give.</p>
                    <h2 id={titleId}>
                      <span>The</span> Giving <em>Journey</em>
                    </h2>
                    <p id={descriptionId}>
                      As we grow, we move from receiving to responding, from being transformed to
                      trusting, and from trusting to investing in what lasts.
                    </p>
                  </div>
                  <div className="giving-journey-modal__orbit" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                </header>

                <section className="giving-journey-track" aria-labelledby={`${titleId}-stages`}>
                  <h3 id={`${titleId}-stages`} className="sr-only">
                    Five stages of a generosity journey
                  </h3>
                  <svg className="giving-journey-track__path" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      className="giving-journey-track__path-base"
                      d="M30 155 C90 42 150 46 220 135 S325 240 390 110 S510 24 590 122 S710 240 790 86 S905 24 970 95"
                    />
                    <path
                      className="giving-journey-track__path-flow"
                      d="M30 155 C90 42 150 46 220 135 S325 240 390 110 S510 24 590 122 S710 240 790 86 S905 24 970 95"
                    />
                    <g className="giving-journey-track__drop-lines">
                      <path d="M100 82 C100 160 100 258 100 390" />
                      <path d="M300 190 C300 244 300 308 300 390" />
                      <path d="M500 67 C500 164 500 278 500 390" />
                      <path d="M700 182 C700 248 700 314 700 390" />
                      <path d="M900 54 C900 154 900 280 900 390" />
                    </g>
                    <g className="giving-journey-track__arrows">
                      <path className="giving-journey-track__arrow" d="M-18-13 0 15 18-13" transform="translate(100 392) scale(.62)" />
                      <path className="giving-journey-track__arrow" d="M-18-13 0 15 18-13" transform="translate(300 392) scale(.78)" />
                      <path className="giving-journey-track__arrow" d="M-18-13 0 15 18-13" transform="translate(500 392) scale(.96)" />
                      <path className="giving-journey-track__arrow" d="M-18-13 0 15 18-13" transform="translate(700 392) scale(1.14)" />
                      <path className="giving-journey-track__arrow" d="M-18-13 0 15 18-13" transform="translate(900 392) scale(1.34)" />
                    </g>
                  </svg>
                  <ol className="giving-journey-track__stages">
                    {givingJourneyStages.map((stage, index) => (
                      <li className="giving-journey-stage" key={stage.id} style={{ "--stage-index": index } as React.CSSProperties}>
                        <div className="giving-journey-stage__label">
                          <span className="giving-journey-stage__number">0{index + 1}</span>
                          <p className="giving-journey-stage__subtitle">{stage.subtitle}</p>
                          <h4>{stage.title}</h4>
                        </div>
                        <div className="giving-journey-stage__card">
                          <p className="giving-journey-stage__quote">“{stage.quote}”</p>
                          <p>{stage.body}</p>
                          <div className="giving-journey-stage__scripture">
                            <strong>{stage.scripture}</strong>
                            <p>{stage.scriptureText}</p>
                          </div>
                          <p className="giving-journey-stage__question">Question to ask: {stage.question}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                <footer className="giving-journey-modal__footer">
                  <p>Generosity becomes a way of life when our hearts stay lifted toward God.</p>
                  <div>
                    <a className="button button--journey-light" href="https://www.fellowshiponegiving.com/App/Giving/ecabilene" target="_blank" rel="noreferrer">
                      Give online
                      <ArrowRightIcon className="icon icon--xs" />
                    </a>
                    <a className="giving-journey-modal__contact" href="/contact">
                      Need help? Contact us
                    </a>
                  </div>
                </footer>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
