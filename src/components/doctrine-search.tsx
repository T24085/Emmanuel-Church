"use client";

import { useEffect, useId, useRef, useState } from "react";

type DoctrineSearchProps = {
  html: string;
};

export function DoctrineSearch({ html }: DoctrineSearchProps) {
  const [query, setQuery] = useState("");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const blocks = Array.from(content.querySelectorAll<HTMLElement>("p, h2, h3, h4, li"));
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      blocks.forEach((block) => {
        block.hidden = false;
      });
      setMatchCount(null);
      return;
    }

    let matches = 0;
    blocks.forEach((block) => {
      const isMatch = (block.textContent || "").toLocaleLowerCase().includes(normalizedQuery);
      block.hidden = !isMatch;
      if (isMatch) {
        matches += 1;
      }
    });
    setMatchCount(matches);
  }, [html, query]);

  return (
    <>
      <div className="doctrines-panel__search">
        <label htmlFor={searchId}>Search the doctrinal statement</label>
        <div className="doctrines-panel__search-row">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by word or topic"
            autoComplete="off"
          />
          {query ? (
            <button type="button" className="doctrines-panel__clear" onClick={() => setQuery("")}>
              Clear
            </button>
          ) : null}
        </div>
        <p className="doctrines-panel__search-status" role="status" aria-live="polite">
          {matchCount === null
            ? "Search the statement without changing the full text."
            : matchCount > 0
              ? `${matchCount} matching passage${matchCount === 1 ? "" : "s"}.`
              : "No matching passages found."}
        </p>
      </div>

      <div ref={contentRef} className="doctrines-panel__copy">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p>The full doctrinal statement could not be loaded at the moment.</p>
        )}
      </div>
    </>
  );
}
