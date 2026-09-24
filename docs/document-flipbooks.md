# Bulletin and study-guide flipbooks

## What is implemented

The two existing public resource routes now use one magazine reader, with teal Emmanuel covers, complete newest-first PDF sequences, a month/date/title index, selectable-text reading mode, an expanded zoom dialog, keyboard controls and original-PDF links. Both archives use identical portrait book dimensions, including their loading covers, so switching resource tabs does not resize the book. Landscape and portrait PDFs fit inside without cropping. Screens below 900px show one page. Reduced-motion preference always selects the non-animated reading mode.

The source is limited to these folders (no recursion or shortcuts):

- Bulletins: `1znpOR_apstkTE7GuzBNXDkIMVgEs0Ot9`
- Guides: `1s3jWx5H5LHPDlPY2YjWqUbKL2s5DxnNS`

Initial import: **19 bulletins / 38 PDF pages; 32 guides / 49 PDF pages**. Existing date, title and series mappings remain authoritative for those file IDs. Original PDF ordering and artwork are unchanged, including the landscape bulletin's printing layout.

## Local development and verification

Node 22.13+ is required (CI uses Node 22).

1. `npm ci`
2. Set `DRIVE_ARCHIVE_API_KEY` in your shell using your private local environment. Never paste it into source or a `NEXT_PUBLIC_` variable. The sync script does not automatically load `.env` files.
3. `npm run sync:documents`
4. `npm run dev`
5. `npm run test:documents` and `npm run verify`

PDFs and PDF.js runtime assets are generated in ignored `public/documents` and `public/pdfjs` directories. A fresh checkout requires a sync before building. Missing assets deliberately fail the build, rather than publishing broken PDF links. The generated manifest is `src/data/document-archives.json`; the sync also saves a cache copy alongside the PDFs. No PDF binaries or API credentials belong in Git.

For this local preview, PDFs were downloaded through the authenticated Drive connector and imported with `node --experimental-strip-types scripts/sync-document-archives.mjs --from-cache`. That option reads the ignored `.cache/archive-source/inventory.json` and `<fileId>.pdf` files; it is not used by unattended CI.

PDF.js renders visible/nearby pages from same-origin, content-versioned URLs. Canvas surfaces unmount as pages leave the render window, and reference-counted document tasks are destroyed after release. The installer preparation script includes an exact-version StPageFlip 2.0.7 cleanup patch: upstream does not stop its RAF loop on destroy. Review that patch when upgrading the dependency.

## Staff upload instructions

- Upload only final, public PDFs to these folders.
- New bulletin: `2026-09-27 Bulletin.pdf`.
- New guide: `2026-09-27 Study Guide - Sermon Title.pdf`.
- The date is the issue date, not the upload time. Complete legacy-style guide dates such as `9.27.26_SDG_-_Title.pdf` are also supported.
- Do not create two files for the same issue date. Replace the existing file's content when correcting an issue, or remove the duplicate before syncing.
- Existing yearless bulletin filenames remain supported by their original file-ID mapping. Newly uploaded yearless files must be renamed with a full date.
- Invalid dates, duplicate dates, corrupt/encrypted/unreadable PDFs, files over 75 MB, and documents over 200 pages stop the sync with a correction message. Non-PDFs and shortcuts are ignored.
- The complete archive manifest changes only after both folder listings and every PDF validate. Confirmed removals disappear at the next successful sync. An empty/incomplete/failed listing cannot erase the working archive.

## Activation checklist

Activated September 24, 2026: the user confirmed Viewer link access and named staff editors; a dedicated Drive-only key was created and saved as `DRIVE_ARCHIVE_API_KEY`; GitHub Pages now uses Actions with `DOCUMENT_ARCHIVES_ENABLED=true`. The first authenticated API sync validated all 19 bulletins and 32 study guides. Deployment run 36046472884 succeeded, including 25 staff-rule tests, 14 archive tests, and the 21-route export audit. No PDF binaries or private keys were committed. The steps below are retained for recovery or a future environment.

1. Review both readers locally and authorize publishing.
2. Supply the staff editor email addresses. In Drive, grant those named staff Editor access, retain the owner, and change general link access from **Editor** to **Viewer** on both folders. Check for any separate file-level edit grants. Verify a staff upload and public read. Portal approval alone does not grant Google Drive rights.
3. Enable Google Drive API in the chosen Google Cloud project. Create a dedicated API key restricted to **Google Drive API** and store it as GitHub Actions secret `DRIVE_ARCHIVE_API_KEY` in `T24085/Emmanuel-Church`. It reads only public files and is never shipped in browser JavaScript. The workflow cannot use this chat's Drive connector session.
4. Commit/review the source changes, retaining unrelated uncommitted work separately as appropriate. Push only with the user's publishing authorization.
5. Run **Sync Archives and Publish Website** manually while `DOCUMENT_ARCHIVES_ENABLED` is absent/false. It should produce a validated Pages artifact without deploying it. Test the first real API sync and check workflow logs.
6. At the approved cutover, change GitHub Settings → Pages → Source to **GitHub Actions**, then set repository variable `DOCUMENT_ARCHIVES_ENABLED=true`. Run the unified workflow and verify both live routes and PDF URLs under `/Emmanuel-Church/`.

Drive sharing was changed by the user, not by the implementation. The Drive API key, GitHub secret, Pages source, and activation variable were configured later with the user's authorization during rollout. Firebase credentials were not changed.

## Scheduled operation and rollback

The unified workflow checks both document folders and refreshes sermon metadata together each Monday at 6:00 p.m. America/Chicago, matching the existing weekly rebuild schedule. GitHub may delay scheduled jobs. There is no separate two-hour polling schedule. Manual runs check both document folders and optionally refresh sermons with `refresh_sermons` selected; source-change deployments also sync documents before building. The old commit-and-export sermon workflow is gated off once the new pipeline is enabled, so it cannot overwrite the new deployment.

The public website links only to its synchronized PDF copies, not to the shared Drive folders. Removing website links does not restrict Drive access. The current sync implementation requires public-viewable source PDFs plus a Drive API key; genuinely private folders require an authenticated read-only sync identity instead. Resolve that access choice before activation; do not switch private folders to public merely to enable the workflow.

Every deployment uses the complete `out` artifact after PDF validation, unit tests, production build, and export audit. A failed step cannot reach deployment; the previously deployed site stays live. Assets are cached outside Git and changed files receive new URLs. The cache is an optimization, not a source of truth; Drive is re-listed every run.

Monitor **Actions → Sync Archives and Publish Website**. Failures show the affected issue/date; the summary reports successful counts. Use manual workflow dispatch for urgent updates.

To stop automatic publishing, set `DOCUMENT_ARCHIVES_ENABLED=false` and disable the old refresh workflow too (it is a legacy fallback while the variable is false). Existing deployed pages remain available. To revert a release, redeploy a previously validated Pages artifact with repository-owner approval; do not delete or rewrite the original Drive PDFs. Retained PDFs downloaded by visitors cannot be recalled.

## Review record

- All 51 source PDFs parsed, including every page's drawing operations.
- 14 archive tests pass: mapping, date validation, newest-first order, pagination, duplicate/empty rejection, invalid access responses, corrupt PDFs, replacements/removals and complete page sequences.
- Production build and static export audit pass (21 routes).
- Browser checked: cover rendering, landscape bulletin spread, portrait guide spread, 390px one-page layout, 768px tablet, 1115px desktop, 1440px desktop, date search, date jump, keyboard turning, URL reload, selectable PDF text, zoom dialog and Escape.
- Reduced-motion routing is implemented via `matchMedia`; manual reading mode exercises the same non-animated renderer. OS-level reduced-motion emulation and real-device touch/safe-area behavior still merit a device check before publishing.
- Drive API sync, named staff sharing confirmation, Actions Pages cutover, and deployment completed September 24, 2026. The live bulletin reader renders its website-hosted PDFs correctly. Staff sign-in still requires the user to enter their own password; no live password was collected or changed.
