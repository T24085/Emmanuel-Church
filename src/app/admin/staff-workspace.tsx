"use client";

import { useEffect, useState, type FormEvent } from "react";
import { signOut, type User } from "firebase/auth";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getStaffFirebase, portalPath } from "@/lib/staff-firebase";
import {
  staffDate,
  staffError,
  type StaffAccess,
  type StaffNotice,
  type StaffRequest,
  type StaffResource,
} from "@/lib/staff-portal";
import { StaffResources } from "./staff-resources";
import { StaffRequests } from "./staff-requests";
import { StaffAccessManager } from "./staff-access";

type View = "Overview" | "Shared resources" | "Requests" | "Staff access";

export function StaffWorkspace({
  user,
  access,
}: {
  user: User;
  access: StaffAccess;
}) {
  const [view, setView] = useState<View>("Overview");
  const [resources, setResources] = useState<StaffResource[]>([]);
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [notice, setNotice] = useState<StaffNotice | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [limitCount, setLimitCount] = useState(50);
  const [selected, setSelected] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signingOut, setSigningOut] = useState(false);
  const admin = access.role === "admin";
  const { db, auth, emulated } = getStaffFirebase();

  useEffect(() => {
    const stopResources = onSnapshot(
      query(collection(db, `${portalPath}/resources`), orderBy("title")),
      (snapshot) => {
        setResources(
          snapshot.docs.map(
            (item) => ({ ...item.data(), id: item.id }) as StaffResource,
          ),
        );
        setErrors((current) => ({ ...current, resources: "" }));
      },
      (cause) => {
        setResources([]);
        setErrors((current) => ({ ...current, resources: staffError(cause) }));
      },
    );
    const stopNotice = onSnapshot(
      doc(db, `${portalPath}/settings/notice`),
      (snapshot) => {
        setNotice(snapshot.exists() ? (snapshot.data() as StaffNotice) : null);
        setErrors((current) => ({ ...current, notice: "" }));
      },
      (cause) => {
        setNotice(null);
        setErrors((current) => ({ ...current, notice: staffError(cause) }));
      },
    );
    return () => {
      stopResources();
      stopNotice();
    };
  }, [db]);

  useEffect(() => {
    setLoaded(false);
    const reference = collection(db, `${portalPath}/requests`);
    const requestQuery = admin
      ? query(reference, orderBy("updatedAt", "desc"), limit(limitCount))
      : query(
          reference,
          where("createdBy", "==", user.uid),
          orderBy("updatedAt", "desc"),
          limit(limitCount),
        );
    return onSnapshot(
      requestQuery,
      (snapshot) => {
        setRequests(
          snapshot.docs.map(
            (item) => ({ ...item.data(), id: item.id }) as StaffRequest,
          ),
        );
        setLoaded(true);
        setErrors((current) => ({ ...current, requests: "" }));
      },
      (cause) => {
        setRequests([]);
        setLoaded(true);
        setErrors((current) => ({ ...current, requests: staffError(cause) }));
      },
    );
  }, [admin, db, user.uid, limitCount]);

  function openRequest(id: string) {
    setSelected(id);
    setView("Requests");
  }
  async function logout() {
    setSigningOut(true);
    try {
      await signOut(auth);
    } catch (cause) {
      setErrors((current) => ({ ...current, signout: staffError(cause) }));
      setSigningOut(false);
    }
  }

  return (
    <div className="staff-portal staff-workspace">
      {emulated && (
        <p className="staff-test-banner">
          Local test workspace · Sample accounts and data
        </p>
      )}
      <header className="staff-workspace__header">
        <div>
          <p className="staff-kicker">
            Emmanuel Church · {admin ? "Administration" : "Staff"}
          </p>
          <h1>
            A Little More <em>Together.</em>
          </h1>
          <p>
            Welcome, {access.name}. Here’s a place for the work behind Sunday.
          </p>
        </div>
        <div className="staff-identity">
          <span>{access.email}</span>
          <b>{admin ? "Administrator" : "Staff member"}</b>
          <button
            className="staff-text-button"
            disabled={signingOut}
            onClick={() => void logout()}
          >
            {signingOut ? "Signing out…" : "Sign out ↗"}
          </button>
        </div>
      </header>
      <div className="staff-workspace__body">
        <nav className="staff-nav" aria-label="Staff workspace">
          {(
            [
              "Overview",
              "Shared resources",
              "Requests",
              ...(admin ? ["Staff access"] : []),
            ] as View[]
          ).map((item) => (
            <button
              key={item}
              aria-current={view === item ? "page" : undefined}
              onClick={() => {
                setView(item);
                setSelected(null);
              }}
            >
              {item}
              {item === "Requests" && (
                <span>
                  {loaded
                    ? requests.filter(
                        (request) => request.status !== "Completed",
                      ).length
                    : "…"}
                </span>
              )}
            </button>
          ))}
        </nav>
        {Object.values(errors).filter(Boolean).length > 0 && (
          <div className="staff-alert staff-alert--error" role="alert">
            {[...new Set(Object.values(errors).filter(Boolean))].join(" ")}
          </div>
        )}
        {view === "Overview" && (
          <>
            <div className="staff-section-heading">
              <div>
                <p className="staff-kicker">Your workspace</p>
                <h2>Good Work Starts Here.</h2>
              </div>
              <button
                className="staff-button"
                onClick={() => {
                  setView("Requests");
                  setSelected("new");
                }}
              >
                Send a request <span aria-hidden="true">↗</span>
              </button>
            </div>
            <div className="staff-overview-grid">
              <button
                className="staff-overview-card"
                onClick={() => setView("Shared resources")}
              >
                <span className="staff-kicker">At your fingertips</span>
                <strong>
                  {resources
                    .filter((item) => !item.archived)
                    .length.toString()
                    .padStart(2, "0")}
                </strong>
                <h3>Shared Resources</h3>
                <p>Folders, documents, and useful links for your ministry.</p>
                <span className="staff-card-link">Browse resources ↗</span>
              </button>
              <button
                className="staff-overview-card"
                onClick={() => setView("Requests")}
              >
                <span className="staff-kicker">Keep things moving</span>
                <strong>
                  {loaded
                    ? requests
                        .filter((item) => item.status !== "Completed")
                        .length.toString()
                        .padStart(2, "0")
                    : "—"}
                </strong>
                <h3>{admin ? "Open Conversations" : "Your Requests"}</h3>
                <p>
                  {admin
                    ? "Review staff updates, reply, and keep track of progress."
                    : "Follow your ideas from the first message to the finished update."}
                </p>
                <span className="staff-card-link">
                  Open {admin ? "inbox" : "requests"} ↗
                </span>
              </button>
              <aside className="staff-notice">
                <p className="staff-kicker">The staff board</p>
                <h3>{notice?.title || "Room for a Note."}</h3>
                <p>
                  {notice?.body ||
                    "Team reminders and useful updates from your website administrator will appear here."}
                </p>
                {notice?.updatedAt && (
                  <span className="staff-help">
                    Updated {staffDate(notice.updatedAt)}
                  </span>
                )}
              </aside>
            </div>
            {admin && (
              <NoticeEditor
                key={`${notice?.title}:${notice?.body}`}
                user={user}
                notice={notice}
              />
            )}
            <div className="staff-section-heading staff-section-heading--small">
              <h2>Recent Conversations</h2>
              <span className="staff-help">
                {admin
                  ? "Staff requests are visible to administrators."
                  : "Only you and administrators can read your requests."}
              </span>
            </div>
            {!loaded ? (
              <p role="status">Loading conversations…</p>
            ) : requests.length === 0 ? (
              <div className="staff-empty">
                <h3>A Fresh Page.</h3>
                <p>
                  Have a website update, a question, or an idea? Send your first
                  request above.
                </p>
              </div>
            ) : (
              <div className="staff-recent-list">
                {requests.slice(0, 5).map((item) => (
                  <button key={item.id} onClick={() => openRequest(item.id)}>
                    <div>
                      <span className="staff-kicker">
                        {item.category} · {staffDate(item.updatedAt)}
                      </span>
                      <h3>{item.title}</h3>
                      <p>{admin ? item.authorName : "Your conversation"}</p>
                    </div>
                    <span
                      className={`staff-status staff-status--${item.status.toLowerCase().replace(/ /g, "-")}`}
                    >
                      {item.status}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            )}
            {requests.length >= limitCount && (
              <p className="staff-help">
                Counts reflect the {requests.length} most recently updated
                conversations. Load older requests in the Requests tab.
              </p>
            )}
          </>
        )}
        {view === "Shared resources" && (
          <StaffResources user={user} admin={admin} resources={resources} />
        )}
        {view === "Requests" && (
          <StaffRequests
            user={user}
            access={access}
            requests={requests}
            loaded={loaded}
            selected={selected}
            onSelect={setSelected}
            onLoadMore={() => setLimitCount((count) => count + 50)}
            hasMore={requests.length >= limitCount}
          />
        )}
        {view === "Staff access" && admin && <StaffAccessManager user={user} />}
      </div>
      <div className="staff-workspace__note">
        For church work and website updates. Please keep confidential pastoral,
        financial, and personal records in the church’s designated systems.
      </div>
    </div>
  );
}

function NoticeEditor({
  user,
  notice,
}: {
  user: User;
  notice: StaffNotice | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      await setDoc(
        doc(getStaffFirebase().db, `${portalPath}/settings/notice`),
        {
          title: String(data.get("title")).trim(),
          body: String(data.get("body")).trim(),
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
        },
      );
      setSaved(true);
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className="staff-editor">
      <summary>Edit the staff board</summary>
      <form className="staff-form" onSubmit={save}>
        <label>
          Note title
          <input
            name="title"
            maxLength={120}
            defaultValue={notice?.title || ""}
          />
        </label>
        <label>
          Message for all staff
          <textarea
            name="body"
            rows={3}
            maxLength={2000}
            defaultValue={notice?.body || ""}
          />
        </label>
        <p className="staff-help">
          Leave both fields blank to clear the board.
        </p>
        <button className="staff-button" disabled={busy}>
          {busy ? "Saving…" : "Save staff note"}
        </button>
        {error && (
          <p role="alert" className="staff-alert staff-alert--error">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="staff-alert">
            Staff note saved.
          </p>
        )}
      </form>
    </details>
  );
}
