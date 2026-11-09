"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
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
import { getShortLinkPath } from "@/lib/short-link";
import { updateLinkAction } from "./actions";

export function EditLinkDialog({ id, url: initialUrl, shortCode }: {
  id: number;
  url: string;
  shortCode: string;
}) {
  const router = useRouter();
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(initialUrl);
  const [slug, setSlug] = useState(shortCode);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const submitting = useRef(false);

  function changeOpen(nextOpen: boolean) {
    if (submitting.current) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      if (completed) router.refresh();
      setUrl(initialUrl);
      setSlug(shortCode);
      setMessage("");
      setCompleted(false);
    }
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || completed) return;
    submitting.current = true;
    setPending(true);
    setMessage("");
    try {
      const result = await updateLinkAction({
        id,
        url,
        ...(slug === shortCode ? {} : { slug }),
      });
      if ("error" in result) {
        setMessage(result.error);
      } else if (result.warning) {
        setCompleted(true);
        setMessage(result.warning);
      } else {
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
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger render={<Button variant="outline" size="icon" aria-label={`Edit link ${getShortLinkPath(shortCode)}`} />}>
        <Pencil aria-hidden="true" />
      </DialogTrigger>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>
            Change the destination or slug. Changing the slug stops the old short link from working.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${fieldId}-url`}>Destination URL</Label>
            <Input
              id={`${fieldId}-url`}
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              maxLength={2048}
              required
              disabled={pending || completed}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${fieldId}-slug`}>Slug</Label>
            <Input
              id={`${fieldId}-slug`}
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              maxLength={64}
              required
              disabled={pending || completed}
              aria-describedby={`${fieldId}-slug-help`}
            />
            <p id={`${fieldId}-slug-help`} className="text-sm text-muted-foreground">
              New slugs must start with a letter or number and use only letters, numbers, hyphens, or underscores.
            </p>
          </div>
          {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={pending} onClick={() => changeOpen(false)}>
              {completed ? "Close" : "Cancel"}
            </Button>
            {!completed && <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save changes"}</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
