"use client";

import { useRef } from "react";
import { ArrowRightIcon } from "./icons";

export function SermonsIntroDrawer({ liveHref }: { liveHref: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="sermons-page__drawer-trigger"
        aria-label="Open sermons information"
        aria-haspopup="dialog"
        aria-controls="sermons-info-drawer"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span aria-hidden="true">☰</span>
        <span>About sermons</span>
      </button>

      <dialog
        ref={dialogRef}
        id="sermons-info-drawer"
        className="sermons-page__drawer"
        aria-labelledby="sermons-drawer-title"
        onClose={() => triggerRef.current?.focus()}
      >
        <div className="sermons-page__drawer-head">
          <span>Emmanuel Church</span>
          <button type="button" aria-label="Close sermons information" onClick={() => dialogRef.current?.close()}>×</button>
        </div>
        <div className="sermons-page__drawer-content">
          <p className="eyebrow">Emmanuel Church · Abilene, Kansas</p>
          <h2 id="sermons-drawer-title">Sermons.</h2>
          <p>Watch the latest message, then explore more teaching from our church family.</p>

          <div className="sermons-page__drawer-live">
            <span>Worship with us online</span>
            <p>Join us live on Sundays at 8:45 and 11:00 AM Central.</p>
            <a className="button button--gold" href={liveHref} target="_blank" rel="noopener noreferrer">
              Watch Live Worship <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
