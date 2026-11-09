import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLinksByUserId } from "@/data/links";
import { getShortLinkPath } from "@/lib/short-link";
import { CreateLinkDialog } from "./create-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";

const createdAtFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "UTC",
});

async function ProtectedDashboard() {
  const { userId } = await auth.protect();
  const userLinks = await getLinksByUserId(userId);

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">My Links</h1>
        <CreateLinkDialog />
      </div>
      {userLinks.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t created any links yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {userLinks.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Button
                      variant="link"
                      className="h-auto p-0"
                      render={<a href={getShortLinkPath(link.shortCode)} />}
                    >
                      {getShortLinkPath(link.shortCode)}
                    </Button>
                  </CardTitle>
                  <CardAction className="flex gap-2">
                    <EditLinkDialog id={link.id} url={link.url} shortCode={link.shortCode} />
                    <DeleteLinkDialog id={link.id} shortCode={link.shortCode} />
                  </CardAction>
                  <CardDescription className="break-all">
                    {link.url}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground">
                    Created at:{" "}
                    <time dateTime={link.createdAt.toISOString()}>
                      {createdAtFormatter.format(link.createdAt)} UTC
                    </time>
                  </p>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <ProtectedDashboard />
    </Suspense>
  );
}
