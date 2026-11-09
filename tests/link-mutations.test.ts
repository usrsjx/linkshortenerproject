import assert from "node:assert/strict";
import { mock, test } from "node:test";

test("updates and deletes use owner and id, and report missing rows and slug conflicts", async () => {
  process.env.DATABASE_URL = "postgresql://test:test@localhost/test";
  const { updateLink, deleteLink } = await import("../data/links");
  const requests: { query: string; params: string[] }[] = [];
  let response: "found" | "missing" | "conflict" | "failure" = "found";

  const fakeFetch: typeof fetch = async (_input, init) => {
    if (typeof init?.body !== "string") throw new Error("Expected a JSON request body");
    const request: { query: string; params: string[] } = JSON.parse(init.body);
    requests.push(request);
    if (response === "conflict" || response === "failure") {
      return Response.json({
        message: "Database error",
        code: response === "conflict" ? "23505" : "08006",
        constraint: response === "conflict" ? "links_short_code_unique" : undefined,
      }, { status: 400 });
    }
    return Response.json({
      fields: [{ name: "id", dataTypeID: 23 }],
      rows: response === "found" ? [[42]] : [],
      rowCount: response === "found" ? 1 : 0,
      command: request.query.startsWith("update") ? "UPDATE" : "DELETE",
    });
  };
  const fetchMock = mock.method(globalThis, "fetch", fakeFetch);
  try {
    assert.equal(await updateLink("owner", 42, "https://example.com/", "new-slug"), "updated");
    assert.match(requests[0].query, /where \(\("links"\."id" = \$\d+\) and \("links"\."user_id" = \$\d+\)\)/i);
    assert.ok(requests[0].params.includes("owner"));
    assert.ok(requests[0].params.includes("new-slug"));

    assert.equal(await updateLink("owner", 42, "https://example.com/"), "updated");
    assert.doesNotMatch(requests[1].query, /"short_code"\s*=/i);

    response = "missing";
    assert.equal(await updateLink("other-owner", 42, "https://example.com/"), "not-found");
    assert.equal(await deleteLink("other-owner", 42), false);
    assert.match(requests[3].query, /where \(\("links"\."id" = \$\d+\) and \("links"\."user_id" = \$\d+\)\)/i);
    assert.ok(requests[3].params.includes("other-owner"));

    response = "found";
    assert.equal(await deleteLink("owner", 42), true);

    response = "conflict";
    assert.equal(await updateLink("owner", 42, "https://example.com/", "taken"), "slug-taken");

    response = "failure";
    await assert.rejects(updateLink("owner", 42, "https://example.com/"));
    await assert.rejects(deleteLink("owner", 42));
  } finally {
    fetchMock.mock.restore();
  }
});
