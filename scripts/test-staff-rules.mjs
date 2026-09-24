import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

const projectId = "demo-emmanuel-staff";
const root = "staffPortal/main";
let env;
const dbFor = (uid, email, verified = true) =>
  env
    .authenticatedContext(uid, { email, email_verified: verified })
    .firestore();
const admin = () => dbFor("admin", "admin@example.test");
const staff = () => dbFor("alice", "alice@example.test");
const other = () => dbFor("bob", "bob@example.test");
const resource = () => ({
  title: "Service planning",
  description: "Shared folder",
  url: "https://drive.google.com/drive/folders/example",
  category: "Shared folders",
  archived: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  updatedBy: "admin",
});
const request = () => ({
  title: "Sunday announcement",
  body: "Please add the event.",
  category: "Website update",
  status: "New",
  referenceUrl: "",
  neededBy: "",
  createdBy: "alice",
  authorEmail: "alice@example.test",
  authorName: "Alice",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
const message = () => ({
  body: "Here is more information.",
  authorId: "alice",
  authorName: "Alice",
  createdAt: serverTimestamp(),
});

before(async () => {
  env = await initializeTestEnvironment({
    projectId,
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile(
        new URL("../firestore.rules", import.meta.url),
        "utf8",
      ),
    },
  });
});
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    for (const [email, name, role] of [
      ["admin@example.test", "Administrator", "admin"],
      ["alice@example.test", "Alice", "staff"],
      ["bob@example.test", "Bob", "staff"],
    ]) {
      await setDoc(doc(db, `${root}/access/${email}`), {
        email,
        name,
        role,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: "admin",
      });
    }
    await setDoc(doc(db, `${root}/resources/example`), resource());
    await setDoc(doc(db, `${root}/requests/alice-request`), request());
    await setDoc(
      doc(db, `${root}/requests/alice-request/messages/example`),
      message(),
    );
  });
});
after(async () => {
  await env?.cleanup();
});

test("signed-out visitors cannot read resources, requests, messages, or staff records", async () => {
  const db = env.unauthenticatedContext().firestore();
  for (const path of [
    "resources/example",
    "requests/alice-request",
    "requests/alice-request/messages/example",
    "access/alice@example.test",
  ])
    await assertFails(getDoc(doc(db, `${root}/${path}`)));
});
test("an approved email without verification cannot access staff data", async () => {
  await assertFails(
    getDoc(
      doc(
        dbFor("alice", "alice@example.test", false),
        `${root}/resources/example`,
      ),
    ),
  );
});
test("a verified but unapproved account cannot read shared resources", async () => {
  await assertFails(
    getDoc(
      doc(
        dbFor("stranger", "stranger@example.test"),
        `${root}/resources/example`,
      ),
    ),
  );
});
test("a trusted UID-bound approval allows an unverified account, but not a different UID", async () => {
  await env.withSecurityRulesDisabled(async (context) => {
    await updateDoc(
      doc(context.firestore(), `${root}/access/alice@example.test`),
      { uid: "alice" },
    );
  });
  await assertSucceeds(
    getDoc(
      doc(
        dbFor("alice", "alice@example.test", false),
        `${root}/resources/example`,
      ),
    ),
  );
  await assertFails(
    getDoc(
      doc(
        dbFor("imposter", "alice@example.test", false),
        `${root}/resources/example`,
      ),
    ),
  );
});
test("an unverified account cannot approve its own UID", async () => {
  const db = dbFor("alice", "alice@example.test", false);
  await assertSucceeds(getDoc(doc(db, `${root}/access/alice@example.test`)));
  await assertFails(
    updateDoc(doc(db, `${root}/access/alice@example.test`), {
      uid: "alice",
      updatedAt: serverTimestamp(),
      updatedBy: "alice",
    }),
  );
});
test("disabling a UID-bound approval blocks the unverified account", async () => {
  await env.withSecurityRulesDisabled(async (context) => {
    await updateDoc(
      doc(context.firestore(), `${root}/access/alice@example.test`),
      { uid: "alice", active: false },
    );
  });
  await assertFails(
    getDoc(
      doc(
        dbFor("alice", "alice@example.test", false),
        `${root}/resources/example`,
      ),
    ),
  );
});
test("approved staff can read shared resources and their own access record", async () => {
  await assertSucceeds(getDocs(collection(staff(), `${root}/resources`)));
  await assertSucceeds(
    getDoc(doc(staff(), `${root}/access/alice@example.test`)),
  );
});
test("staff cannot list the staff roster or read another membership", async () => {
  await assertFails(getDocs(collection(staff(), `${root}/access`)));
  await assertFails(getDoc(doc(staff(), `${root}/access/bob@example.test`)));
});
test("staff cannot promote themselves or grant another account access", async () => {
  await assertFails(
    updateDoc(doc(staff(), `${root}/access/alice@example.test`), {
      role: "admin",
      updatedAt: serverTimestamp(),
      updatedBy: "alice",
    }),
  );
  await assertFails(
    setDoc(doc(staff(), `${root}/access/outsider@example.test`), {
      email: "outsider@example.test",
      name: "Outsider",
      role: "admin",
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: "alice",
    }),
  );
});
test("administrators can approve staff and list the roster", async () => {
  await assertSucceeds(
    setDoc(doc(admin(), `${root}/access/new@example.test`), {
      email: "new@example.test",
      name: "New staff",
      role: "staff",
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: "admin",
    }),
  );
  await assertSucceeds(getDocs(collection(admin(), `${root}/access`)));
});
test("administrators cannot disable or demote themselves", async () => {
  await assertFails(
    updateDoc(doc(admin(), `${root}/access/admin@example.test`), {
      active: false,
      updatedAt: serverTimestamp(),
      updatedBy: "admin",
    }),
  );
  await assertFails(
    updateDoc(doc(admin(), `${root}/access/admin@example.test`), {
      role: "staff",
      updatedAt: serverTimestamp(),
      updatedBy: "admin",
    }),
  );
});
test("revoking staff access blocks subsequent reads and writes", async () => {
  await assertSucceeds(
    updateDoc(doc(admin(), `${root}/access/alice@example.test`), {
      active: false,
      updatedAt: serverTimestamp(),
      updatedBy: "admin",
    }),
  );
  await assertFails(getDoc(doc(staff(), `${root}/resources/example`)));
  await assertFails(setDoc(doc(staff(), `${root}/requests/new`), request()));
});
test("only administrators can create, edit, or archive shared resources", async () => {
  await assertFails(setDoc(doc(staff(), `${root}/resources/new`), resource()));
  await assertFails(
    updateDoc(doc(staff(), `${root}/resources/example`), {
      archived: true,
      updatedAt: serverTimestamp(),
      updatedBy: "alice",
    }),
  );
  await assertSucceeds(
    setDoc(doc(admin(), `${root}/resources/new`), resource()),
  );
  await assertSucceeds(
    updateDoc(doc(admin(), `${root}/resources/example`), {
      archived: true,
      updatedAt: serverTimestamp(),
      updatedBy: "admin",
    }),
  );
});
test("resource validation rejects unsafe URLs and unexpected fields", async () => {
  for (const url of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:password@example.com",
    "https://example.com/with space",
  ])
    await assertFails(
      setDoc(doc(admin(), `${root}/resources/invalid`), { ...resource(), url }),
    );
  await assertFails(
    setDoc(doc(admin(), `${root}/resources/invalid`), {
      ...resource(),
      arbitraryRole: "admin",
    }),
  );
});
test("staff can submit and query their own requests", async () => {
  await assertSucceeds(setDoc(doc(staff(), `${root}/requests/new`), request()));
  await assertSucceeds(
    getDocs(
      query(
        collection(staff(), `${root}/requests`),
        where("createdBy", "==", "alice"),
      ),
    ),
  );
});
test("staff cannot read another person’s requests or their replies", async () => {
  await assertFails(getDoc(doc(other(), `${root}/requests/alice-request`)));
  await assertFails(
    getDocs(collection(other(), `${root}/requests/alice-request/messages`)),
  );
  await assertFails(getDocs(collection(staff(), `${root}/requests`)));
});
test("administrators can read all requests and private reply threads", async () => {
  await assertSucceeds(getDocs(collection(admin(), `${root}/requests`)));
  await assertSucceeds(
    getDocs(collection(admin(), `${root}/requests/alice-request/messages`)),
  );
});
test("request creation cannot forge the sender, name, status, timestamp, or hidden fields", async () => {
  for (const patch of [
    { createdBy: "bob" },
    { authorEmail: "admin@example.test" },
    { authorName: "Administrator" },
    { status: "Completed" },
    { body: "" },
    { body: "a".repeat(5001) },
    { secret: true },
    { createdAt: new Date(2000, 0, 1) },
  ])
    await assertFails(
      setDoc(doc(staff(), `${root}/requests/invalid`), {
        ...request(),
        ...patch,
      }),
    );
});
test("staff cannot change status or rewrite the original message", async () => {
  await assertFails(
    updateDoc(doc(staff(), `${root}/requests/alice-request`), {
      status: "Completed",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    updateDoc(doc(staff(), `${root}/requests/alice-request`), {
      body: "Rewritten",
      updatedAt: serverTimestamp(),
    }),
  );
});
test("administrators can update status but cannot change ownership", async () => {
  await assertSucceeds(
    updateDoc(doc(admin(), `${root}/requests/alice-request`), {
      status: "In review",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    updateDoc(doc(admin(), `${root}/requests/alice-request`), {
      createdBy: "bob",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    updateDoc(doc(admin(), `${root}/requests/alice-request`), {
      status: "Invalid",
      updatedAt: serverTimestamp(),
    }),
  );
});
test("an owner can atomically reply and move the conversation to the top of the inbox", async () => {
  const db = staff();
  const batch = writeBatch(db);
  batch.set(doc(db, `${root}/requests/alice-request/messages/new`), message());
  batch.update(doc(db, `${root}/requests/alice-request`), {
    updatedAt: serverTimestamp(),
  });
  await assertSucceeds(batch.commit());
});
test("administrators can reply and staff cannot impersonate them", async () => {
  await assertSucceeds(
    setDoc(doc(admin(), `${root}/requests/alice-request/messages/admin`), {
      ...message(),
      authorId: "admin",
      authorName: "Administrator",
    }),
  );
  await assertFails(
    setDoc(doc(staff(), `${root}/requests/alice-request/messages/forged`), {
      ...message(),
      authorName: "Administrator",
    }),
  );
  await assertFails(
    setDoc(doc(other(), `${root}/requests/alice-request/messages/intrusion`), {
      ...message(),
      authorId: "bob",
      authorName: "Bob",
    }),
  );
});
test("replies cannot be edited, erased, or attached to a nonexistent conversation", async () => {
  await assertFails(
    updateDoc(doc(staff(), `${root}/requests/alice-request/messages/example`), {
      body: "Changed",
    }),
  );
  await assertFails(
    deleteDoc(doc(admin(), `${root}/requests/alice-request/messages/example`)),
  );
  await assertFails(
    setDoc(doc(admin(), `${root}/requests/missing/messages/example`), {
      ...message(),
      authorId: "admin",
      authorName: "Administrator",
    }),
  );
});
test("only administrators can publish a staff note", async () => {
  const note = {
    title: "This week",
    body: "Planning reminder",
    updatedAt: serverTimestamp(),
    updatedBy: "admin",
  };
  await assertSucceeds(setDoc(doc(admin(), `${root}/settings/notice`), note));
  await assertSucceeds(getDoc(doc(staff(), `${root}/settings/notice`)));
  await assertFails(
    setDoc(doc(staff(), `${root}/settings/notice`), {
      ...note,
      updatedBy: "alice",
    }),
  );
});
test("unknown collection paths stay closed even to portal administrators", async () => {
  await assertFails(setDoc(doc(admin(), "unrelated/private"), { data: true }));
});
