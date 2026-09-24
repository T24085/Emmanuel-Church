# Staff portal verification — September 24, 2026

## Passed locally

- All 25 Firestore emulator security tests pass. Coverage includes unapproved/unverified users, trusted UID-bound approval without email verification, mismatched UID rejection, prevention of self-approval, staff isolation, revocation, administrator-only changes, immutable replies, field validation, and unknown paths.
- Production build and export audit pass; 21 public route exports including `/admin/`. The page has noindex/nofollow metadata and no private records in its generated HTML.
- Production dependencies: `npm audit --omit=dev` reports zero vulnerabilities. Five moderate issues remain in development tooling; no forced downgrade was applied.
- Browser smoke test with isolated emulator accounts: administrator login, resource creation, staff login, staff resource visibility without editing controls, request submission, staff reply, administrator reply, status change, and staff visibility of the updated conversation. Administrator roster shows self-demotion/revocation controls disabled. No browser errors in the tested workflow.
- Desktop preview at the browser's approximately 1115px viewport. Responsive checks used the actual `/admin/` page in a temporary same-origin frame at 390px and 768px because the browser's viewport override did not take effect. Both phone and tablet checks show no horizontal document overflow; 1440px document-width check also passes. The temporary review page was removed afterward.
- Corrected duplicate mobile/tablet header clearance and made overview panels a single column on small screens. Keyboard activation of workspace navigation and visible focus outline confirmed. User-entered messages are rendered as plain text, and resource/reference links require HTTPS.

## Live activation

After explicit confirmation, the tested Firestore rules were published through the Firebase Console on September 24, 2026. The existing `christoffersent@gmail.com` Auth account was approved at `staffPortal/main/access/christoffersent@gmail.com`, with role `admin`, active `true`, and its exact Firebase Auth UID. Saved field values were checked in the Console. Its password and email-verification status were not changed. The placeholder email received no approval.

The `requests` composite index (`createdBy` ascending, `updatedAt` descending; collection scope) was submitted successfully and was still building at the last check. Both local browser tabs were signed out, so a live end-to-end login still requires the user to enter their existing password privately. Website changes have not been pushed or published.

Live verification/reset email delivery, authorized domains, index readiness, and real Drive sharing permissions still need checking. The 30-minute inactivity timer was code-reviewed, not tested with a 30-minute wait. No full screen-reader or real-device accessibility audit was performed.
