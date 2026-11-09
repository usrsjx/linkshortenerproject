"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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
import { getShortLinkPath } from "@/lib/short-link";
import { deleteLinkAction } from "./actions";

export function DeleteLinkDialog({ id, shortCode }: { id: number; shortCode: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const submitting = useRef(false);

  function changeOpen(nextOpen: boolean) {
    if (submitting.current) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      if (completed) router.refresh();
      setMessage("");
      setCompleted(false);
    }
  }

  async function handleDelete() {
    if (submitting.current || completed) return;
    submitting.current = true;
    setPending(true);
    setMessage("");
    try {
      const result = await deleteLinkAction({ id });
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
      <DialogTrigger render={<Button variant="destructive" size="icon" aria-label={`Delete link ${getShortLinkPath(shortCode)}`} />}>
        <Trash2 aria-hidden="true" />
      </DialogTrigger>
      <DialogContent showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Delete link?</DialogTitle>
          <DialogDescription>
            Delete {getShortLinkPath(shortCode)}? The short link will stop working. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
        <DialogFooter>
          <Button variant="outline" disabled={pending} onClick={() => changeOpen(false)}>
            {completed ? "Close" : "Cancel"}
          </Button>
          {!completed && (
            <Button variant="destructive" disabled={pending} onClick={handleDelete}>
              {pending ? "Deleting..." : "Delete link"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
