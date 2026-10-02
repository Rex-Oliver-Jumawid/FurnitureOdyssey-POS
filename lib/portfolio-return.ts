export const PORTFOLIO_RETURN_STORAGE_KEY = "prometheus-portfolio-return-url";

export function normalizePortfolioReturnUrl(
  value: string | null | undefined,
  currentOrigin?: string
) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    if (currentOrigin && url.origin === currentOrigin) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}
