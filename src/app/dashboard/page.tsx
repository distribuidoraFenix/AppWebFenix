// app/dashboard/page.tsx
// 🟢 SERVER COMPONENT PURO (Sin "use client")

export const dynamic = "force-dynamic";
export const revalidate = 0;

import ProtectedRoute from "@/components/common/ProtectedRoute";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardClient />
    </ProtectedRoute>
  );
}
