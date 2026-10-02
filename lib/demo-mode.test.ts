import assert from "node:assert/strict";
import test from "node:test";
import { isPortfolioDemoMode } from "@/lib/demo-mode";

test("portfolio demo mode honors explicit configuration and defaults on for Vercel production", () => {
  const previous = {
    mode: process.env.PORTFOLIO_DEMO_MODE,
    vercel: process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV
  };

  try {
    delete process.env.PORTFOLIO_DEMO_MODE;
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;
    assert.equal(isPortfolioDemoMode(), false);

    process.env.VERCEL = "1";
    process.env.VERCEL_ENV = "production";
    assert.equal(isPortfolioDemoMode(), true);

    process.env.PORTFOLIO_DEMO_MODE = "false";
    assert.equal(isPortfolioDemoMode(), false);

    process.env.PORTFOLIO_DEMO_MODE = " TRUE ";
    assert.equal(isPortfolioDemoMode(), true);
  } finally {
    for (const [key, value] of Object.entries({
      PORTFOLIO_DEMO_MODE: previous.mode,
      VERCEL: previous.vercel,
      VERCEL_ENV: previous.vercelEnv
    })) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
});
