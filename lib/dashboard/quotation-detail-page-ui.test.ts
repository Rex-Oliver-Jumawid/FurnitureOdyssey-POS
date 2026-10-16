import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync("app/(dashboard)/quotations/[id]/page.tsx", "utf8");

test("quotation detail item cards preserve saved product images and an image fallback", () => {
  assert.match(source, /images:\s*\{\s*orderBy:/);
  assert.match(source, /function quotationItemImage/);
  assert.match(source, /bg-contain bg-center bg-no-repeat/);
  assert.match(source, /aria-label=\{image.secureUrl \? image.altText : undefined\}/);
  assert.match(source, /<ImagePlus className="h-5 w-5" \/>/);
});

test("quotation detail items have legible responsive cards in narrow desktop columns", () => {
  assert.match(source, /xl:grid-cols-\[minmax\(0,1fr\)_minmax\(240px,300px\)\]/);
  assert.doesNotMatch(source, /quotationDetailItemGridClass/);
  assert.doesNotMatch(source, /md:grid-cols-\[64px_minmax/);
  assert.match(source, /<article key=\{item.id\} className="min-w-0 p-4 sm:p-5">/);
  assert.match(source, /className="flex min-w-0 items-start gap-4"/);
  assert.match(source, /className="min-w-0 flex-1"/);
  assert.match(source, /whitespace-pre-wrap break-words text-sm leading-5/);
  assert.match(source, /grid-cols-2 gap-x-4 gap-y-3 rounded-lg bg-soft-accent\/40 p-3 sm:grid-cols-4/);
  assert.doesNotMatch(source, /break-all/);
  assert.doesNotMatch(source, /min-w-\[720px\]/);
});

test("item pricing and assembly state stay visible when the table is reflowed", () => {
  for (const label of ["Quantity", "Unit price", "Discount", "Line total"]) {
    assert.match(source, new RegExp(`<dt[^>]*>${label}<\\/dt>`));
  }
  assert.match(source, /formatQuantity\(item.quantity\)/);
  assert.match(source, /formatMoney\(item.unitPrice\)/);
  assert.match(source, /formatMoney\(item.discountAmount\)/);
  assert.match(source, /formatMoney\(item.lineTotal\)/);
  assert.match(source, /Assemble: \{item.requiresAssembly \? "Yes" : "No"\}/);
  assert.match(source, /Product code: \$\{item.snapshotProductCode\}/);
});
