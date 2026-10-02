import assert from "node:assert/strict";
import test from "node:test";
import { isPortfolioDemoMode } from "@/lib/demo-mode";

test("portfolio demo mode is enabled only by an explicit true value", () => {
  const previous = process.env.PORTFOLIO_DEMO_MODE;

  try {
    delete process.env.PORTFOLIO_DEMO_MODE;
    assert.equal(isPortfolioDemoMode(), false);

    process.env.PORTFOLIO_DEMO_MODE = "true";
    assert.equal(isPortfolioDemoMode(), true);

    process.env.PORTFOLIO_DEMO_MODE = " TRUE ";
    assert.equal(isPortfolioDemoMode(), true);

    process.env.PORTFOLIO_DEMO_MODE = "false";
    assert.equal(isPortfolioDemoMode(), false);
  } finally {
    if (previous === undefined) {
      delete process.env.PORTFOLIO_DEMO_MODE;
    } else {
      process.env.PORTFOLIO_DEMO_MODE = previous;
    }
  }
});
