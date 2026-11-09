"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLinkAction } from "./actions";

export function CreateLinkDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    submitting.current = true;
    setPending(true);
    setMessage("");
    try {
      const result = await createLinkAction({ url, slug });
      if ("error" in result) {
        setMessage(result.error);
      } else if (result.warning) {
        setUrl("");
        setSlug("");
        setMessage(result.warning);
      } else {
        setUrl("");
        setSlug("");
        setOpen(false);
        router.refresh();
      }
    } catch {
      setMessage("The request failed. Check your connection and refresh the dashboard before retrying.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (submitting.current) return;
        setOpen(nextOpen);
        if (!nextOpen) {
          setUrl("");
          setSlug("");
          setMessage("");
        }
      }}
    >
      <DialogTrigger render={<Button />}>+ Create link</DialogTrigger>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Create a short link</DialogTitle>
          <DialogDescription>
            Enter the HTTP or HTTPS URL you want to share.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination-url">Destination URL</Label>
            <Input
              id="destination-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              maxLength={2048}
              required
              disabled={pending}
              aria-describedby={message ? "create-link-message" : undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-slug">Custom slug (optional)</Label>
            <Input
              id="link-slug"
              placeholder="my-link"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              maxLength={64}
              disabled={pending}
              aria-describedby={message ? "slug-help create-link-message" : "slug-help"}
            />
            <p id="slug-help" className="text-sm text-muted-foreground">
              Your short link will use /l/ followed by this slug. Leave blank to generate one automatically. Start with a letter or number; use only letters, numbers, hyphens, or underscores.
            </p>
          </div>
          {message && (
            <p id="create-link-message" role="alert" className="text-sm text-destructive">
              {message}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => {
                setOpen(false);
                setUrl("");
                setSlug("");
                setMessage("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
