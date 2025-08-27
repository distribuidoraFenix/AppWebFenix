// app/resultados/page.tsx
import { Suspense } from "react";
import ResultadosClient from "@/app/resultados/ResultadosClient";

export default function ResultadosPage() {
  return (
    <Suspense fallback={<p className="p-4">Cargando resultados...</p>}>
      <ResultadosClient />
    </Suspense>
  );
}
