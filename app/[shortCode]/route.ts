import { connection } from "next/server";
import { getLinkByShortCode } from "@/data/links";
import { destinationUrlSchema } from "@/lib/link-validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  await connection();
  const { shortCode } = await params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return new Response("Link not found.", { status: 404 });
  }

  const destination = destinationUrlSchema.safeParse(link.url);
  if (!destination.success) {
    console.error("A stored link has an invalid destination URL.");
    return new Response("This link has an invalid destination.", { status: 500 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination.data,
      "Cache-Control": "no-store",
    },
  });
}
