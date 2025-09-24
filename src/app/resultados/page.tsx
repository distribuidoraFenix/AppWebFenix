"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ResultadosClient from "./ResultadosClient";

export default function ResultadosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirige al login si no hay usuario
    }
  }, [user, loading, router]);

  if (loading || !user) return null; // Mientras carga o redirige, no renderiza nada

  return <ResultadosClient />;
}
