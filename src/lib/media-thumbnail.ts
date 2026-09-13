/** Keep Vimeo's original artwork for large display, not a small archive tile. */
export function largeMediaThumbnail(thumbnail: string | null | undefined) {
  if (!thumbnail?.includes("i.vimeocdn.com/video/")) return thumbnail || null;
  return thumbnail.replace(/-d_[^?]+(?=\?|$)/, "-d_original");
}
