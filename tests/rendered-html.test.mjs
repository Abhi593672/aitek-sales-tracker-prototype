import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("provides role-based access for all four prototype roles", () => {
  for (const role of ["KAM", "IST", "Desk Manager", "Regional Manager"]) {
    assert.match(page, new RegExp(`<option>${role}</option>`));
  }
  assert.match(page, /onLogin\(loginRole\)/);
});

test("implements the agreed pickup and classification rules", () => {
  assert.match(page, /30-minute pickup SLA/);
  assert.match(page, /System-suggested Type/);
  assert.match(page, /Complex Quote target delivery date and time is mandatory/);
  assert.match(page, /Tender\/RFP reference is mandatory/);
  assert.doesNotMatch(page, /2-hour pickup SLA/);
  assert.doesNotMatch(page, /Suggested by KAM/);
});

test("includes Desk Manager reassignment and Regional Manager supervision", () => {
  assert.match(page, /Desk Manager rule/);
  assert.match(page, /QR-2026-01839 reassigned to/);
  assert.match(page, /Regional pipeline, KAM performance and commercial risk/);
  assert.match(page, /read-only commercial supervision/);
});

test("preserves the AITEKCenter quotation workspace with scoped Sales Tracker enhancements", () => {
  for (const text of [
    "AITEK Price (Converted)",
    "Vendor Price",
    "Discount %",
    "Stock availability",
    "Delivery conditions",
    "Price Break-up from AITEK",
    "FAP Simulator",
    "Validate &amp; Send to Reseller",
    "SALES TRACKER CONTEXT",
  ]) {
    assert.ok(page.includes(text), `Expected quotation workspace to include: ${text}`);
  }
  assert.doesNotMatch(page, /label="Sale Representative"/);
});
