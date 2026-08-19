# Emmanuel Resource Sync

This project keeps the public archive pages for Sunday bulletins and weekly sermon study guides.

## Recurring workflow

The Codex automation checks both shared Google Drive folders each Monday morning:

- Bulletins
- Weekly Sermon Study Guides

The folder URLs are intentionally kept out of the public website. The person managing the files should have Editor access in Google Drive; website visitors only see the individual resources published in the archive.

## When new files are found

1. Compare the Drive folder contents with `src/data/bulletins.ts` and `src/data/study-guides.ts`.
2. Add each new file with its date, title, series or month, and individual Drive file URL.
3. Preserve the existing archive order and preview behavior.
4. Run the production check:

   ```powershell
   npm run build
   ```

5. Publish the updated site through the configured deployment workflow.

If no new files are found, do not change the archive.

## Moving to another computer

Clone or pull the repository, connect the Google Drive account that has access to the shared folders, install dependencies with `npm install`, and use the same sync instructions. Do not commit Google credentials or expose the shared folder URLs in public page content.
