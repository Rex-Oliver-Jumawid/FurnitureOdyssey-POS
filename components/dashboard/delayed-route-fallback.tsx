"use client";

import { useEffect, useState, type ReactNode } from "react";

const DEFAULT_DELAY_MS = 300;

export function DelayedRouteFallback({
  children,
  delayMs = DEFAULT_DELAY_MS
}: {
  children: ReactNode;
  delayMs?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [delayMs]);

  if (!visible) {
    return null;
  }

  return <>{children}</>;
}
