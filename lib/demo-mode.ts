export function isPortfolioDemoMode() {
  return process.env.PORTFOLIO_DEMO_MODE?.trim().toLowerCase() === "true";
}
