import assert from "node:assert/strict";
import test from "node:test";
import { getPortfolioDemoUser } from "@/lib/auth/demo-user";
import { hasPermission } from "@/lib/auth/permissions";

test("portfolio demo user can inspect operational modules without mutating them", () => {
  const user = getPortfolioDemoUser();

  assert.equal(user.role, "STAFF");
  assert.equal(hasPermission(user, "CUSTOMERS", "VIEW"), true);
  assert.equal(hasPermission(user, "PRODUCTS", "VIEW"), true);
  assert.equal(hasPermission(user, "QUOTATIONS", "VIEW"), true);
  assert.equal(hasPermission(user, "ORDERS", "VIEW"), true);
  assert.equal(hasPermission(user, "SALES_HISTORY", "VIEW"), true);
  assert.equal(hasPermission(user, "QUOTATIONS", "EXPORT"), true);
  assert.equal(hasPermission(user, "DOCUMENTS", "EXPORT"), true);

  assert.equal(hasPermission(user, "CUSTOMERS", "CREATE"), false);
  assert.equal(hasPermission(user, "QUOTATIONS", "UPDATE"), false);
  assert.equal(hasPermission(user, "ORDERS", "CREATE"), false);
  assert.equal(hasPermission(user, "USERS", "VIEW"), false);
  assert.equal(hasPermission(user, "SETTINGS", "VIEW"), false);
});
