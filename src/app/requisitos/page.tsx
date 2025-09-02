"use client";

import { useMemo, useState } from "react";

// Tipos
type EstadoCivil = "soltero" | "casado";
type Trabajo =
  | "asalariado"
  | "transportistap"
  | "transportistaa"
  | "productor"
  | "negocio"
  | "independiente"
  | "consultor";
type Deudas = "si" | "no";
type Garantia = "patrimonio" | "garante" | "vehicular";

// Opciones y listas estáticas
const RESPALDOS_OPCIONES: { value: Trabajo; label: string }[] = [
  { value: "asalariado", label: "Asalariado" },
  { value: "transportistap", label: "Transportista Propietario" },
  { value: "transportistaa", label: "Transportista Asalariado" },
  { value: "productor", label: "Productores" },
  { value: "negocio", label: "Negocio Propio" },
  { value: "independiente", label: "Trabajador Independiente" },
  { value: "consultor", label: "Consultor" },
];

const DOCS_TRABAJO: Record<Trabajo, string[]> = {
  asalariado: [
    "Fotocopia de las 3 últimas boletas de pago",
    "Fotocopia de extracto GESTORA PÚBLICA",
    "Fotocopia de Contrato de trabajo",
    "Certificado de trabajo",
    "Fotocopia de planilla",
    "Croquis del trabajo",
    "Fotografias en su fuente laboral",
  ],
  transportistap: [
    "Fotocopia de licencia de conducir",
    "Certificado o credencial de sindicato",
    "Fotografía con la herramienta de trabajo",
    "Fotocopia RUAT",
    "Fotocopia SOAT",
    "Fotocopia documento de compra venta",
    "Fotocopia de reconocimiento de firmas",
    "Fotocopia del ultimo impuesto pagado",
  ],
  transportistaa: [
    "Fotocopia de licencia de conducir",
    "Certificado o credencial de sindicato",
    "Fotografía con la herramienta de trabajo",
  ],
  productor: [
    "Fotocopia de carnet de productor",
    "Fotocopia de recibos de venta de producto",
    "Fotocopia de hoja de ruta",
    "Fotografias del cocal y respaldos",
  ],
  negocio: [
    "Fotocopia de NIT",
    "Fotocopia de licencia de funcionamiento",
    "Fotocopia de patente",
    "Fotocopia de carnet de afiliación",
    "Fotocopia de recibos o facturas de materia prima",
    "Cuaderno de registros",
    "Croquis del negocio",
    "Fotografías del negocio",
  ],
  independiente: [
    "Fotocopia de contratos",
    "Fotografías en su fuente laboral o trabajos realizados",
  ],
  consultor: [
    "Fotocopia de contrato",
    "Fotocopia de NIT",
    "Croquis de la fuente laboral",
    "Extracto de aportes GESTORA PÚBLICA",
  ],
};

const DOCS_DEUDAS = [
  "Fotocopia del plan de pagos",
  "Fotocopia de boleta de pago de la deuda",
];

const DOCS_GARANTIA: Record<Garantia, string[]> = {
  patrimonio: [
    "Fotocopia de folio real o documento de compra y venta",
    "Fotocopia de testimonio de propiedad",
    "Fotocopia de contrato de compra y venta",
    "Fotocopia de reconocimiento de firmas",
    "Fotocopia del último impuesto pagado",
  ],
  garante: [
    "Fotocopia de cédula",
    "Croquis de domicilio",
    "Facturas de agua y luz",
    "Fotocopia de folio real o documento de compra y venta",
    "Fotocopia de testimonio de propiedad",
    "Fotocopia de contrato de compra y venta",
    "Fotocopia de reconocimiento de firmas",
    "Fotocopia del último impuesto pagado",
  ],
  vehicular: [
    "Fotocopia de contrato de alquier o anticretico",
    "Fotografías de la fachada del domicilio",
  ],
};

export default function RequisitosPage() {
  // Estados
  const [estadoCivil, setEstadoCivil] = useState<EstadoCivil>("soltero");
  const [respaldosTrabajo, setRespaldosTrabajo] = useState<Trabajo>("asalariado");
  const [deudas, setDeudas] = useState<Deudas>("si");
  const [tipoGarantia, setTipoGarantia] = useState<Garantia>("patrimonio");

  const [showModal, setShowModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [seleccionRespaldos, setSeleccionRespaldos] = useState<string[]>([]);
  const [seleccionGarantia, setSeleccionGarantia] = useState<string[]>([]);

  // Documentos dinámicos
  const docsTrabajoActivos = useMemo(
    () => DOCS_TRABAJO[respaldosTrabajo] ?? [],
    [respaldosTrabajo]
  );
  const docsGarantiaActivos = useMemo(
    () => DOCS_GARANTIA[tipoGarantia] ?? [],
    [tipoGarantia]
  );

  // Handlers
  const handleChangeFiltro = (nuevoFiltro: Trabajo) => {
    setRespaldosTrabajo(nuevoFiltro);
    setSeleccionRespaldos([]); // reset al cambiar tipo
  };

  const toggleSeleccionRespaldos = (item: string) => {
    setSeleccionRespaldos((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleSeleccionGarantia = (item: string) => {
    setSeleccionGarantia((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const generarMensaje = () => {
    let mensaje = "REQUISITOS\n\n";
    mensaje += "DOCUMENTOS PERSONALES\n";
    if (estadoCivil === "soltero") {
      mensaje += "- Fotocopia de carnet\n- Fotocopia de factura de luz y agua\n- Croquis de domicilio\n\n";
    } else {
      mensaje += "- Fotocopia de carnet\n- Fotocopia de carnet de su pareja\n- Fotocopia de factura de luz y agua\n- Croquis de domicilio\n\n";
    }

    if (seleccionRespaldos.length > 0) {
      mensaje += "RESPALDOS DE TRABAJO\n";
      mensaje +=
        RESPALDOS_OPCIONES.find((o) => o.value === respaldosTrabajo)?.label + "\n";
      seleccionRespaldos.forEach((item) => (mensaje += `- ${item}\n`));
      mensaje += "\n";
    }

    if (deudas === "si") {
      mensaje += "DEUDAS BANCARIAS\n";
      DOCS_DEUDAS.forEach((d) => (mensaje += `- ${d}\n`));
      mensaje += "\n";
    }

    if (seleccionGarantia.length > 0) {
      mensaje += "GARANTÍA\n";
      if (tipoGarantia === "patrimonio") mensaje += "PATRIMONIO\n";
      else if (tipoGarantia === "garante") mensaje += "GARANTE\n";
      else if (tipoGarantia === "vehicular") mensaje += "VEHICULAR\n";

      seleccionGarantia.forEach((item) => (mensaje += `- ${item}\n`));
      mensaje += "\n";
    }

    return mensaje;
  };

  const enviarWhatsapp = (business = false) => {
    if (!whatsappNumber) {
      alert("Ingresa un número de WhatsApp");
      return;
    }
    const mensaje = generarMensaje();
    const url = business
      ? `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(mensaje)}`
      : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="bg-white min-h-screen px-8 py-4 sm:px-8 sm:py-4 max-w-lg md:w-3xl mx-auto">
      <h1 className="bg-red-900 text-white text-2xl sm:text-3xl font-bold px-2 py-2 sm:px-4 sm:py-3 rounded mb-4 text-center">
        REQUISITOS
      </h1>

      {/* DOCUMENTOS PERSONALES */}
      <h2 className="text-red-600 text-lg sm:text-2xl font-semibold mb-2">
        DOCUMENTOS PERSONALES
      </h2>
      <fieldset className="flex gap-2 sm:gap-4 mb-3 flex-wrap">
        <label className="flex items-center gap-1 text-blue-950 font-bold">
          <input
            type="radio"
            name="estadoCivil"
            value="soltero"
            checked={estadoCivil === "soltero"}
            onChange={() => setEstadoCivil("soltero")}
          />
          Soltero
        </label>
        <label className="flex items-center gap-1 text-blue-950 font-bold">
          <input
            type="radio"
            name="estadoCivil"
            value="casado"
            checked={estadoCivil === "casado"}
            onChange={() => setEstadoCivil("casado")}
          />
          Casado
        </label>
      </fieldset>

      {estadoCivil === "soltero" && (
        <ul className="list-disc list-inside text-gray-700 mb-3">
          <li>Fotocopia de carnet</li>
          <li>Fotocopia de factura de luz y agua</li>
          <li>Croquis de domicilio</li>
        </ul>
      )}
      {estadoCivil === "casado" && (
        <ul className="list-disc list-inside text-gray-700 mb-3">
          <li>Fotocopia de carnet</li>
          <li>Fotocopia de carnet de su pareja</li>
          <li>Fotocopia de factura de luz y agua</li>
          <li>Croquis de domicilio</li>
        </ul>
      )}

      {/* RESPALDOS DE TRABAJO */}
      <h2 className="text-red-600 text-base sm:text-xl font-semibold mb-2">
        RESPALDOS DE TRABAJO
      </h2>
      <fieldset className="flex flex-wrap gap-2 sm:gap-4 mb-3">
        {RESPALDOS_OPCIONES.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1 text-blue-950 font-bold">
            <input
              type="radio"
              name="respaldosTrabajo"
              value={opt.value}
              checked={respaldosTrabajo === opt.value}
              onChange={() => handleChangeFiltro(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </fieldset>

      {/* Checklists del trabajo seleccionado */}
      {docsTrabajoActivos.length > 0 && (
        <ul className="list-disc list-inside text-gray-700 mb-3">
          {docsTrabajoActivos.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={seleccionRespaldos.includes(item)}
                onChange={() => toggleSeleccionRespaldos(item)}
              />
              {item}
            </li>
          ))}
        </ul>
      )}

      {/* DEUDAS */}
      <h2 className="text-red-600 text-base sm:text-xl font-semibold mb-2">
        EN CASO DE DEUDAS BANCARIAS
      </h2>
      <fieldset className="flex gap-2 sm:gap-4 mb-3">
        <label className="flex items-center gap-1 text-blue-950 font-bold">
          <input
            type="radio"
            name="deudas"
            value="si"
            checked={deudas === "si"}
            onChange={() => setDeudas("si")}
          />
          SI
        </label>
        <label className="flex items-center gap-1 text-blue-950 font-bold">
          <input
            type="radio"
            name="deudas"
            value="no"
            checked={deudas === "no"}
            onChange={() => setDeudas("no")}
          />
          NO
        </label>
      </fieldset>
      {deudas === "si" && (
        <ul className="list-disc list-inside text-gray-700 mb-3">
          {DOCS_DEUDAS.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}

      {/* GARANTÍA */}
      <h2 className="bg-blue-900 text-white text-2xl sm:text-3xl font-bold px-2 py-2 sm:px-4 sm:py-3 rounded mb-4 text-center">
        GARANTÍA
      </h2>
      <p className="text-gray-700 mb-2 font-bold italic text-sm sm:text-base">
        Se puede trabajar con una de las 3 opciones:
      </p>
      <fieldset className="mb-3 flex flex-col gap-2">
        <label className="flex items-center gap-2 text-blue-950 font-bold">
          <input
            type="radio"
            name="garantia"
            value="patrimonio"
            checked={tipoGarantia === "patrimonio"}
            onChange={() => {
              setTipoGarantia("patrimonio");
              setSeleccionGarantia([]);
            }}
          />
          Patrimonio (casa, departamento, terreno)
        </label>
        <label className="flex items-center gap-2 text-blue-950 font-bold">
          <input
            type="radio"
            name="garantia"
            value="garante"
            checked={tipoGarantia === "garante"}
            onChange={() => {
              setTipoGarantia("garante");
              setSeleccionGarantia([]);
            }}
          />
          Garante Personal (casa, departamento, terreno)
        </label>
        <label className="flex items-center gap-2 text-blue-950 font-bold">
          <input
            type="radio"
            name="garantia"
            value="vehicular"
            checked={tipoGarantia === "vehicular"}
            onChange={() => {
              setTipoGarantia("vehicular");
              setSeleccionGarantia([]);
            }}
          />
          Vehicular
        </label>
      </fieldset>

      {/* Checklists de garantía */}
      {tipoGarantia === "patrimonio" && (
        <ul className="list-none list-inside text-gray-700 mb-3">
          <h3 className="text-red-600 text-base sm:text-xl font-semibold mb-1">
            PATRIMONIO
          </h3>
          {docsGarantiaActivos.map((item) => (
            <li key={item}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={seleccionGarantia.includes(item)}
                  onChange={() => toggleSeleccionGarantia(item)}
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}

      {tipoGarantia === "garante" && (
        <ul className="list-none list-inside text-gray-700 mb-3">
          <h3 className="text-red-600 text-base sm:text-xl font-semibold mb-1">
            GARANTE
          </h3>
          {docsGarantiaActivos.map((item) => (
            <li key={item}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={seleccionGarantia.includes(item)}
                  onChange={() => toggleSeleccionGarantia(item)}
                />
                {item}
              </label>
            </li>
          ))}
        </ul>
      )}

      {tipoGarantia === "vehicular" && (
        <ul className="list-none list-inside text-gray-700 mb-3">
          <h3 className="text-red-600 text-base sm:text-xl font-semibold mb-1">
            VEHICULAR
          </h3>
          {docsGarantiaActivos.map((item) => (
            <li key={item}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={seleccionGarantia.includes(item)}
                  onChange={() => toggleSeleccionGarantia(item)}
                />
                {item}
              </label>
            </li>
          ))}
          <p className="text-gray-700 mb-3 text-xs sm:text-sm">
            Para este caso se quedarían en custodia los papeles de la movilidad en el banco.
          </p>
        </ul>
      )}

      {/* Botón ENVIAR */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-green-700 text-white rounded hover:bg-green-500 text-base font-semibold"
        >
          ENVIAR
        </button>
      </div>

      {/* Modal con 3 botones */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-xs sm:max-w-md">
            <h2 className="text-lg font-bold mb-3 text-red-950">Enviar por WhatsApp</h2>
            <input
              type="text"
              placeholder="Número de WhatsApp (ej: 59170123456)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full border p-2 rounded mb-3 text-blue-950 font-bold"
            />
            <div className="flex justify-between w-full">
             {/*  <button
                onClick={() => enviarWhatsapp(false)}
                className="px-2 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Enviar con WhatsApp
              </button> */}
              <button
                onClick={() => enviarWhatsapp(true)}
                className="px-2 py-2 bg-green-950 text-white rounded hover:bg-green-800"
              >
                Enviar con WhatsApp 
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-700"
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
