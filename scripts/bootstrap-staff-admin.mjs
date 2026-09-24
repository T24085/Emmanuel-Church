import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const projectId = "emmanuel-240d1";
const email = "christoffersent@gmail.com";
if (process.env.FIRESTORE_EMULATOR_HOST)
  throw new Error(
    "Remove FIRESTORE_EMULATOR_HOST before bootstrapping the real administrator.",
  );
initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore();
// Resolve an existing account through the trusted Admin SDK, never a client claim.
const account = await getAuth().getUserByEmail(email);
if (account.disabled) throw new Error("The administrator account is disabled.");
const reference = db.doc(`staffPortal/main/access/${email}`);
await db.runTransaction(async (transaction) => {
  const existing = await transaction.get(reference);
  if (existing.exists) {
    if (existing.data().role !== "admin" || existing.data().active !== true)
      throw new Error(
        "An access record already exists with different permissions. Review it in Firebase before changing it.",
      );
    if (existing.data().uid && existing.data().uid !== account.uid)
      throw new Error(
        "The approval belongs to a different account. Review it in Firebase.",
      );
    transaction.update(reference, {
      uid: account.uid,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "initial-setup",
    });
    console.log(
      "Administrator account approved without an email-verification link.",
    );
    return;
  }
  transaction.create(reference, {
    email,
    uid: account.uid,
    name: "Emmanuel Church",
    role: "admin",
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "initial-setup",
  });
  console.log(
    `Administrator access approved for ${email}. Sign in through /admin/; no email-verification link is required for this exact account. No password was created or stored by this script.`,
  );
});
