"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { EmmanuelMotif } from "@/components/emmanuel-motif";
import {
  getStaffFirebase,
  portalPath,
  prepareStaffAuth,
} from "@/lib/staff-firebase";
import { staffError, type StaffAccess } from "@/lib/staff-portal";
import { StaffWorkspace } from "./staff-workspace";

export function StaffPortal() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<{
    user: User;
    verified: boolean;
  } | null>(null);
  const [access, setAccess] = useState<StaffAccess | null>();
  const [accessError, setAccessError] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");

  useEffect(() => {
    try {
      return onIdTokenChanged(getStaffFirebase().auth, (user) => {
        setSession(user ? { user, verified: user.emailVerified } : null);
        setReady(true);
      });
    } catch (cause) {
      setError(staffError(cause));
      setReady(true);
    }
  }, []);

  const uid = session?.user.uid;
  const email = session?.user.email?.toLowerCase();
  const verified = session?.verified;
  useEffect(() => {
    setAccess(undefined);
    setAccessError("");
    if (!uid || !email) return;
    return onSnapshot(
      doc(getStaffFirebase().db, `${portalPath}/access`, email),
      (snapshot) => {
        setAccess(snapshot.exists() ? (snapshot.data() as StaffAccess) : null);
      },
      (cause) => {
        setAccess(null);
        setAccessError(staffError(cause));
      },
    );
  }, [uid, email, verified, retry]);

  useEffect(() => {
    if (!uid) return;
    let lastActive = Date.now();
    const markActive = () => {
      lastActive = Date.now();
    };
    const checkIdle = () => {
      if (Date.now() - lastActive >= 30 * 60 * 1000) {
        void signOut(getStaffFirebase().auth).then(() =>
          setNotice(
            "You were signed out after 30 minutes of inactivity. Please sign in again.",
          ),
        );
      }
    };
    window.addEventListener("pointerdown", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("scroll", markActive, { passive: true });
    document.addEventListener("visibilitychange", checkIdle);
    const timer = window.setInterval(checkIdle, 30000);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointerdown", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("scroll", markActive);
      document.removeEventListener("visibilitychange", checkIdle);
    };
  }, [uid]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const address = String(data.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(data.get("password") ?? "");
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const auth = await prepareStaffAuth();
      if (mode === "reset") {
        try {
          await sendPasswordResetEmail(auth, address);
        } catch (cause) {
          if (!(
            typeof cause === "object" &&
            cause &&
            "code" in cause &&
            cause.code === "auth/user-not-found"
          ))
            throw cause;
        }
        setNotice(
          "If this email has an account, a password reset link is on its way. Check your inbox and spam folder.",
        );
      } else if (mode === "register") {
        if (
          password.length < 12 ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password) ||
          !/[0-9]/.test(password)
        ) {
          setError(
            "Use at least 12 characters with uppercase and lowercase letters and a number.",
          );
          return;
        }
        if (password !== String(data.get("confirm"))) {
          setError("Your passwords do not match.");
          return;
        }
        const result = await createUserWithEmailAndPassword(
          auth,
          address,
          password,
        );
        await sendEmailVerification(result.user);
        setNotice("A verification link has been sent to your email.");
      } else {
        await signInWithEmailAndPassword(auth, address, password);
      }
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function accountAction(action: "verify" | "refresh" | "logout") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (action === "logout") await signOut(getStaffFirebase().auth);
      else if (session && action === "verify") {
        await sendEmailVerification(session.user);
        setNotice("Verification email sent. Check your inbox and spam folder.");
      } else if (session) {
        await reload(session.user);
        await session.user.getIdToken(true);
        setSession({
          user: session.user,
          verified: session.user.emailVerified,
        });
        setRetry((value) => value + 1);
        if (!session.user.emailVerified)
          setNotice(
            "Your email is not verified yet. Open the link in your email, then try again.",
          );
      }
    } catch (cause) {
      setError(staffError(cause));
    } finally {
      setBusy(false);
    }
  }

  if (
    session &&
    (session.verified || access?.uid === uid) &&
    access?.active &&
    ["staff", "admin"].includes(access.role) &&
    access.email === email
  ) {
    return (
      <StaffWorkspace
        key={`${session.user.uid}:${access.role}`}
        user={session.user}
        access={access}
      />
    );
  }

  return (
    <div className="staff-portal">
      <section className="staff-entry" aria-labelledby="staff-title">
        <div className="staff-entry__story">
          <EmmanuelMotif />
          <p className="staff-kicker">Emmanuel Church · Staff</p>
          <h1 id="staff-title">
            A Place to
            <br /> <em>Work Together.</em>
          </h1>
          <p>
            Shared resources, thoughtful conversations, and the next good thing
            for Emmanuel.
          </p>
          <div className="staff-entry__features">
            <span>
              <b>01</b> Find the folders you need.
            </span>
            <span>
              <b>02</b> Share an update or an idea.
            </span>
            <span>
              <b>03</b> Keep the conversation together.
            </span>
          </div>
          <Link href="/">← Return to the church website</Link>
        </div>
        <div className="staff-entry__panel">
          {!ready || (session && access === undefined) ? (
            <div className="staff-state" role="status">
              <span className="staff-kicker">Staff workspace</span>
              <h2>Checking your access…</h2>
              <p>Please wait a moment.</p>
            </div>
          ) : session ? (
            <div className="staff-state">
              <p className="staff-kicker">One more step</p>
              <h2>
                {session.verified
                  ? "Staff Access Required."
                  : "Check Your Inbox."}
              </h2>
              <p>
                {session.verified
                  ? "Your email is verified. An administrator needs to approve or restore your staff access before you can enter."
                  : "Open the verification link in your email to confirm your account, then return here."}
              </p>
              <p className="staff-account-email">{session.user.email}</p>
              {accessError && (
                <p className="staff-alert staff-alert--error" role="alert">
                  {accessError}
                </p>
              )}
              <div className="staff-actions">
                <button
                  className="staff-button"
                  disabled={busy}
                  onClick={() => void accountAction("refresh")}
                >
                  {busy
                    ? "Please wait…"
                    : session.verified
                      ? "Check access again"
                      : "I’ve verified my email"}
                </button>
                {!session.verified && (
                  <button
                    className="staff-button staff-button--quiet"
                    disabled={busy}
                    onClick={() => void accountAction("verify")}
                  >
                    Resend verification
                  </button>
                )}
                <button
                  className="staff-text-button"
                  disabled={busy}
                  onClick={() => void accountAction("logout")}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="staff-kicker">Private staff workspace</p>
              <h2>
                {mode === "register"
                  ? "Set Up Your Account."
                  : mode === "reset"
                    ? "Reset Your Password."
                    : "Welcome Back."}
              </h2>
              <p className="staff-muted">
                {mode === "register"
                  ? "Use the email your administrator has approved. Creating an account does not grant staff access."
                  : mode === "reset"
                    ? "We’ll email you a secure link to choose a new password."
                    : "Sign in to find shared folders and keep your website requests moving."}
              </p>
              <form className="staff-form" onSubmit={authenticate} key={mode}>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </label>
                {mode !== "reset" && (
                  <label>
                    Password
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={mode === "register" ? 12 : undefined}
                      maxLength={128}
                      autoComplete={
                        mode === "register"
                          ? "new-password"
                          : "current-password"
                      }
                    />
                  </label>
                )}
                {mode === "register" && (
                  <>
                    <p className="staff-help">
                      At least 12 characters, including uppercase and lowercase
                      letters and a number.
                    </p>
                    <label>
                      Confirm password
                      <input
                        name="confirm"
                        type="password"
                        required
                        minLength={12}
                        maxLength={128}
                        autoComplete="new-password"
                      />
                    </label>
                  </>
                )}
                <button className="staff-button" disabled={busy}>
                  {busy
                    ? "Please wait…"
                    : mode === "register"
                      ? "Create account"
                      : mode === "reset"
                        ? "Send reset link"
                        : "Sign in to workspace"}
                  <span aria-hidden="true">↗</span>
                </button>
              </form>
              <div className="staff-auth-options">
                {mode === "login" ? (
                  <>
                    <button
                      className="staff-text-button"
                      onClick={() => {
                        setMode("reset");
                        setError("");
                        setNotice("");
                      }}
                    >
                      Forgot your password?
                    </button>
                    <button
                      className="staff-text-button"
                      onClick={() => {
                        setMode("register");
                        setError("");
                        setNotice("");
                      }}
                    >
                      First time here? Set up your account
                    </button>
                  </>
                ) : (
                  <button
                    className="staff-text-button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setNotice("");
                    }}
                  >
                    ← Back to sign in
                  </button>
                )}
              </div>
              <p className="staff-entry__privacy">
                For approved Emmanuel staff. Sessions end when you close this
                browser tab or after 30 minutes of inactivity.
              </p>
            </>
          )}
          {error && (
            <p className="staff-alert staff-alert--error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="staff-alert" role="status">
              {notice}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
