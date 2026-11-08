import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLinksByUserId } from "@/data/links";
import { CreateLinkDialog } from "./create-link-dialog";

async function ProtectedDashboard() {
  const { userId } = await auth.protect();
  const userLinks = await getLinksByUserId(userId);

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
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
                      render={<a href={`/${link.shortCode}`} />}
                    >
                      /{link.shortCode}
                    </Button>
                  </CardTitle>
                  <CardDescription className="break-all">
                    {link.url}
                  </CardDescription>
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
