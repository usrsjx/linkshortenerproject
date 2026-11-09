import { z } from "zod";

export const destinationUrlSchema = z
  .string()
  .trim()
  .max(2048, "The URL must be at most 2048 characters.")
  .url("Enter a valid HTTP or HTTPS URL.")
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return (
          (url.protocol === "http:" || url.protocol === "https:") &&
          !url.username &&
          !url.password
        );
      } catch {
        return false;
      }
    },
    "Enter an HTTP or HTTPS URL without credentials.",
  )
  .transform((value) => new URL(value).href)
  .pipe(z.string().max(2048, "The normalized URL must be at most 2048 characters."));

export const slugSchema = z
  .string()
  .trim()
  .max(64, "The slug must be at most 64 characters.")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
    "The slug must start with a letter or number and contain only letters, numbers, hyphens, and underscores.",
  );

export const createLinkSchema = z.object({
  url: destinationUrlSchema,
  slug: z.string().trim().transform((value) => value || undefined).pipe(slugSchema.optional()).optional(),
});

export const linkIdSchema = z.object({
  id: z.number().int().positive().max(2147483647),
});

export const updateLinkSchema = linkIdSchema.extend({
  url: destinationUrlSchema,
  slug: slugSchema.optional(),
});
