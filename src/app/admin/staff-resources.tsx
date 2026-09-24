"use client";

import { useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getStaffFirebase, portalPath } from "@/lib/staff-firebase";
import {
  resourceCategories,
  safeStaffUrl,
  staffError,
  type StaffResource,
} from "@/lib/staff-portal";

export function StaffResources({
  user,
  admin,
  resources,
}: {
  user: User;
  admin: boolean;
  resources: StaffResource[];
}) {
  const [edit, setEdit] = useState<StaffResource | "new" | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All resources");
  const [showArchived, setShowArchived] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const existing = edit && edit !== "new" ? edit : null;
  const filtered = resources.filter(
    (item) =>
      (showArchived || !item.archived) &&
      (category === "All resources" || item.category === category) &&
      `${item.title} ${item.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const url = safeStaffUrl(String(data.get("url")).trim());
    const title = String(data.get("title")).trim();
    setError("");
    setMessage("");
    if (!url || !title) {
      setError(
        "Add a title and a complete secure link beginning with https://.",
      );
      return;
    }
    setBusy(true);
    const value = {
      title,
      description: String(data.get("description")).trim(),
      url,
      category: String(data.get("category")),
      archived: existing?.archived ?? false,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    };
    try {
      const { db } = getStaffFirebase();
      if (existing)
        await updateDoc(doc(db, `${portalPath}/resources`, existing.id), value);
      else
        await addDoc(collection(db, `${portalPath}/resources`), {
          ...value,
          createdAt: serverTimestamp(),
        });
      setEdit(null);
      setMessage("Resource saved for staff.");
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function archive(item: StaffResource) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await updateDoc(
        doc(getStaffFirebase().db, `${portalPath}/resources`, item.id),
        {
          archived: !item.archived,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
        },
      );
      setMessage(
        item.archived
          ? "Resource restored."
          : "Resource archived. You can restore it from Show archived.",
      );
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="staff-resources-title">
      <div className="staff-section-heading">
        <div>
          <p className="staff-kicker">The shared shelf</p>
          <h2 id="staff-resources-title">Everything Within Reach.</h2>
          <p>Folders, documents, and the links your team uses most.</p>
        </div>
        {admin && (
          <button
            className="staff-button"
            onClick={() => {
              setEdit("new");
              setError("");
              setMessage("");
            }}
          >
            Add a resource +
          </button>
        )}
      </div>
      {edit && (
        <div className="staff-editor staff-editor--open">
          <div className="staff-section-heading staff-section-heading--small">
            <h3>{existing ? "Edit Resource" : "Add a Resource"}</h3>
            <button
              className="staff-text-button"
              disabled={busy}
              onClick={() => {
                setEdit(null);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
          <form
            className="staff-form"
            key={existing?.id || "new"}
            onSubmit={save}
          >
            <div className="staff-form-grid">
              <label>
                Resource title
                <input
                  name="title"
                  required
                  maxLength={120}
                  defaultValue={existing?.title || ""}
                  placeholder="Sunday service planning"
                />
              </label>
              <label>
                Category
                <select
                  name="category"
                  defaultValue={existing?.category || resourceCategories[0]}
                >
                  {resourceCategories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Google Drive folder or resource link
              <input
                name="url"
                type="url"
                required
                maxLength={2000}
                defaultValue={existing?.url || ""}
                placeholder="https://drive.google.com/…"
              />
            </label>
            <p className="staff-help">
              Google Drive controls access to the files themselves. Share the
              folder with the intended staff in Drive before posting its link
              here.
            </p>
            <label>
              Short description
              <textarea
                name="description"
                rows={2}
                maxLength={600}
                defaultValue={existing?.description || ""}
              />
            </label>
            <button className="staff-button" disabled={busy}>
              {busy ? "Saving…" : "Save resource"}
            </button>
          </form>
        </div>
      )}
      {error && (
        <p className="staff-alert staff-alert--error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="staff-alert" role="status">
          {message}
        </p>
      )}
      <div className="staff-filters">
        <label>
          Find a resource
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search folders and documents"
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All resources</option>
            {resourceCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        {admin && (
          <label className="staff-checkbox">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
            />
            Show archived
          </label>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="staff-empty">
          <h3>
            {search || category !== "All resources"
              ? "No Matching Resources."
              : "Your Shared Shelf Is Ready."}
          </h3>
          <p>
            {search || category !== "All resources"
              ? "Try another search or category."
              : admin
                ? "Add your first Google Drive folder or useful link above."
                : "Your administrator will add shared folders and helpful links here."}
          </p>
        </div>
      ) : (
        <div className="staff-resource-grid">
          {filtered.map((item) => (
            <article
              className={`staff-resource${item.archived ? " staff-resource--archived" : ""}`}
              key={item.id}
            >
              <p className="staff-kicker">
                {item.category}
                {item.archived ? " · Archived" : ""}
              </p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {safeStaffUrl(item.url) && (
                <a
                  className="staff-card-link"
                  href={safeStaffUrl(item.url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open resource <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {admin && (
                <div className="staff-resource__actions">
                  <button
                    className="staff-text-button"
                    onClick={() => {
                      setEdit(item);
                      setError("");
                      setMessage("");
                    }}
                  >
                    Edit<span className="sr-only"> {item.title}</span>
                  </button>
                  <button
                    className="staff-text-button"
                    disabled={busy}
                    onClick={() => void archive(item)}
                  >
                    {item.archived ? "Restore" : "Archive"}
                    <span className="sr-only"> {item.title}</span>
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
