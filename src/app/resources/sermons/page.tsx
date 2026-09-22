import { MediaArchiveBrowser } from "@/components/media-archive-browser";
import { SermonsIntroDrawer } from "@/components/sermons-intro-drawer";
import type { SermonPlayerItem } from "@/components/sermon-player";
import {
  loadMediaArchivePages,
  mediaArchiveRevalidateSeconds,
} from "@/lib/media-archive";
import { sermonArchive, site } from "@/data/site";
import "./sermons.css";

export const revalidate = 21600;

function extractMediaId(href: string) {
  const match = href.match(/\/media\/\d+-\d+-(\d+)\//);
  return match ? Number(match[1]) : null;
}

function buildEmbedSrc(thirdPartyId: string | number | null | undefined) {
  if (!thirdPartyId) {
    return null;
  }

  const id = String(thirdPartyId).trim();
  if (!id) {
    return null;
  }

  if (/^\d+$/.test(id)) {
    const params = new URLSearchParams({
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1",
    });

    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  }

  return `https://www.youtube.com/embed/${id}`;
}

async function loadTeachingSeries(): Promise<SermonPlayerItem[]> {
  return Promise.all(
    sermonArchive.map(async (sermon) => {
      const mediaId = extractMediaId(sermon.href);

      if (!mediaId) {
        return {
          label: sermon.label,
          href: sermon.href,
          mediaId: 0,
          embedSrc: null,
          audioUrl: null,
          kind: "audio" as const,
        };
      }

      try {
        const pageResponse = await fetch(sermon.href, {
          signal: AbortSignal.timeout(15000),
          next: { revalidate: mediaArchiveRevalidateSeconds },
        });
        const html = await pageResponse.text();
        const widgetMatch = html.match(
          /<script type="application\/json" class="js-react-on-rails-component" data-component-name="MediaWidget" data-dom-id="MediaWidget-react-component-[^"]+">([^<]+)<\/script>/
        );
        const widgetProps = widgetMatch ? (JSON.parse(widgetMatch[1]) as { id?: string }) : {};
        const playerId = widgetProps.id;

        if (!playerId) {
          throw new Error("Missing media player id");
        }

        const response = await fetch(
          `http://mediaplayer.cloversites.com/players/${playerId}?draft=0&media_id=${mediaId}`,
          { signal: AbortSignal.timeout(15000), next: { revalidate: mediaArchiveRevalidateSeconds } }
        );
        const data = (await response.json()) as {
          media?: Array<{
            title?: string;
            date_string?: string | null;
            speaker?: string | null;
            series?: string | null;
            third_party_id?: string | number | null;
            download_url?: string | null;
            audio?: boolean;
            video?: boolean;
            thumbnails?: { large?: string | null };
          }>;
        };
        const media = data.media?.[0];
        const embedSrc = buildEmbedSrc(media?.third_party_id);

        return {
          label: media?.title || sermon.label,
          href: sermon.href,
          mediaId,
          embedSrc,
          audioUrl: media?.download_url || null,
          date: media?.date_string || null,
          speaker: media?.speaker || null,
          series: media?.series || null,
          thumbnail: media?.thumbnails?.large || null,
          kind: embedSrc ? "video" : "audio",
        };
      } catch {
        return {
          label: sermon.label,
          href: sermon.href,
          mediaId,
          embedSrc: null,
          audioUrl: null,
          kind: "audio",
        };
      }
    })
  );
}

export const metadata = {
  title: "Sermons",
  description: "Watch recent messages from Emmanuel Church, revisit past teaching, and find weekly sermon study guides.",
};

export default async function SermonsPage() {
  const teachingSeries = await loadTeachingSeries();
  const audioSermons = teachingSeries.filter((sermon) => sermon.kind !== "video" || !sermon.embedSrc);
  const mediaPages = await loadMediaArchivePages();

  return (
    <>
      <div className="sermons-static sermons-page">
        <section className="sermons-page__watch" aria-labelledby="sermons-title">
          <h1 id="sermons-title" className="sr-only">Sermons</h1>
          <SermonsIntroDrawer liveHref={site.onlineChurch} />
          <MediaArchiveBrowser pages={mediaPages} audioSermons={audioSermons} bibleAppHref={site.bibleApp} />
        </section>
      </div>
    </>
  );
}
