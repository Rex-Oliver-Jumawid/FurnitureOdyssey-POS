import assert from "node:assert/strict";
import test from "node:test";
import { normalizePortfolioReturnUrl } from "@/lib/portfolio-return";

test("portfolio return URL accepts external http and https locations", () => {
  assert.equal(
    normalizePortfolioReturnUrl(
      "https://portfolio.example/#work",
      "https://furniture-odyssey-pos.vercel.app"
    ),
    "https://portfolio.example/#work"
  );

  assert.equal(
    normalizePortfolioReturnUrl(
      "http://localhost:3001/#work",
      "http://localhost:3000"
    ),
    "http://localhost:3001/#work"
  );
});

test("portfolio return URL rejects unsafe and same-origin locations", () => {
  assert.equal(
    normalizePortfolioReturnUrl(
      "javascript:alert(1)",
      "https://furniture-odyssey-pos.vercel.app"
    ),
    null
  );
  assert.equal(
    normalizePortfolioReturnUrl(
      "https://furniture-odyssey-pos.vercel.app/dashboard",
      "https://furniture-odyssey-pos.vercel.app"
    ),
    null
  );
  assert.equal(normalizePortfolioReturnUrl("not-a-url"), null);
});
