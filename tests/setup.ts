import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock document.cookie
let cookieStore = "";
Object.defineProperty(document, "cookie", {
  get: () => cookieStore,
  set: (value: string) => {
    // Handle cookie deletion (max-age=0)
    if (value.includes("max-age=0")) {
      const name = value.split("=")[0];
      const cookies = cookieStore.split("; ").filter((c) => !c.startsWith(name + "="));
      cookieStore = cookies.join("; ");
    } else {
      const name = value.split("=")[0];
      const cookies = cookieStore.split("; ").filter((c) => c && !c.startsWith(name + "="));
      cookies.push(value.split(";")[0]);
      cookieStore = cookies.join("; ");
    }
  },
});

// Reset cookie store between tests
afterEach(() => {
  cookieStore = "";
  localStorageMock.clear();
  vi.restoreAllMocks();
});