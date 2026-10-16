"use client";

import * as React from "react";

/** Value that only updates after `delay` ms without changes. */
export function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Native "leave site?" prompt while there are unsaved edits. */
export function useUnsavedChangesWarning(dirty) {
  React.useEffect(() => {
    if (!dirty) return;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}

/** ⌘/Ctrl + key shortcut. The latest callback is always used. */
export function useModKey(key, callback) {
  const ref = React.useRef(callback);
  React.useEffect(() => {
    ref.current = callback;
  });
  React.useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === key) {
        event.preventDefault();
        ref.current?.(event);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key]);
}

/** Re-render every `ms` (for "saved 2 min ago" labels). */
export function useTick(ms = 30_000) {
  const [, tick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => {
    const id = setInterval(tick, ms);
    return () => clearInterval(id);
  }, [ms]);
}

/** Copy text to the clipboard; returns [copied, copy]. */
export function useCopy(timeout = 1600) {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        return false;
      }
    },
    [timeout]
  );
  return [copied, copy];
}
