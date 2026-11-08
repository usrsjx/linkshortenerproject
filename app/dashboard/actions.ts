"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createLink } from "@/data/links";
import { createLinkSchema } from "@/lib/link-validation";

type CreateLinkResult =
  | { success: true; warning?: string }
  | { error: string; status?: 401 };

export async function createLinkAction(input: {
  url: string;
  slug?: string;
}): Promise<CreateLinkResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "Please sign in to create a link.", status: 401 };
    }

    const parsed = createLinkSchema.safeParse(input);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Enter a valid URL.",
      };
    }

    const shortCode = await createLink(userId, parsed.data.url, parsed.data.slug);
    if (shortCode === null) {
      return { error: "This slug is already in use. Please choose another." };
    }
  } catch (error) {
    console.error("Failed to create link.", {
      errorType: error instanceof Error ? error.name : typeof error,
    });
    return { error: "Could not create the link. Please try again." };
  }

  try {
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to refresh dashboard after creating link.", {
      errorType: error instanceof Error ? error.name : typeof error,
    });
    return {
      success: true,
      warning: "Link created, but the dashboard could not be refreshed. Reload the page to see it.",
    };
  }

  return { success: true };
}
