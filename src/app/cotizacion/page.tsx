"use client";

import { Suspense } from "react";

import CotizacionClient from "./CotizacionClient";



export default function CotizacionPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CotizacionClient />
    </Suspense>
  );
}
