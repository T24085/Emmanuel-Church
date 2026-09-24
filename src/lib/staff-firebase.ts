"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserSessionPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Firebase's web configuration is public. Access is enforced by Authentication
// and firestore.rules, never by hiding these identifiers in the browser.
const firebaseConfig = {
  apiKey: "AIzaSyBKXgykbh0GPmk9S86nnQL5b_wsKizz2rs",
  authDomain: "emmanuel-240d1.firebaseapp.com",
  projectId: "emmanuel-240d1",
  storageBucket: "emmanuel-240d1.firebasestorage.app",
  messagingSenderId: "528180049764",
  appId: "1:528180049764:web:a6627aa8966f22da08ac71",
};

export const portalPath = "staffPortal/main";
let services: ReturnType<typeof initializeServices> | undefined;

function initializeServices() {
  const emulated =
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "true";
  const config = emulated
    ? { ...firebaseConfig, projectId: "demo-emmanuel-staff" }
    : firebaseConfig;
  const name = "emmanuel-staff";
  const existing = getApps().some((item) => item.name === name);
  const app = existing ? getApp(name) : initializeApp(config, name);
  const auth = getAuth(app);
  const db = getFirestore(app); // Memory-only cache; no staff data persisted to disk.
  if (emulated && !existing) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  return { auth, db, emulated };
}

export function getStaffFirebase() {
  services ??= initializeServices();
  return services;
}

export async function prepareStaffAuth() {
  const { auth } = getStaffFirebase();
  await setPersistence(auth, browserSessionPersistence);
  return auth;
}
