export function isPortfolioDemoMode() {
  const configured = process.env.PORTFOLIO_DEMO_MODE?.trim().toLowerCase();

  if (configured) {
    return configured === "true";
  }

  return process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
}
