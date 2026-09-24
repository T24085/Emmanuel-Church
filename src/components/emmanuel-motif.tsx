/** A quiet echo of the open circles in Emmanuel's mark. */
export function EmmanuelMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`emmanuel-motif ${className}`.trim()}
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M 280 90 A 139 139 0 1 0 280 230" />
      <path d="M 259 104 A 114 114 0 1 0 259 216" />
    </svg>
  );
}
