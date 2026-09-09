"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GivingScripture } from "@/data/giving";

type ScriptureModalProps = {
  title: string;
  scriptures: GivingScripture[];
};

function TypingScripture({ text, delay = 0 }: { text: string; delay?: number }) {
  const [characterCount, setCharacterCount] = useState(0);
  const [isStarted, setIsStarted] = useState(delay === 0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(reduceMotion);

    if (reduceMotion) {
      setCharacterCount(text.length);
      return;
    }

    let typeTimeout = 0;
    const startTimeout = window.setTimeout(() => {
      setIsStarted(true);
      let nextCount = 0;

      const revealNextCharacter = () => {
        nextCount += 1;
        setCharacterCount(nextCount);

        if (nextCount < text.length) {
          typeTimeout = window.setTimeout(revealNextCharacter, 5);
        }
      };

      revealNextCharacter();
    }, delay);

    return () => {
      window.clearTimeout(startTimeout);
      window.clearTimeout(typeTimeout);
    };
  }, [delay, text]);

  const isComplete = isReducedMotion || characterCount >= text.length;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        className={`scripture-modal__typing${isStarted ? " is-started" : ""}${isComplete ? " is-complete" : ""}`}
        aria-hidden="true"
      >
        {text.slice(0, characterCount)}
      </span>
    </>
  );
}

export function ScriptureModal({ title, scriptures }: ScriptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const typingDelays = scriptures.map((_, index) =>
    scriptures
      .slice(0, index)
      .reduce((total, scripture) => total + scripture.text.length * 5 + 280, 0),
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      closeRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        window.requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
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
      <div className="giving-foundation__scriptures" aria-label={`${title} scripture`}>
        <p className="eyebrow eyebrow--small">Scripture · KJV</p>
        {scriptures.map((scripture) => (
          <blockquote key={scripture.reference}>
            <p>“{scripture.text}”</p>
            <cite>{scripture.reference}</cite>
          </blockquote>
        ))}
        <button
          ref={triggerRef}
          className="giving-foundation__scriptures-trigger"
          type="button"
          aria-haspopup="dialog"
          aria-label={`Enlarge scripture passages for ${title}`}
          onClick={() => setIsOpen(true)}
        >
          <span className="sr-only">Enlarge scripture passages</span>
        </button>
      </div>

      {isOpen
        ? createPortal(
            <div
              className="scripture-modal"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeModal();
              }}
            >
              <div
                className="scripture-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
              >
                <div className="scripture-modal__header">
                  <p className="eyebrow eyebrow--small">Scripture · KJV</p>
                  <button
                    ref={closeRef}
                    className="scripture-modal__close"
                    type="button"
                    aria-label="Close scripture reader"
                    onClick={closeModal}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <h2 id={titleId}>{title}</h2>
                <div className="scripture-modal__passages">
                  {scriptures.map((scripture, index) => (
                    <blockquote key={scripture.reference}>
                      <p>
                        “<TypingScripture text={scripture.text} delay={typingDelays[index]} />”
                      </p>
                      <cite>{scripture.reference}</cite>
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
