"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GivingScripture } from "@/data/giving";

type ScriptureModalProps = {
  title: string;
  scriptures: GivingScripture[];
};

export function ScriptureModal({ title, scriptures }: ScriptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

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
                  {scriptures.map((scripture) => (
                    <blockquote key={scripture.reference}>
                      <p>“{scripture.text}”</p>
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
