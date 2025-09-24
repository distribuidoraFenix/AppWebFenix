"use client";

import { Suspense } from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import CotizacionClient from "./CotizacionClient";

export default function CotizacionPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-500">Cargando...</div>}>
        <CotizacionClient />
      </Suspense>
    </ProtectedRoute>
  );
}
