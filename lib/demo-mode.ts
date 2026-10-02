const PORTFOLIO_DEMO_BRANCH = "feat/portfolio-demo-access";

export function isPortfolioDemoMode() {
  const configured = process.env.PORTFOLIO_DEMO_MODE?.trim().toLowerCase();

  if (configured) {
    return configured === "true";
  }

  if (process.env.VERCEL !== "1") {
    return false;
  }

  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_GIT_COMMIT_REF === PORTFOLIO_DEMO_BRANCH
  );
}
