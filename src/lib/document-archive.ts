export type ArchiveIssue = {
  id: string;
  date: string;
  title: string;
  series?: string;
  sourceUrl: string;
  pdfPath: string;
  pageCount: number;
  pages: { width: number; height: number }[];
};

export type BookPage = { issue: ArchiveIssue; page: number } | null;

export function bookPages(issues: ArchiveIssue[]): BookPage[] {
  return [
    null,
    ...issues.flatMap((issue) =>
      issue.pages.map((_, index) => ({ issue, page: index + 1 })),
    ),
  ];
}

export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
