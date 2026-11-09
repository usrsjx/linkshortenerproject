import assert from "node:assert/strict";
import test from "node:test";
import { createLinkSchema, destinationUrlSchema, linkIdSchema, updateLinkSchema } from "../lib/link-validation";

test("accepts and normalizes HTTP and HTTPS destinations", () => {
  assert.equal(destinationUrlSchema.parse("  https://EXAMPLE.com  "), "https://example.com/");
  assert.equal(destinationUrlSchema.parse("http://example.com/path?q=1"), "http://example.com/path?q=1");
});

test("rejects malformed, unsupported and credential-bearing URLs", () => {
  for (const url of ["", "example.com", "javascript:alert(1)", "ftp://example.com", "https://user:pass@example.com", "https://"]) {
    assert.equal(destinationUrlSchema.safeParse(url).success, false, url);
  }
});

test("enforces input shape and maximum length", () => {
  assert.equal(createLinkSchema.safeParse(null).success, false);
  assert.equal(createLinkSchema.safeParse({ url: 123 }).success, false);
  assert.equal(destinationUrlSchema.safeParse(`https://example.com/${"a".repeat(2048)}`).success, false);
  assert.equal(destinationUrlSchema.safeParse(`https://example.com/${"a".repeat(2028)}`).success, true);
  assert.equal(destinationUrlSchema.safeParse(`https://example.com/${"é".repeat(400)}`).success, false);
});

test("accepts an omitted or blank slug and normalizes a custom slug", () => {
  const url = "https://example.com";
  assert.equal(createLinkSchema.parse({ url }).slug, undefined);
  assert.equal(createLinkSchema.parse({ url, slug: "  " }).slug, undefined);
  assert.equal(createLinkSchema.parse({ url, slug: " My-Link_123 " }).slug, "My-Link_123");
  assert.equal(createLinkSchema.parse({ url, slug: "a".repeat(64) }).slug, "a".repeat(64));
});

test("allows slugs matching application routes under the short link prefix", () => {
  const url = "https://example.com";
  for (const slug of ["dashboard", "Dashboard", "sign-in", "sign-up", "api", "l"]) {
    assert.equal(createLinkSchema.parse({ url, slug }).slug, slug);
    assert.equal(updateLinkSchema.parse({ id: 1, url, slug }).slug, slug);
  }
});

test("rejects unsafe and oversized slugs", () => {
  const url = "https://example.com";
  for (const slug of ["a".repeat(65), "-link", "_next", "a/b", "a.b", "a b", "é"]) {
    assert.equal(createLinkSchema.safeParse({ url, slug }).success, false, slug);
  }
  assert.equal(createLinkSchema.safeParse({ url, slug: 123 }).success, false);
});

test("validates update and delete inputs", () => {
  const url = "https://example.com";
  assert.deepEqual(updateLinkSchema.parse({ id: 1, url }), { id: 1, url: "https://example.com/" });
  assert.equal(updateLinkSchema.parse({ id: 1, url, slug: " new-slug " }).slug, "new-slug");
  for (const id of [0, -1, 1.5, 2147483648, "1"]) {
    assert.equal(linkIdSchema.safeParse({ id }).success, false);
  }
  for (const slug of ["", " ", "a/b"]) {
    assert.equal(updateLinkSchema.safeParse({ id: 1, url, slug }).success, false);
  }
  assert.equal(updateLinkSchema.safeParse({ id: 1, url: "javascript:alert(1)" }).success, false);
});
