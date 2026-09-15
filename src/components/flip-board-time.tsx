import type { CSSProperties } from "react";

type FlipBoardTimeProps = {
  value: string;
  delay?: number;
};

export function FlipBoardTime({ value, delay = 0 }: FlipBoardTimeProps) {
  return (
    <span className="flip-board-time">
      <span className="sr-only">{value}</span>
      <span className="flip-board-time__glyphs" aria-hidden="true">
        {Array.from(value).map((character, index) => {
          const isSpace = character === " ";

          return (
            <span
              className={`flip-board-time__glyph${isSpace ? " flip-board-time__glyph--space" : ""}`}
              key={`${character}-${index}`}
              style={{ "--flip-delay": `${delay + index * 70}ms` } as CSSProperties}
            >
              {isSpace ? "\u00a0" : character}
            </span>
          );
        })}
      </span>
    </span>
  );
}
