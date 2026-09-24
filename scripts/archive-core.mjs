import { createHash } from "node:crypto";

export const folders = {
  bulletins: "1znpOR_apstkTE7GuzBNXDkIMVgEs0Ot9",
  guides: "1s3jWx5H5LHPDlPY2YjWqUbKL2s5DxnNS",
};

export function fileId(href) {
  return href.match(/\/d\/([\w-]+)/)?.[1];
}

export function validDate(value) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number(value.slice(0, 4)) >= 1900 &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}

export function describeFile(file, kind, legacy) {
  if (!/^[\w-]+$/.test(file.id)) throw new Error("Invalid Drive file ID");
  const known = legacy.find((item) => fileId(item.href) === file.id);
  const match = file.name.match(/^(\d{4}-\d{2}-\d{2})(?:[ _-]|\.)/);
  const oldStyle = file.name.match(
    /^(\d{1,2})[.](\d{1,2})[.](\d{2}|\d{4})[ _-]/,
  );
  const date =
    known?.date ||
    match?.[1] ||
    (oldStyle
      ? `${oldStyle[3].length === 2 ? "20" : ""}${oldStyle[3]}-${oldStyle[1].padStart(2, "0")}-${oldStyle[2].padStart(2, "0")}`
      : "");
  if (!validDate(date))
    throw new Error(
      `Date required: ${file.name}. Use YYYY-MM-DD in the filename.`,
    );
  const title =
    known?.title ||
    (kind === "bulletins"
      ? "Sunday Bulletin"
      : file.name
          .replace(/\.pdf$/i, "")
          .replace(/^(?:\d{4}-\d{2}-\d{2}|\d{1,2}\.\d{1,2}\.\d{2,4})[ _-]*/, "")
          .replace(/^(?:Study Guide|SDG)[ _-]*/i, "")
          .replaceAll("_", " ")
          .trim() || "Weekly Sermon Study Guide");
  return {
    id: file.id,
    date,
    title,
    ...(known?.series ? { series: known.series } : {}),
    sourceUrl: `https://drive.google.com/file/d/${file.id}/view`,
    sourceName: file.name,
  };
}

export function describeArchive(files, kind, legacy) {
  const issues = files
    .filter((file) => file.mimeType === "application/pdf" && !file.trashed)
    .map((file) => ({ ...describeFile(file, kind, legacy), source: file }));
  const dates = new Set();
  for (const issue of issues) {
    if (dates.has(issue.date))
      throw new Error(
        `Duplicate ${kind} issue date: ${issue.date}. Resolve the duplicate in Drive.`,
      );
    dates.add(issue.date);
  }
  if (!issues.length)
    throw new Error(
      `No dated PDFs found in ${kind}; refusing to replace a working archive with an empty one.`,
    );
  return issues.sort((a, b) => b.date.localeCompare(a.date));
}

export function pdfHash(bytes) {
  if (!Buffer.from(bytes).subarray(0, 1024).includes(Buffer.from("%PDF-")))
    throw new Error("Response is not a PDF");
  return createHash("sha256").update(bytes).digest("hex").slice(0, 20);
}

export async function listFolder(id, key, request = fetch) {
  const files = [];
  let token;
  do {
    const query = new URLSearchParams({
      key,
      q: `'${id}' in parents and trashed = false`,
      fields:
        "nextPageToken,incompleteSearch,files(id,name,mimeType,modifiedTime,md5Checksum,size)",
      pageSize: "1000",
    });
    if (token) query.set("pageToken", token);
    const response = await request(
      `https://www.googleapis.com/drive/v3/files?${query}`,
    );
    if (!response.ok)
      throw new Error(
        `Drive folder lookup failed (${response.status}). Check Drive API access and folder sharing.`,
      );
    const result = await response.json();
    if (result.incompleteSearch || !Array.isArray(result.files))
      throw new Error(
        "Incomplete Drive listing; keeping the previous archive.",
      );
    files.push(...result.files);
    token = result.nextPageToken;
  } while (token);
  return files;
}
