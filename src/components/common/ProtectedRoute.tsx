"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
  console.log("ProtectedRoute", { loading, user });

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">
        Verificando sesión...
      </p>
    </div>
  );
}

  return <>{children}</>;
}