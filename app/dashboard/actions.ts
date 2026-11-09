"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createLink, deleteLink, updateLink } from "@/data/links";
import { createLinkSchema, linkIdSchema, updateLinkSchema } from "@/lib/link-validation";

type LinkActionResult =
  | { success: true; warning?: string }
  | { error: string; status?: 401 };

export async function createLinkAction(input: {
  url: string;
  slug?: string;
}): Promise<LinkActionResult> {
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

export async function updateLinkAction(input: {
  id: number;
  url: string;
  slug?: string;
}): Promise<LinkActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in to edit a link.", status: 401 };

    const parsed = updateLinkSchema.safeParse(input);
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Invalid link details." };
    }

    const result = await updateLink(userId, parsed.data.id, parsed.data.url, parsed.data.slug);
    if (result === "not-found") return { error: "Link not found. Refresh the dashboard and try again." };
    if (result === "slug-taken") return { error: "This slug is already in use. Please choose another." };
  } catch (error) {
    console.error("Failed to update link.", {
      errorType: error instanceof Error ? error.name : typeof error,
    });
    return { error: "Could not update the link. Please try again." };
  }

  try {
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to refresh dashboard after updating link.", {
      errorType: error instanceof Error ? error.name : typeof error,
    });
    return { success: true, warning: "Link updated, but the dashboard could not be refreshed. Reload the page to see it." };
  }
  return { success: true };
}

export async function deleteLinkAction(input: { id: number }): Promise<LinkActionResult> {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in to delete a link.", status: 401 };

    const parsed = linkIdSchema.safeParse(input);
    if (!parsed.success) return { error: "Invalid link." };

    if (!await deleteLink(userId, parsed.data.id)) {
      return { error: "Link not found. Refresh the dashboard and try again." };
    }
  } catch (error) {
    console.error("Failed to delete link.", {
      errorType: error instanceof Error ? error.name : typeof error,
    });
    return { error: "Could not delete the link. Please try again." };
  }

  try {
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to refresh dashboard after deleting link.", {
      errorType: error instanceof Error ? error.name : typeof error,
    });
    return { success: true, warning: "Link deleted, but the dashboard could not be refreshed. Reload the page to see it." };
  }
  return { success: true };
}
