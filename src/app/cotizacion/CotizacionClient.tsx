"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CotizacionPage() {
  const searchParams = useSearchParams();
  const precioRecibido = searchParams.get("precio") || "";

  const [costoTotal, setCostoTotal] = useState<string>("");
  const [cuotaInicial, setCuotaInicial] = useState<string>("");
  const [montoFinanciar, setMontoFinanciar] = useState<number>(0);
  const [plazo, setPlazo] = useState<string>("84");
  const [interes, setInteres] = useState<string>("13.0");
  const [cuotaMensual, setCuotaMensual] = useState<number | "">("");

  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [numeroWhatsapp, setNumeroWhatsapp] = useState("");

  // Coloca el precio recibido automáticamente
  useEffect(() => {
    if (precioRecibido) {
      setCostoTotal(precioRecibido);
    }
  }, [precioRecibido]);

  // Calcular monto a financiar automáticamente
  useEffect(() => {
    const costoTotalReal = costoTotal ? Number(costoTotal) * 7 : 0;
    const cuotaInicialReal = cuotaInicial ? Number(cuotaInicial) * 7 : 0;
    const montoAFinanciar = costoTotalReal - cuotaInicialReal;
    setMontoFinanciar(montoAFinanciar > 0 ? montoAFinanciar : 0);
  }, [costoTotal, cuotaInicial]);

  const handleCalcular = () => {
    const tasaMensual = Number(interes) / 100 / 12;
    const plazoMeses = plazo;
    const cuota =
      (montoFinanciar * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses)) - 200;
    setCuotaMensual(Math.round(cuota)); // sin decimales
  };

  const handleReset = () => {
    setCostoTotal("");
    setCuotaInicial("");
    setMontoFinanciar(0);
    setPlazo("84");
    setInteres("13.0");
    setCuotaMensual("");
    setShowWhatsappModal(false);
    setNumeroWhatsapp("");
  };

  // Campos calculados
  const costoTotalCalc = costoTotal ? Number(costoTotal) * 7 : "";
  const cuotaInicialCalc = cuotaInicial ? Number(cuotaInicial) * 7 : "";
  const montoFinanciarCalc = montoFinanciar ? montoFinanciar : "";

  // Función para enviar WhatsApp
  const enviarWhatsapp = (business = false) => {
    if (!numeroWhatsapp) return alert("Ingresa un número de WhatsApp");

    const mensaje = 
      `*COTIZACIÓN CREDITO BANCARIO*\n` +
      `* *\n` +

      `*COSTO TOTAL DEL VEHÍCULO:* $. ${costoTotal || 0}\n` +
      `*CUOTA INICIAL:* $. ${cuotaInicial || 0} (Bs. ${cuotaInicial ? Number(cuotaInicial) * 7 : 0})\n` +
      `*MONTO A FINANCIAR:* $. ${costoTotal && cuotaInicial ? Number(costoTotal) - Number(cuotaInicial) : 0} (Bs. ${costoTotal && cuotaInicial ? (Number(costoTotal) - Number(cuotaInicial)) * 7 : 0})\n` +
      `*PLAZO:* ${plazo} meses\n` +
      `*INTERÉS %:* ${interes}%\n` +
      `*CUOTA APROXIMADA Bs.:* *_${cuotaMensual}_*`;

    const url = business
      ? `whatsapp://send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`
      : `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
    setShowWhatsappModal(false);
    setNumeroWhatsapp("");
  };

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
            <label className="w-full sm:w-1/2 font-bold text-green-900 italic">C.T. bolivianos</label>
          </div>
          <div className="flex flex-col-2 sm:flex-row gap-2 items-center w-full">
            <input
              type="number"
              placeholder="Costo Total"
              value={costoTotal}
              onChange={(e) => setCostoTotal(e.target.value)}
              className="w-full sm:w-1/2 p-3 border rounded box-border font-semibold text-gray-800"
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
            <label className="w-full sm:w-1/2 font-bold text-green-900 italic">C.I. bolivianos</label>
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
            <label className="w-full sm:w-1/2 font-bold text-green-900 italic">F. bolivianos</label>
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
              onChange={(e) => setPlazo(String(e.target.value))}
              className="w-full sm:w-1/2 p-3 border rounded font-bold text-gray-800"
            />
            <input
              type="number"
              value={interes}
              onChange={(e) => setInteres(String(e.target.value))}
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

      {/* Resultado */}
      {cuotaMensual && (
        <div className="max-w-sm w-full bg-white p-6 mt-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-center text-blue-800 mb-6">COTIZACIÓN APROXIMADA</h2>
          {/* Detalles intactos */}
          <div className="flex flex-col gap-3 text-gray-800 font-semibold">
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>COSTO TOTAL:</span>
              <span>$. {costoTotal || 0}</span>
            </div>            
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <span>CUOTA INICIAL:</span>
              <div className="flex flex-col items-end">
                <div>
                  <span>$. {cuotaInicial}</span>
                </div>
                <div>
                   <span>(Bs. {cuotaInicial ? Number(cuotaInicial) * 7 : 0})</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <span>FINANCIAMIENTO:</span>
              <div className="flex flex-col items-end">
                <div>
                  <span>$. {costoTotal && cuotaInicial ? Number(costoTotal) - Number(cuotaInicial) : 0}</span>
                </div>
                <div>
                  <span>(Bs. {costoTotal && cuotaInicial ? (Number(costoTotal) - Number(cuotaInicial)) * 7 : 0})</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>PLAZO:</span>
              <span>{plazo} meses</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>INTERÉS %:</span>
              <span>{interes}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2 bg-green-400 p-2 rounded">
              <span>CUOTA MENSUAL:</span>
              <span>Bs. {cuotaMensual}</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-center sm:justify-between mt-6 gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-red-900 text-white rounded hover:bg-red-700"
            >
              Resetear
            </button>
            <button
              onClick={() => setShowWhatsappModal(true)}
              className="px-6 py-2 bg-green-900 text-white rounded hover:bg-green-500"
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Modal de WhatsApp */}
      {showWhatsappModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4 text-center text-gray-600"> Enviar por WhatsApp</h3>

            <input
              type="text"
              placeholder="Número de WhatsApp"
              value={numeroWhatsapp}
              onChange={(e) => setNumeroWhatsapp(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded mb-4 text-gray-600 font-bold"
            />

            <div className="flex flex-col gap-2">
              {/* <button
                onClick={() => enviarWhatsapp(false)}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Enviar Normal
              </button> */}
              <button
                onClick={() => enviarWhatsapp(true)}
                className="w-full px-4 py-2 bg-green-800 text-white rounded hover:bg-green-600"
              >
                Enviar Business
              </button>
              <button
                onClick={() => setShowWhatsappModal(false)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
