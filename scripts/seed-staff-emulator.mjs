import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

if (
  process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080" ||
  process.env.FIREBASE_AUTH_EMULATOR_HOST !== "127.0.0.1:9099"
)
  throw new Error("This script only runs against the local demo emulators.");
initializeApp({ projectId: "demo-emmanuel-staff" });
const auth = getAuth();
const db = getFirestore();
for (const [uid, email, name, role] of [
  ["demo-admin", "admin@example.test", "Demo Administrator", "admin"],
  ["demo-staff", "staff@example.test", "Demo Staff Member", "staff"],
]) {
  try {
    await auth.getUser(uid);
  } catch {
    await auth.createUser({
      uid,
      email,
      password: "LocalPreview2026!",
      emailVerified: true,
    });
  }
  await db
    .doc(`staffPortal/main/access/${email}`)
    .set({
      email,
      name,
      role,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "demo-admin",
    });
}
await db
  .doc("staffPortal/main/settings/notice")
  .set({
    title: "Welcome to the Workspace.",
    body: "This is a local preview. Try adding a resource or sending a website request. No real staff data is connected.",
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "demo-admin",
  });
console.log(
  "Local demo ready. Accounts: admin@example.test and staff@example.test. Password: LocalPreview2026!",
);
