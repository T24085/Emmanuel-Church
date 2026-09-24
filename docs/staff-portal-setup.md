# Staff portal: activation and operations

The portal is at `/admin/`, linked as **Staff Login** in the shared footer. The static website contains the interface, not private staff records. Firebase Authentication and Firestore rules enforce access. The public Firebase web configuration is not a server credential.

## Activate Firebase before inviting staff

1. Open [the Emmanuel Firebase project](https://console.firebase.google.com/project/emmanuel-240d1/overview). Under Authentication, enable **Email/Password**. Configure a password policy requiring at least 12 characters, an uppercase letter, a lowercase letter, and a number. Enable email-enumeration protection. Review verification and password-reset email templates.
2. In Authentication settings, authorize the actual website domains (including `t24085.github.io` for the existing GitHub Pages deployment and the final church domain). Add `localhost` and `127.0.0.1` only for local development. Domain entries do not include a scheme or path.
3. Create the default Cloud Firestore database in **production mode** if it does not already exist. Choose the church's appropriate region. Do not enable public/test-mode reads or writes.
4. Review the project's existing Firestore rules before deploying. This repository denies all paths except its staff portal namespace; if another application shares this database, merge its reviewed rules rather than replacing them blindly. From this repository, with an authorized Firebase account:

   ```sh
   npx firebase login
   npx firebase deploy --only firestore:rules,firestore:indexes --project emmanuel-240d1
   ```

5. First create the administrator's password account privately through `/admin/`. To approve that exact account without waiting for a verification email, copy its UID from Firebase Authentication (verify the email there) and use the Firebase Console's Firestore data editor to create `staffPortal/main/access/christoffersent@gmail.com` with these exact fields:

   | Field | Type | Value |
   | --- | --- | --- |
   | email | string | christoffersent@gmail.com |
   | uid | string | The exact User UID copied from Firebase Authentication |
   | name | string | Emmanuel Church |
   | role | string | admin |
   | active | boolean | true |
   | createdAt | timestamp | Current time |
   | updatedAt | timestamp | Current time |
   | updatedBy | string | initial-setup |

   Alternatively, `npm run staff:bootstrap` creates this record using trusted Application Default Credentials with Firestore access. Firebase CLI login alone does **not** supply those credentials. Never commit a service-account key or place one in `public/`; prefer the Console procedure if no trusted SDK environment is already configured. The script does not create a password or send email.

6. Sign in at `/admin/` using `christoffersent@gmail.com`. The trusted UID-bound approval above permits this exact account without an email-verification link. Email-only approvals still require verification. An unverified account cannot add its own UID to an approval; only a trusted administrator/project owner can grant this exception. The bootstrap script now requires the Auth account to exist and resolves its UID using the trusted Admin SDK.
7. Confirm the administrator can manage resources, read requests, publish the staff note, and approve staff. Confirm a verified but unapproved account cannot view any workspace data. Only then publish the frontend and invite staff.

## Daily use

- **Staff access:** An administrator approves an exact email, name, and role, then personally shares the login URL. This does not automatically email an invitation. Each staff member creates their own password and verifies their email. Do not share a common staff password.
- **Shared resources:** Administrators add HTTPS links, descriptions, and categories. Archive old links without erasing them. Google Drive sharing permissions still apply: grant folders to the intended staff accounts, not “anyone with the link.”
- **Requests:** Staff send website changes, announcements, links, and general messages. The sender and administrators can view the conversation. Administrators track New, In review, Waiting on staff, and Completed. Replies are immutable; staff cannot change status or another person's request. Replies and status changes appear in the portal, not by email notification.
- **Notice board:** Administrators publish one shared staff note on the overview.
- **Offboarding:** Disable the person's portal access and remove their Google Drive access. Portal administrators cannot disable or demote themselves; another administrator or the project owner must do that. Firebase project owners can recover access through the Console.
- **Shared computers:** Sign out when finished. Login persists for the current browser session, with automatic sign-out after 30 minutes of inactivity. Firestore uses an in-memory cache, not persistent offline storage. Previously displayed information cannot be remotely erased from a user's memory or screenshots.
- Keep sensitive counseling, financial, medical, and child records out of this general-purpose communications space. This is not a records-management system. No uploads, automatic email alerts, MFA, or server-side audit log are included in this first version. Monitor Firebase quotas and usage; consider App Check and stronger identity controls before expanding its scope.

## Local testing without touching real accounts

Requires Node.js and Java 21+ for the Firebase Emulator Suite. These commands use `demo-emmanuel-staff`, never the live project.

```sh
npm run test:staff-rules
npm run staff:emulators
```

In another PowerShell terminal:

```powershell
$env:FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080'
$env:FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
node scripts/seed-staff-emulator.mjs
$env:NEXT_PUBLIC_FIREBASE_EMULATORS = 'true'
npm run dev
```

Local-only accounts: `admin@example.test` and `staff@example.test`; password `LocalPreview2026!`. The portal displays a local-test banner. Demo data is not exported or persisted after emulator shutdown. Restart the dev server without `NEXT_PUBLIC_FIREBASE_EMULATORS=true` to reconnect to the real project. Production builds always use the real project regardless of this flag.

`npm run verify` runs the production build and export audit. CI also runs the permission tests. Tests cover unauthenticated, unverified, unapproved, disabled, staff, and administrator access; request ownership; role escalation; URL/field validation; and immutable replies.

## Security references

- [Firebase password authentication](https://firebase.google.com/docs/auth/web/password-auth)
- [Authentication and security rules](https://firebase.google.com/docs/rules/rules-and-auth)
- [Testing security rules](https://firebase.google.com/docs/rules/unit-tests)

Rules and indexes must be deployed separately from the GitHub Pages website. A successful website build alone does not activate Firebase permissions or create staff accounts.
