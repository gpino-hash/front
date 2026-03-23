"use client";

import { useState, useSyncExternalStore } from "react";

function getIsDark() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return stored === "dark" || (!stored && prefersDark);
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function ThemeToggle() {
  const initialDark = useSyncExternalStore(subscribe, getIsDark, () => false);
  const [dark, setDark] = useState(initialDark);

  // Sync DOM on first render
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", dark);
  }

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <span className="material-symbols-outlined text-[20px]">
        {dark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}