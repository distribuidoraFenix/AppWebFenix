"use client";
import { useState, useRef } from "react";

interface AdvancedFilterProps {
  brands: { id: number; name: string }[];
  types: { id: number; tipo_vehiculo: string }[];
  selectedBrands: number[];
  selectedTypes: number[];
  onApplyFilters: (filters: {
    selectedBrands: number[];
    selectedTypes: number[];
    priceRange: [number, number];
  }) => void;
  onClearFilters: () => void;
}

export default function AdvancedFilter({
  brands,
  types,
  selectedBrands,
  selectedTypes,
  onApplyFilters,
  onClearFilters,
}: AdvancedFilterProps) {
  const [openBrands, setOpenBrands] = useState(false);
  const [openTypes, setOpenTypes] = useState(false);

  const [localSelectedBrands, setLocalSelectedBrands] = useState<number[]>(selectedBrands);
  const [localSelectedTypes, setLocalSelectedTypes] = useState<number[]>(selectedTypes);

  // Estados para el slider nativo
  const [internalPrice, setInternalPrice] = useState<[number, number]>([20000, 200000]);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleThumbMove = (
    e: React.MouseEvent | React.TouchEvent,
    thumb: "min" | "max"
  ) => {
    e.preventDefault();
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      let clientX: number;
      if (moveEvent instanceof TouchEvent) clientX = moveEvent.touches[0].clientX;
      else clientX = moveEvent.clientX;

      let percent = (clientX - rect.left) / rect.width;
      percent = Math.max(0, Math.min(1, percent));

      const value = Math.round((percent * (200000 - 20000) + 20000) / 1000) * 1000;

      setInternalPrice((prev) => {
        if (thumb === "min") {
          const newMin = Math.min(value, prev[1] - 1000);
          return [newMin, prev[1]];
        } else {
          const newMax = Math.max(value, prev[0] + 1000);
          return [prev[0], newMax];
        }
      });
    };

    const upHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
      window.removeEventListener("touchend", upHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("touchmove", moveHandler, { passive: false });
    window.addEventListener("mouseup", upHandler);
    window.addEventListener("touchend", upHandler);
  };

  return (
    <div className="h-[90vh] flex flex-col p-4 bg-gray-300 sticky top-8">
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Dropdown Marcas */}
        <div>
          <button
            onClick={() => setOpenBrands(!openBrands)}
            className="w-full text-left font-semibold bg-gray-600 p-2 rounded"
          >
            Marca
          </button>
          {openBrands && (
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-indigo-950">
              <label className="flex items-center p-2">
                <input
                  type="checkbox"
                  checked={localSelectedBrands.length === 0}
                  onChange={() => setLocalSelectedBrands([])}
                  className="mr-2"
                />
                Mostrar todas
              </label>
              {brands.map((brand) => (
                <label key={brand.id} className="flex items-center p-2">
                  <input
                    type="checkbox"
                    checked={localSelectedBrands.includes(brand.id)}
                    onChange={() => {
                      if (localSelectedBrands.includes(brand.id)) {
                        setLocalSelectedBrands(localSelectedBrands.filter((b) => b !== brand.id));
                      } else {
                        setLocalSelectedBrands([...localSelectedBrands, brand.id]);
                      }
                    }}
                    className="mr-2 text-green-700"
                  />
                  {brand.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown Tipo de Vehículo */}
        <div>
          <button
            onClick={() => setOpenTypes(!openTypes)}
            className="w-full text-left font-semibold bg-gray-600 p-2 rounded"
          >
            Tipo de Vehículo
          </button>
          {openTypes && (
            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-600 rounded p-2 bg-indigo-950">
              <label className="flex items-center p-2">
                <input
                  type="checkbox"
                  checked={localSelectedTypes.length === 0}
                  onChange={() => setLocalSelectedTypes([])}
                  className="mr-2"
                />
                Mostrar todos
              </label>
              {types.map((type) => (
                <label key={type.id} className="flex items-center p-2">
                  <input
                    type="checkbox"
                    checked={localSelectedTypes.includes(type.id)}
                    onChange={() => {
                      if (localSelectedTypes.includes(type.id)) {
                        setLocalSelectedTypes(localSelectedTypes.filter((t) => t !== type.id));
                      } else {
                        setLocalSelectedTypes([...localSelectedTypes, type.id]);
                      }
                    }}
                    className="mr-2"
                  />
                  {type.tipo_vehiculo}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Slider de rango de precio */}
        <div className="mt-4">
          <p className="font-semibold mb-2 text-red-800">Rango de Precio</p>
          <div className="flex justify-between mb-2 text-gray-600 font-bold">
            <span>$ {internalPrice[0]}</span>
            <span>$ {internalPrice[1]}</span>
          </div>

          <div ref={trackRef} className="relative h-2 bg-gray-400 rounded-full w-full max-w-[90%] mx-auto">
            {/* Rango coloreado */}
            <div
              className="absolute h-full bg-violet-900 rounded-full"
              style={{
                left: `${((internalPrice[0] - 20000) / (200000 - 20000)) * 100}%`,
                width: `${((internalPrice[1] - internalPrice[0]) / (200000 - 20000)) * 100}%`,
              }}
            ></div>

            {/* Thumb mínimo */}
            <div
              onMouseDown={(e) => handleThumbMove(e, "min")}
              onTouchStart={(e) => handleThumbMove(e, "min")}
              className="absolute -top-1 w-5 h-5 bg-violet-500 rounded-full shadow cursor-pointer"
              style={{
                left: `${((internalPrice[0] - 20000) / (200000 - 20000)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            ></div>

            {/* Thumb máximo */}
            <div
              onMouseDown={(e) => handleThumbMove(e, "max")}
              onTouchStart={(e) => handleThumbMove(e, "max")}
              className="absolute -top-1 w-5 h-5 bg-violet-500 rounded-full shadow cursor-pointer"
              style={{
                left: `${((internalPrice[1] - 20000) / (200000 - 20000)) * 100}%`,
                transform: "translateX(-50%)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Botones al final */}
      <div className="flex gap-2 mt-4">
        <button className="w-1/2 bg-red-900 py-2 rounded font-bold" onClick={onClearFilters}>
          Quitar filtros
        </button>
        <button
          className="w-1/2 bg-green-900 text-white py-2 rounded font-bold"
          onClick={() =>
            onApplyFilters({
              selectedBrands: localSelectedBrands,
              selectedTypes: localSelectedTypes,
              priceRange: internalPrice, // <--- Asegura que se use el valor actual del slider
            })
          }
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
