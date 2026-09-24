"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getStaffFirebase, portalPath } from "@/lib/staff-firebase";
import {
  requestCategories,
  requestStatuses,
  safeStaffUrl,
  staffDate,
  staffError,
  type StaffAccess,
  type StaffMessage,
  type StaffRequest,
} from "@/lib/staff-portal";

type RequestProps = {
  user: User;
  access: StaffAccess;
  requests: StaffRequest[];
  loaded: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onLoadMore: () => void;
  hasMore: boolean;
};

export function StaffRequests({
  user,
  access,
  requests,
  loaded,
  selected,
  onSelect,
  onLoadMore,
  hasMore,
}: RequestProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const admin = access.role === "admin";
  const current = requests.find((item) => item.id === selected);
  const filtered = requests.filter(
    (item) =>
      (status === "All statuses" || item.status === status) &&
      `${item.title} ${item.authorName} ${item.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section aria-labelledby="staff-requests-title">
      <div className="staff-section-heading">
        <div>
          <p className="staff-kicker">Ideas into action</p>
          <h2 id="staff-requests-title">
            {admin ? "The Staff Inbox." : "Your Conversations."}
          </h2>
          <p>
            {admin
              ? "Review requests, ask questions, and keep staff updated."
              : "A direct conversation with your website administrators."}
          </p>
        </div>
        {selected !== "new" && (
          <button className="staff-button" onClick={() => onSelect("new")}>
            Send a request +
          </button>
        )}
      </div>
      {selected === "new" ? (
        <RequestForm
          user={user}
          access={access}
          onCancel={() => onSelect(null)}
          onSaved={onSelect}
        />
      ) : current ? (
        <RequestThread
          key={current.id}
          request={current}
          user={user}
          access={access}
          onBack={() => onSelect(null)}
        />
      ) : (
        <>
          <div className="staff-filters">
            <label>
              Search conversations
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  admin
                    ? "Title, staff member, or category"
                    : "Title or category"
                }
              />
            </label>
            <label>
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option>All statuses</option>
                {requestStatuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          {!loaded ? (
            <p role="status">Loading requests…</p>
          ) : filtered.length === 0 ? (
            <div className="staff-empty">
              <h3>
                {requests.length
                  ? "No Matching Conversations."
                  : "Let’s Start a Conversation."}
              </h3>
              <p>
                {requests.length
                  ? "Try a different search or status. You can also load older requests below."
                  : "Send a website change, event information, a shared document, or a question."}
              </p>
            </div>
          ) : (
            <div className="staff-recent-list">
              {filtered.map((item) => (
                <button key={item.id} onClick={() => onSelect(item.id)}>
                  <div>
                    <span className="staff-kicker">
                      {item.category} · {staffDate(item.updatedAt)}
                    </span>
                    <h3>{item.title}</h3>
                    <p>
                      {admin ? item.authorName : "Your request"}
                      {item.neededBy ? ` · Requested by ${item.neededBy}` : ""}
                    </p>
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
          {hasMore && (
            <button
              className="staff-button staff-button--quiet staff-load-more"
              disabled={!loaded}
              onClick={onLoadMore}
            >
              {loaded ? "Load older requests" : "Loading…"}
            </button>
          )}
          <p className="staff-help">
            {admin
              ? "Conversations are shared with administrators and the staff member who submitted them."
              : "Your conversations can only be read by you and approved administrators."}{" "}
            Website changes are reviewed before publishing.
          </p>
        </>
      )}
    </section>
  );
}

function RequestForm({
  user,
  access,
  onCancel,
  onSaved,
}: {
  user: User;
  access: StaffAccess;
  onCancel: () => void;
  onSaved: (id: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title")).trim();
    const body = String(data.get("body")).trim();
    const reference = String(data.get("referenceUrl")).trim();
    setError("");
    if (!title || !body) {
      setError("Add a title and a message so we know how to help.");
      return;
    }
    if (reference && !safeStaffUrl(reference)) {
      setError(
        "Use a complete secure link beginning with https://, or leave the link blank.",
      );
      return;
    }
    setBusy(true);
    try {
      const result = await addDoc(
        collection(getStaffFirebase().db, `${portalPath}/requests`),
        {
          title,
          body,
          category: String(data.get("category")),
          status: "New",
          referenceUrl: reference ? safeStaffUrl(reference) : "",
          neededBy: String(data.get("neededBy")),
          createdBy: user.uid,
          authorEmail: user.email!.toLowerCase(),
          authorName: access.name,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );
      onSaved(result.id);
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="staff-editor staff-editor--open">
      <div className="staff-section-heading staff-section-heading--small">
        <h3>What Would You Like to Share?</h3>
        <button
          className="staff-text-button"
          disabled={busy}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      <form className="staff-form" onSubmit={submit}>
        <div className="staff-form-grid">
          <label>
            Type of request
            <select name="category">
              {requestCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Requested date <span className="staff-optional">(optional)</span>
            <input name="neededBy" type="date" />
          </label>
        </div>
        <label>
          Title
          <input
            name="title"
            required
            maxLength={140}
            placeholder="A short description of your request"
          />
        </label>
        <label>
          Details
          <textarea
            name="body"
            required
            maxLength={5000}
            rows={6}
            placeholder="Include the page, wording, dates, or other details we’ll need."
          />
        </label>
        <label>
          Supporting link <span className="staff-optional">(optional)</span>
          <input
            name="referenceUrl"
            type="url"
            maxLength={2000}
            placeholder="https://drive.google.com/…"
          />
        </label>
        <p className="staff-help">
          For photos or documents, paste a Drive link and give your
          administrator permission to open it.
        </p>
        <button className="staff-button" disabled={busy}>
          {busy ? "Sending…" : "Send request"}
          <span aria-hidden="true">↗</span>
        </button>
        {error && (
          <p className="staff-alert staff-alert--error" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

function RequestThread({
  request,
  user,
  access,
  onBack,
}: {
  request: StaffRequest;
  user: User;
  access: StaffAccess;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<StaffMessage[]>([]);
  const [messageLimit, setMessageLimit] = useState(100);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const { db } = getStaffFirebase();
  const admin = access.role === "admin";
  useEffect(() => {
    setLoaded(false);
    return onSnapshot(
      query(
        collection(db, `${portalPath}/requests/${request.id}/messages`),
        orderBy("createdAt"),
        limitToLast(messageLimit),
      ),
      (snapshot) => {
        setMessages(
          snapshot.docs.map(
            (item) => ({ ...item.data(), id: item.id }) as StaffMessage,
          ),
        );
        setLoaded(true);
      },
      (cause) => {
        setMessages([]);
        setLoaded(true);
        setError(staffError(cause));
      },
    );
  }, [db, request.id, messageLimit]);

  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = String(new FormData(form).get("body")).trim();
    if (!body) return;
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      const batch = writeBatch(db);
      batch.set(
        doc(collection(db, `${portalPath}/requests/${request.id}/messages`)),
        {
          body,
          authorId: user.uid,
          authorName: access.name,
          createdAt: serverTimestamp(),
        },
      );
      batch.update(doc(db, `${portalPath}/requests`, request.id), {
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      form.reset();
      setFeedback("Reply sent.");
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }
  async function changeStatus(status: string) {
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      await updateDoc(doc(db, `${portalPath}/requests`, request.id), {
        status,
        updatedAt: serverTimestamp(),
      });
      setFeedback(`Status changed to ${status}.`);
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="staff-thread">
      <button className="staff-text-button" onClick={onBack}>
        ← All conversations
      </button>
      <header className="staff-thread__header">
        <div>
          <p className="staff-kicker">
            {request.category} · {staffDate(request.createdAt)}
          </p>
          <h3>{request.title}</h3>
          <p>
            From {request.authorName}
            {request.neededBy ? ` · Requested by ${request.neededBy}` : ""}
          </p>
        </div>
        {admin ? (
          <label>
            Request status
            <select
              value={request.status}
              disabled={busy}
              onChange={(event) => void changeStatus(event.target.value)}
            >
              {requestStatuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        ) : (
          <span
            className={`staff-status staff-status--${request.status.toLowerCase().replace(/ /g, "-")}`}
          >
            {request.status}
          </span>
        )}
      </header>
      <div className="staff-thread__original">
        <p>{request.body}</p>
        {request.referenceUrl && safeStaffUrl(request.referenceUrl) && (
          <a
            className="staff-card-link"
            href={safeStaffUrl(request.referenceUrl)!}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open supporting link ↗
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
      <h4 className="staff-kicker">The conversation</h4>
      {!loaded && <p role="status">Loading replies…</p>}
      {messages.length >= messageLimit && (
        <button
          className="staff-text-button"
          disabled={!loaded}
          onClick={() => setMessageLimit((count) => count + 100)}
        >
          Load earlier replies
        </button>
      )}
      <ol className="staff-messages" aria-label="Conversation replies">
        {messages.map((message) => (
          <li
            className={
              message.authorId === user.uid
                ? "staff-message staff-message--own"
                : "staff-message"
            }
            key={message.id}
          >
            <header>
              <strong>{message.authorName}</strong>
              <span>{staffDate(message.createdAt)}</span>
            </header>
            <p>{message.body}</p>
          </li>
        ))}
      </ol>
      {loaded && !messages.length && (
        <p className="staff-muted">
          No replies yet. Follow up here whenever you have more to add.
        </p>
      )}
      <form className="staff-form" onSubmit={reply}>
        <label htmlFor="staff-reply">
          Add a reply
          <textarea
            id="staff-reply"
            name="body"
            required
            maxLength={5000}
            rows={4}
            placeholder="Keep the conversation going…"
          />
        </label>
        <button className="staff-button" disabled={busy}>
          {busy ? "Please wait…" : "Send reply"}
          <span aria-hidden="true">↗</span>
        </button>
      </form>
      {error && (
        <p className="staff-alert staff-alert--error" role="alert">
          {error}
        </p>
      )}
      {feedback && (
        <p className="staff-alert" role="status">
          {feedback}
        </p>
      )}
    </div>
  );
}
