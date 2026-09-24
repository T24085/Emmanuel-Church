"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getStaffFirebase, portalPath } from "@/lib/staff-firebase";
import { staffError, type StaffAccess } from "@/lib/staff-portal";

export function StaffAccessManager({ user }: { user: User }) {
  const [people, setPeople] = useState<StaffAccess[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { db } = getStaffFirebase();
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, `${portalPath}/access`), orderBy("name")),
        (snapshot) => {
          setPeople(snapshot.docs.map((item) => item.data() as StaffAccess));
          setLoaded(true);
        },
        (cause) => {
          setPeople([]);
          setLoaded(true);
          setError(staffError(cause));
        },
      ),
    [db],
  );

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email")).trim().toLowerCase();
    const name = String(data.get("name")).trim();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (!name || !/^[^/\s@]+@[^/\s@]+\.[^/\s@]+$/.test(email)) {
        setError("Enter a name and a valid email address.");
        return;
      }
      const reference = doc(db, `${portalPath}/access`, email);
      if ((await getDoc(reference)).exists()) {
        setError("This email is already listed. Adjust its access below.");
        return;
      }
      await setDoc(reference, {
        email,
        name,
        role: String(data.get("role")),
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      form.reset();
      setMessage(
        `Access approved for ${email}. Send them the Staff Login page; they can set up their account and verify their email there. No invitation email was sent automatically.`,
      );
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }
  async function change(person: StaffAccess, value: Partial<StaffAccess>) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await updateDoc(doc(db, `${portalPath}/access`, person.email), {
        ...value,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      setMessage(`Access updated for ${person.name}.`);
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="staff-access-title">
      <div className="staff-section-heading">
        <div>
          <p className="staff-kicker">The people behind it</p>
          <h2 id="staff-access-title">Staff Access.</h2>
          <p>
            Approve individual accounts and choose what each person can manage.
          </p>
        </div>
      </div>
      <form
        className="staff-form staff-editor staff-editor--open"
        onSubmit={add}
      >
        <h3>Approve a Staff Member</h3>
        <div className="staff-form-grid">
          <label>
            Full name
            <input name="name" required maxLength={100} autoComplete="off" />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="off"
            />
          </label>
          <label>
            Access level
            <select name="role">
              <option value="staff">Staff member</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
        </div>
        <p className="staff-help">
          Staff can read shared resources and manage their own conversations.
          Administrators can read all requests, manage resources, and approve
          other accounts.
        </p>
        <button className="staff-button" disabled={busy}>
          {busy ? "Please wait…" : "Approve access"}
        </button>
      </form>
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
      {!loaded ? (
        <p role="status">Loading staff…</p>
      ) : (
        <div className="staff-people">
          {people.map((person) => {
            const self = person.email === user.email?.toLowerCase();
            return (
              <article className="staff-person" key={person.email}>
                <div>
                  <h3>
                    {person.name}
                    {self ? " (you)" : ""}
                  </h3>
                  <p>{person.email}</p>
                  <span
                    className={`staff-status${person.active ? "" : " staff-status--completed"}`}
                  >
                    {person.active ? "Access approved" : "Access disabled"}
                  </span>
                </div>
                <label>
                  Role for {person.name}
                  <select
                    value={person.role}
                    disabled={busy || self}
                    onChange={(event) =>
                      void change(person, {
                        role: event.target.value as StaffAccess["role"],
                      })
                    }
                  >
                    <option value="staff">Staff member</option>
                    <option value="admin">Administrator</option>
                  </select>
                </label>
                <button
                  className="staff-button staff-button--quiet"
                  disabled={busy || self}
                  onClick={() =>
                    void change(person, { active: !person.active })
                  }
                >
                  {person.active ? "Disable access" : "Restore access"}
                  <span className="sr-only"> for {person.name}</span>
                </button>
              </article>
            );
          })}
        </div>
      )}
      <p className="staff-help">
        Your own administrator access cannot be changed here. Disabling staff
        access closes the workspace when the change reaches their browser. Files
        already downloaded cannot be recalled. Remove the person’s Google Drive
        permissions separately to prevent future access there.
      </p>
    </section>
  );
}
