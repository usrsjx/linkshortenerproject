import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";

async function ProtectedDashboard() {
  await auth.protect();

  return <h1>Dashboard</h1>;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <ProtectedDashboard />
    </Suspense>
  );
}
