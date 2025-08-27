"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CotizacionPage() {
  const searchParams = useSearchParams();
  const precioRecibido = searchParams.get("precio") || "";

  const [costoTotal, setCostoTotal] = useState<string>("");
  const [cuotaInicial, setCuotaInicial] = useState<string>("");
  const [montoFinanciar, setMontoFinanciar] = useState<number>(0);
  const [plazo, setPlazo] = useState<number>(72);
  const [interes, setInteres] = useState<number>(14.0);
  const [cuotaMensual, setCuotaMensual] = useState<number | "">("");

  // ✅ Si recibimos precio, lo colocamos en el input automáticamente
  useEffect(() => {
    if (precioRecibido) {
      setCostoTotal(precioRecibido);
    }
  }, [precioRecibido]);

  // ✅ Calcular monto a financiar automáticamente
  useEffect(() => {
    const costoTotalReal = costoTotal ? Number(costoTotal) * 7 : 0;
    const cuotaInicialReal = cuotaInicial ? Number(cuotaInicial) * 7 : 0;
    const montoAFinanciar = costoTotalReal - cuotaInicialReal;

    setMontoFinanciar(montoAFinanciar > 0 ? montoAFinanciar : 0);
  }, [costoTotal, cuotaInicial]);

  const handleCalcular = () => {
    const tasaMensual = interes / 100 / 12;
    const plazoMeses = plazo;
    const cuota =
      (montoFinanciar * tasaMensual) /
        (1 - Math.pow(1 + tasaMensual, -plazoMeses)) -
      200;

    setCuotaMensual(Math.round(cuota)); // ✅ sin decimales
  };

  const handleReset = () => {
    setCostoTotal("");
    setCuotaInicial("");
    setMontoFinanciar(0);
    setPlazo(72);
    setInteres(14.0);
    setCuotaMensual("");
  };

  // Campos calculados
  const costoTotalCalc = costoTotal ? Number(costoTotal) * 7 : "";
  const cuotaInicialCalc = cuotaInicial ? Number(cuotaInicial) * 7 : "";
  const montoFinanciarCalc = montoFinanciar ? montoFinanciar : "";

  return (
    <div className="min-h-screen bg-gray-300 flex flex-col items-center p-4">
      {/* Contenedor formulario */}
      <div className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md grid">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800 italic">
          Cotización
        </h1>

        <div className="flex flex-col gap-2 ms:gap-3 md:gap-4">
          {/* Costo Total */}
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <label className="w-full sm:w-1/2 italic text-gray-800 font-bold">Costo total</label>
            <label className="w-full sm:w-1/2 font-bold text-green-900 italic">
              C.T. bolivianos
            </label>
          </div>
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <input
              type="number"
              placeholder="Costo Total"
              value={costoTotal}
              onChange={(e) => setCostoTotal(e.target.value)}
              className="w-full sm:w-1/2 p-3 border rounded box-border font-semibold text-gray-800  "
            />
            <input
              type="number"
              value={costoTotalCalc}
              disabled
              className="w-full sm:w-1/2 p-3 border rounded bg-green-300 box-border font-bold text-gray-800"
            />
          </div>

          {/* Cuota Inicial */}
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <label className="w-full sm:w-1/2 italic text-gray-800 font-bold">Cuota inicial</label>
            <label className="w-full sm:w-1/2 font-bold text-green-900 italic">
              C.I. bolivianos
            </label>
          </div>
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full text-gray-800">
            <input
              type="number"
              placeholder="Cuota Inicial"
              value={cuotaInicial}
              onChange={(e) => setCuotaInicial(e.target.value)}
              className="w-full sm:w-1/2 p-3 border rounded box-border font-semibold"
            />
            <input
              type="number"
              value={cuotaInicialCalc}
              disabled
              className="w-full sm:w-1/2 p-3 border rounded bg-green-300 box-border font-bold"
            />
          </div>

          {/* Monto a Financiar */}
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <label className="w-full sm:w-1/2 italic text-gray-800 font-bold">Financiamiento</label>
            <label className="w-full sm:w-1/2 font-bold text-green-900 italic">
              F. bolivianos
            </label>
          </div>
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <input
              type="number"
              value={costoTotal && cuotaInicial ? Number(costoTotal) - Number(cuotaInicial) : ""}
              disabled
              className="w-full sm:w-1/2 p-3 border rounded bg-blue-300 box-border font-bold text-gray-800"
            />
            <input
              type="number"
              value={montoFinanciarCalc}
              disabled
              className="w-full sm:w-1/2 p-3 border rounded bg-green-300 box-border font-bold text-gray-800"
            />
          </div>

          {/* Plazo e interés */}
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <label className="w-full sm:w-1/2 italic text-gray-800 font-bold">Plazo (Meses)</label>
            <label className="w-full sm:w-1/2 italic text-gray-800 font-bold">Interés %</label>
          </div>
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <input
              type="number"
              value={plazo}
              onChange={(e) => setPlazo(Number(e.target.value))}
              className="w-full sm:w-1/2 p-3 border rounded font-bold text-gray-800"
            />
            <input
              type="number"
              value={interes}
              onChange={(e) => setInteres(Number(e.target.value))}
              className="w-full sm:w-1/2 p-3 border rounded font-bold text-gray-800"
            />
          </div>

          {/* Botón Calcular */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleCalcular}
              className="text-xl px-12 py-3 bg-violet-500 text-white rounded hover:bg-green-600"
            >
              Calcular
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Resultado en cuadro separado */}
      {cuotaMensual && (
        <div className="max-w-3xl w-full bg-white p-6 mt-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4 italic">
            Cuota mensual <span className="text-red-900">APROXIMADA</span>
          </h2>
          <p className="text-green-800 text-3xl font-bold italic">
            Bs. {cuotaMensual}
          </p>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleReset}
              className="px-8 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Resetear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
