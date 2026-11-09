import assert from "node:assert/strict";
import test from "node:test";
import { getShortLinkPath } from "../lib/short-link";

test("short link paths use the dedicated prefix", () => {
  assert.equal(getShortLinkPath("dashboard"), "/l/dashboard");
  assert.equal(getShortLinkPath("My-Link_123"), "/l/My-Link_123");
});
