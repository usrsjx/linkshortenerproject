import assert from "node:assert/strict";
import { mock, test } from "node:test";

test("custom slugs are inserted once, conflicts are reported, and generated slugs retry", async () => {
  process.env.DATABASE_URL = "postgresql://test:test@localhost/test";
  const { createLink } = await import("../data/links");
  const requests: { query: string; params: string[] }[] = [];
  const conflicts = new Set(["taken"]);
  let generatedCollision = false;

  const fakeFetch: typeof fetch = async (_input, init) => {
    if (typeof init?.body !== "string") {
      throw new Error("Expected a JSON request body");
    }
    const request: { query: string; params: string[] } = JSON.parse(init.body);
    requests.push(request);
    const shortCode = request.params[1];
    assert.match(request.query, /on conflict \("short_code"\) do nothing/i);

    let conflict = conflicts.has(shortCode);
    if (shortCode !== "custom-slug" && shortCode !== "taken" && !generatedCollision) {
      generatedCollision = true;
      conflict = true;
    }

    return new Response(JSON.stringify({
      fields: [{ name: "short_code", dataTypeID: 25 }],
      rows: conflict ? [] : [[shortCode]],
      rowCount: conflict ? 0 : 1,
      command: "INSERT",
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  const fetchMock = mock.method(globalThis, "fetch", fakeFetch);

  try {
    assert.equal(await createLink("user", "https://example.com/", "custom-slug"), "custom-slug");
    assert.equal(await createLink("user", "https://example.com/", "taken"), null);
    assert.equal(requests.length, 2);

    const generated = await createLink("user", "https://example.com/");
    if (generated === null) {
      throw new Error("Expected a generated short code");
    }
    assert.match(generated, /^[A-Za-z0-9_-]{12}$/);
    assert.equal(requests.length, 4);
    assert.equal(requests[3].params[1], generated);
    assert.notEqual(requests[2].params[1], generated);
  } finally {
    fetchMock.mock.restore();
  }
});
