"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CotizacionPage() {
  const searchParams = useSearchParams();
 
  const precioRecibido = searchParams.get("precio") || "";
  const nombreRecibido = searchParams.get("nombre") || "";

  const [costoTotal, setCostoTotal] = useState<string>("");
  const [cuotaInicial, setCuotaInicial] = useState<string>("");
  const [cuotainicialBol, setCuotainicialBol] = useState<string>("");
  const [montoFinanciar, setMontoFinanciar] = useState<number>(0);
  const [monedainicial, setMonedainicial] = useState<string>("Dolares");

  const [plazo, setPlazo] = useState<string>("0");
  const [interes, setInteres] = useState<string>("0");
  const [cuotaMensual, setCuotaMensual] = useState<number | "">("");
  const [tipocredito, setTipocredito] = useState<string>("Bancario");
  

  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [numeroWhatsapp, setNumeroWhatsapp] = useState("");

  // Modifica el precio recibido automáticamente
  useEffect(() => {
    if (precioRecibido) {
      setCostoTotal(precioRecibido);
    }
  }, [precioRecibido]);

  // Limpiar el formulario de acuerdo a la moneda de la cuota inicial
  useEffect(() => {
    if (monedainicial === "Dolares") {
      setCuotainicialBol("");
    } else if (monedainicial === "Bolivianos") {
      setCuotaInicial("");
    }
  }, [monedainicial]);
 
  // Calcular monto a financiar automáticamente
  useEffect(() => {
  // 1. Convertimos los valores a números de forma segura
  const costoTotalNum = costoTotal ? Number(costoTotal) : 0;
  const usdNum = cuotaInicial ? Number(cuotaInicial) : 0;
  const bobNum = cuotainicialBol ? Number(cuotainicialBol) : 0;

  const costoTotalReal = costoTotalNum * 7;
  const cuotaInicialReal = (usdNum * 7) + bobNum;
  const montoAFinanciar = costoTotalReal - cuotaInicialReal;
  setMontoFinanciar(montoAFinanciar > 0 ? montoAFinanciar : 0);

}, [costoTotal, cuotaInicial, cuotainicialBol]); 

  // Modificar el plazo y el interes dependiendo el tipo de crédito:
  // Plazo: Bancario => 84, Directo => 60
  // Interés Bancario => 13.0, Directo => 4.0
  useEffect(() => {
    if (tipocredito === "Bancario") {
      setPlazo("84");
      setInteres("13.0");
    } else if (tipocredito === "Directo") {
      setPlazo("60");
      setInteres("4.0");
    }
  }, [tipocredito]);




  // Cálculo de la cuota mensual aproximada
  const handleCalcular = () => {
    const tasaMensual = Number(interes) / 100 / 12;
    const plazoMeses = plazo;
    const cuota =
      (montoFinanciar * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazoMeses));
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
    setTipocredito("Bancario");
    setMonedainicial("Dolares");
  };

  // Campos calculados
  const costoTotalCalc = costoTotal ? Number(costoTotal) * 7 : "";
  const cuotaInicialCalc = cuotaInicial ? Number(cuotaInicial) * 7 : "";
  const montoFinanciarCalc = montoFinanciar ? montoFinanciar : "";

  // Función para enviar WhatsApp
  const enviarWhatsapp = (business = false) => {
    if (!numeroWhatsapp) return alert("Ingresa un número de WhatsApp");

    const mensaje = 
      `*COTIZACIÓN CRÉDITO * ${tipocredito}\n` +
      `* ${ nombreRecibido }*\n` +
      `* ------------- *\n` +
      `*COSTO TOTAL DEL VEHÍCULO:* $. ${costoTotal || 0} (Bs. ${costoTotal ? Number(costoTotal) * 7 : 0})\n` +
      `*CUOTA INICIAL:* $. ${cuotaInicial || 0} (Bs. ${cuotaInicial ? Number(cuotaInicial) * 7 : 0})\n` +
      `*MONTO A FINANCIAR:* $. ${costoTotal && cuotaInicial ? Number(costoTotal) - Number(cuotaInicial) : 0} (Bs. ${costoTotal && cuotaInicial ? (Number(costoTotal) - Number(cuotaInicial)) * 7 : 0})\n` +
      `*PLAZO:* ${plazo} meses\n` +
      `*INTERÉS %:* ${interes}%\n` +
        `* ------------- *\n` +
      `*CUOTA APROXIMADA Bs.:* *_${cuotaMensual}_*`;

    const url = business
      ? `whatsapp://send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensaje)}`
      : `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
    setShowWhatsappModal(false);
    setNumeroWhatsapp("");
  };

  return (
    <div className="w-full bg-gray-800 flex flex-col md:flex-row gap-4 p-4 mx-auto max-w-7xl">
      {/* Contenedor formulario */}
      <section className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md text-xs"> 
        <h2 className="text-lg font-bold text-center text-blue-800 italic">
          Cotización de Crédito Vehicular 
        </h2>
        <hr className="border-gray-300 mb-4" />
        <form className="flex flex-col gap-2">  
          {/* Selección del tipo de credito que se quiere cotizar 
              y la moneda de la cuota inicial*/}
          <div className="flex flex-col lg:flex-row gap-4 w-full ">
            <div className="flex flex-col gap-4 sm:gap-4 w-full lg:mb-2 text-xs lg:text-sm "> 
              <p className="font-bold text-gray-800">
                Seleccione el Tipo de Crédito
              </p>
              <div className="flex justify-center items-center gap-16  text-gray-800">
                <div className="flex gap-2 items-center">
                  <input 
                    type="radio" 
                    id="creditobancario" 
                    name="tipoCredito" 
                    value="Bancario"
                    checked={tipocredito === "Bancario"}
                    onChange={(e) => setTipocredito(e.target.value)}
                    className="w-4 h-4 accent-red-500 cursor-pointer"/>
                  <label htmlFor="creditobancario">BANCARIO</label>
                </div>
                <div className="flex gap-2 items-center">
                  <input 
                    type="radio" 
                    id="creditodirecto" 
                    name="tipoCredito" 
                    value="Directo"
                    checked={tipocredito === "Directo"}
                    onChange={(e) => setTipocredito(e.target.value)}
                    className="w-4 h-4 accent-red-500 cursor-pointer"/>
                  <label htmlFor="creditodirecto">DIRECTO</label>
                </div>
              </div>
            </div>

           <span className="border-l-2 border-gray-400"></span> 

             <div className="flex flex-col gap-4 sm:gap-4 w-full lg:mb-2 text-xs lg:text-sm "> 
              <p className="font-bold text-gray-800">
                Seleccione la moneda de cuota incial
              </p>
              <div className="flex justify-center items-center gap-16  text-gray-800">
                <div className="flex gap-2 items-center">
                  <input 
                    type="radio" 
                    id="moneda_dolares" 
                    name="Moneda" 
                    value="Dolares"
                    checked={monedainicial === "Dolares"}
                    onChange={(e) => setMonedainicial(e.target.value)}
                    className="w-4 h-4 accent-red-500 cursor-pointer"/>
                  <label htmlFor="creditobancario">DÓLARES</label>
                </div>
                <div className="flex gap-2 items-center">
                  <input 
                    type="radio" 
                    id="moneda_boliviano" 
                    name="moneda" 
                    value="Bolivianos"
                    checked={monedainicial === "Bolivianos"}
                    onChange={(e) => setMonedainicial(e.target.value)}
                    className="w-4 h-4 accent-red-500 cursor-pointer"/>
                  <label htmlFor="creditodirecto">BOLIVIANOS</label>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300 mt-2 mb-2" />

          {/* Costo total */}
          <div className="flex gap-4 w-full mb-2 text-gray-800 font-bold text-xs lg:text-sm ">      
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="costo_total_dolares">
                Costo total (Dólares)
              </label>
              <input
                id="costo_total_dolares"
                type="number"
                placeholder="19000"
                value={costoTotal}
                autoFocus
                onChange={(e) => setCostoTotal(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm box-border font-semibold text-gray-800"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="costo_total_bolivianos" >
                Costo total (Bolivianos)
              </label>
              <input
                id="costo_total_bolivianos"
                type="number"
                value={costoTotalCalc}
                disabled
                className="w-full p-2 border rounded-lg bg-green-300 text-sm box-border font-semibold text-gray-800"
              />
            </div>
          </div>

          {/* Cuota inicial */}
          <div className="flex gap-4 w-full mb-2 text-gray-800 font-bold text-xs lg:text-sm "> 
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="cuota_inicial_dolares">
                Cuota inicial (Dólares)
              </label>
              <input
                id="cuota_inicial_dolares"
                type="number"
                placeholder="1000"
                value={cuotaInicial}
                onChange={(e) => setCuotaInicial(e.target.value)}
                disabled={monedainicial === "Bolivianos"}
                className="w-full p-2 border rounded-lg text-sm box-border font-semibold text-gray-800"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="cuota_inicial_bolivianos">
                Cuota inicial (Bolivianos)
              </label>
              <input
                id="cuota_inicial_bolivianos"
                type="number"
                value={cuotainicialBol}
                onChange={(e) => setCuotainicialBol(e.target.value)}
                 disabled={monedainicial === "Dolares"}
                className="w-full p-2 border rounded-lg bg-green-300 text-sm box-border font-semibold text-gray-800"
              />
            </div>
          </div>

           {/* Monto a Financiar */}
          <div className="flex gap-4 w-full mb-2 text-gray-800 font-bold text-xs lg:text-sm "> 
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="financiamiento_dolares" >
                Monto a financiar (Dólares)
              </label>
              <input
                id="financiamiento_dolares"
                type="number"
                value={costoTotal && cuotaInicial ? Number(costoTotal) - Number(cuotaInicial) : ""}
                disabled
                className="w-full p-2 border rounded-lg bg-blue-300 text-sm box-border font-semibold text-gray-800"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="financiamiento_bolivianos" > 
                Monto a financiar (Bolivianos)
              </label>
              <input
                id="financiamiento_bolivianos"
                type="number"
                value={montoFinanciarCalc}
                disabled
                 className="w-full p-2 border rounded-lg bg-green-300 text-sm box-border font-semibold text-gray-800 "
              
              />
            </div>
          </div>

          {/* plazo e interés */}
          <div className="flex gap-4 w-full mb-2 text-gray-800 font-bold text-xs lg:text-sm "> 
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="plazo" >
                Plazo (Meses)
              </label>
              <input
                id="plazo"
                type="number"
                value={plazo}
                onChange={(e) => setPlazo(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm box-border font-semibold text-gray-800 "
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label htmlFor="interes" > 
                Interés
              </label>
              <input
                id="interes"
                type="number"
                value={interes}
                onChange={(e) => setInteres(e.target.value)}
               className="w-full p-2 border rounded-lg text-sm box-border font-semibold text-gray-800 "
              />
            </div>
          </div>

          {/* Botón Calcular */}
          <div className="flex justify-center">
            <button
            type="button"
              onClick={handleCalcular}
              className="text-sm px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900"
            >
              Calcular
            </button>
          </div>
        </form>
      </section>
     
      {/* Contenedor calculo de la cotizacion*/}
      <section className="max-w-3xl w-full bg-white p-6 rounded-lg shadow-md">
        {/* Resultado */}
        <h2 className="text-lg font-bold text-center text-blue-800 italic">
          Cotización aproximada 
        </h2>
        <hr className="border-gray-300 mb-4" />    

        {/* Contenedor de la tabla para mantener un orden del resultado*/}
        <table className=" w-full">
          <caption className="font-bold text-center text-blue-800 italic mb-2">
            Crédito {tipocredito}  {/* el elemento será intereactivo de acuerdo a que tipo de credito seleccione el cliente */}
          </caption>
          <thead className="text-red-500 text-sm">
            <tr className="[&_th]:p-2 [&_th]:border-b">
              <th className="text-left ">COSTOS</th>
              <th className="text-left">DÓLARES</th>
              <th className="text-left">BOLIVIANOS</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 font-semibold text-sm [&_td]:pb-3 [&_td]:pt-3 [&_td]:pl-2 [&_td]:border-b [&_td]:border-gray-400">
            <tr className="">
              <td>COSTO TOTAL</td>
              <td>$. {costoTotal || 0}</td>
              <td>Bs. {costoTotal ? Number(costoTotal) * 7 : 0}</td>
            </tr>
            <tr >
              <td>CUOTA INICIAL:</td>
              <td>
                $. {monedainicial === "Dolares" 
                    ? (cuotaInicial ? Number(cuotaInicial).toFixed(0) : "0.00") 
                    : (cuotainicialBol ? (Number(cuotainicialBol) / 7).toFixed(0) : "0.00")}
              </td>              
              <td>
                Bs. {monedainicial === "Dolares" 
                    ? (cuotaInicial ? Number(cuotaInicial) * 7 : 0) 
                    : (cuotainicialBol ? cuotainicialBol : 0)}
              </td>
            </tr>
            <tr >
              <td>FINANCIAMIENTO:</td>
              {/* Mostramos el monto de tu estado convertido a Dólares (dividido entre 7) */}
              <td>
                $. {montoFinanciar ? (montoFinanciar / 7).toFixed(0) : "0"}
              </td>              
              {/* Mostramos el monto en Bolivianos directo desde tu estado montoFinanciar */}
              <td>
                Bs. {montoFinanciar ? montoFinanciar : 0}
              </td>
            </tr>
            <tr className=" text-blue-700">
              <td >PLAZO / INTERÉS:</td>
              <td>MESES</td>              
              <td>AÑOS</td>
            </tr>
            <tr className="text-gray-800 font-semibold text-sm pb-2">
              <td>PLAZO:</td>
              <td>{plazo} meses</td>
              <td> {plazo ? Number(plazo) / 12 : 0} años</td>
            </tr>
            <tr className="text-gray-800 font-semibold text-sm pb-2">
              <td >INTERÉS %:</td>
              <td >{interes}%</td>
              <td >Anual</td>
            </tr>
          </tbody>
          <tfoot className="w-full text-gray-800 font-semibold ">
            <tr className="pb-2 bg-green-400 p-2 rounded text-sm [&_td]:p-2  ">
              <td colSpan={2} >CUOTA APROXIMADA MENSUAL:</td>
              <td className="text-lg">Bs. {cuotaMensual}</td>
            </tr>
          </tfoot>
        </table>

      {/* Botones */}
       <div className=" w-full pr-4 pl-4" >                 
          <div className="flex justify-center sm:justify-between mt-6 gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-900 text-white text-sm rounded hover:bg-red-700"
            >
              Resetear
            </button>
            <button
            
              onClick={() => setShowWhatsappModal(true)}
              className="px-4 py-2 bg-green-900 text-white text-sm rounded hover:bg-green-500"
            >
              Enviar
            </button>
          </div>
        </div>
      

      </section>

    
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
