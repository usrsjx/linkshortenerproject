import { randomBytes } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLink(userId: string, url: string, slug?: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const shortCode = slug ?? randomBytes(9).toString("base64url");
    const inserted = await db
      .insert(links)
      .values({ userId, url, shortCode })
      .onConflictDoNothing({ target: links.shortCode })
      .returning({ shortCode: links.shortCode });

    if (inserted.length > 0) {
      return inserted[0].shortCode;
    }
    if (slug !== undefined) {
      return null;
    }
  }

  throw new Error("Could not generate a unique short code");
}

export async function getLinksByUserId(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

export async function getLinkByShortCode(shortCode: string) {
  const result = await db
    .select({ url: links.url })
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return result[0];
}
