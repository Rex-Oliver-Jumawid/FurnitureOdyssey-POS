"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  normalizePortfolioReturnUrl,
  PORTFOLIO_RETURN_STORAGE_KEY
} from "@/lib/portfolio-return";

export function PortfolioReturnLink() {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const fromPortfolio =
      currentUrl.searchParams.get("source") === "prometheus-portfolio"
        ? currentUrl.searchParams.get("returnTo")
        : null;
    const stored = window.sessionStorage.getItem(PORTFOLIO_RETURN_STORAGE_KEY);
    const referrer = document.referrer || null;

    const returnUrl =
      normalizePortfolioReturnUrl(fromPortfolio, window.location.origin) ??
      normalizePortfolioReturnUrl(stored, window.location.origin) ??
      normalizePortfolioReturnUrl(referrer, window.location.origin);

    if (returnUrl) {
      window.sessionStorage.setItem(PORTFOLIO_RETURN_STORAGE_KEY, returnUrl);
      setHref(returnUrl);
    }

    if (fromPortfolio) {
      currentUrl.searchParams.delete("source");
      currentUrl.searchParams.delete("returnTo");
      window.history.replaceState(
        window.history.state,
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
    }
  }, []);

  const className =
    "inline-flex min-h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-muted/70";

  if (href) {
    return (
      <a href={href} className={className}>
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Prometheus Portfolio
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to Prometheus Portfolio
    </button>
  );
}
