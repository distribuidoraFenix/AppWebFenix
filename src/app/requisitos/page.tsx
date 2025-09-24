"use client";

import RequisitosClient from "./RequisitosClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequisitosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirige al login si no hay usuario
    }
  }, [user, loading, router]);

  if (loading || !user) return null; // Mientras carga o redirige, no renderiza nada

  return <RequisitosClient />;
}
