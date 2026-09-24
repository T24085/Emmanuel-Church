import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  describeFile,
  describeArchive,
  listFolder,
  pdfHash,
  validDate,
  folders,
} from "./archive-core.mjs";
import { bookPages } from "../src/lib/document-archive.ts";
import { bulletins } from "../src/data/bulletins.ts";
import { studyGuides } from "../src/data/study-guides.ts";

const file = (id, name, other = {}) => ({
  id,
  name,
  mimeType: "application/pdf",
  ...other,
});
test("only the two designated folder IDs are configured", () =>
  assert.deepEqual(Object.keys(folders), ["bulletins", "guides"]));
test("new PDF dates come from the filename, never upload metadata", () => {
  const result = describeFile(
    file("new", "2026-09-20 Bulletin.pdf", { modifiedTime: "2030-12-12" }),
    "bulletins",
    [],
  );
  assert.equal(result.date, "2026-09-20");
});
test("missing years and invalid dates are flagged", () => {
  for (const name of [
    "BULLETIN_9-20.pdf",
    "2026-02-30 Bulletin.pdf",
    "notes.pdf",
  ])
    assert.throws(
      () => describeFile(file("new", name), "bulletins", []),
      /Date required/,
    );
  assert.equal(validDate("2028-02-29"), true);
});
test("existing filename without year retains authoritative date", () => {
  const result = describeFile(
    file("1p3OznKsmKZWewZF7lhODN0rmR7ZriS57", "BULLETIN_8-09.pdf"),
    "bulletins",
    bulletins,
  );
  assert.equal(result.date, "2026-08-09");
});
test("legacy study titles and series are preserved", () => {
  const result = describeFile(
    file("1zAY7UqI0zTF2JZFm8l-m1zC_IClGIGPm", "8.2.26_SDG.pdf"),
    "guides",
    studyGuides,
  );
  assert.equal(result.title, "You've Got a Friend in Me · Toy Box");
  assert.equal(result.series, "You've Got a Friend in Me");
});
test("new guides accept complete dated titles", () => {
  assert.equal(
    describeFile(file("new", "2026-09-20 Study Guide - Hope.pdf"), "guides", [])
      .title,
    "Hope",
  );
  assert.equal(
    describeFile(file("new", "9.20.26_SDG_-_Hope.pdf"), "guides", []).date,
    "2026-09-20",
  );
});
test("newest first, ignoring shortcuts, folders, non-PDFs and trash", () => {
  const result = describeArchive(
    [
      file("a", "2026-01-01 Bulletin.pdf"),
      file("b", "2026-09-20 Bulletin.pdf"),
      file("c", "foo", { mimeType: "application/vnd.google-apps.shortcut" }),
      file("d", "2026-01-02 Bulletin.pdf", { trashed: true }),
    ],
    "bulletins",
    [],
  );
  assert.deepEqual(
    result.map((x) => x.id),
    ["b", "a"],
  );
});
test("duplicates and empty listings cannot overwrite a working archive", () => {
  assert.throws(
    () =>
      describeArchive(
        [
          file("a", "2026-01-01 Bulletin.pdf"),
          file("b", "2026-01-01 Bulletin.pdf"),
        ],
        "bulletins",
        [],
      ),
    /Duplicate/,
  );
  assert.throws(() => describeArchive([], "bulletins", []), /empty/);
});
test("replacements change content URL and removals leave the next manifest", () => {
  assert.notEqual(
    pdfHash(Buffer.from("%PDF-1.7 first")),
    pdfHash(Buffer.from("%PDF-1.7 second")),
  );
  const next = describeArchive(
    [file("b", "2026-09-20 Bulletin.pdf")],
    "bulletins",
    [],
  );
  assert.equal(
    next.some((x) => x.id === "a"),
    false,
  );
});
test("HTML access-denied responses are not accepted as PDFs", () =>
  assert.throws(
    () => pdfHash(Buffer.from("<html>Sign in</html>")),
    /not a PDF/,
  ));
test("damaged PDF with plausible signature fails PDF parsing", async () => {
  const task = getDocument({
    data: new TextEncoder().encode("%PDF-1.7 broken"),
  });
  await assert.rejects(task.promise);
  await task.destroy();
});
test("folder listing exhausts pagination and never follows other folders", async () => {
  const urls = [];
  const result = await listFolder(
    folders.bulletins,
    "test-key",
    async (url) => {
      urls.push(new URL(url));
      return {
        ok: true,
        json: async () =>
          urls.length === 1
            ? { files: [file("a", "a")], nextPageToken: "next" }
            : { files: [file("b", "b")] },
      };
    },
  );
  assert.equal(result.length, 2);
  assert.equal(urls[1].searchParams.get("pageToken"), "next");
  assert.ok(
    urls.every((url) => url.searchParams.get("q").includes(folders.bulletins)),
  );
});
test("permission failures and incomplete searches block publication", async () => {
  await assert.rejects(
    listFolder("folder", "test", async () => ({ ok: false, status: 403 })),
    /403/,
  );
  await assert.rejects(
    listFolder("folder", "test", async () => ({
      ok: true,
      json: async () => ({ files: [], incompleteSearch: true }),
    })),
    /Incomplete/,
  );
});
test("generated books contain cover plus every page in issue order", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../src/data/document-archives.json", import.meta.url),
      "utf8",
    ),
  );
  for (const kind of Object.keys(folders)) {
    const issues = manifest[kind];
    const pages = bookPages(issues);
    assert.equal(pages[0], null);
    assert.equal(
      pages.length,
      1 + issues.reduce((sum, issue) => sum + issue.pageCount, 0),
    );
    let position = 1;
    for (const issue of issues)
      for (let page = 1; page <= issue.pageCount; page++) {
        assert.equal(pages[position].issue.id, issue.id);
        assert.equal(pages[position++].page, page);
      }
    assert.deepEqual(
      issues.map((x) => x.date),
      issues
        .map((x) => x.date)
        .sort()
        .reverse(),
    );
    assert.ok(
      issues.every((issue) =>
        issue.pages.every((page) => page.width > 0 && page.height > 0),
      ),
    );
  }
});
