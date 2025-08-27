"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 👈 para navegar
import { supabase } from "@/lib/supabaseClient";
import FilterBrandCard from "@/components/common/FilterBrandCard";
import TypeFilterGrid from "@/components/filters/TypeFilterGrid"; 

interface Brand {
  id: number;
  name: string;
  logo_url: string;
  active: boolean;
  importadora: string;
}

export default function HomePage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const router = useRouter();

  // 🔹 Fetch de marcas activas
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("active", true);

      if (error) {
        console.error("❌ Error al cargar marcas:", error.message);
      } else {
        setBrands(data || []);
      }
    };
    fetchBrands();
  }, []);

  // Toggle marcas
  const handleToggleBrand = (id: number) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 🔹 Navegar con filtros seleccionados
  const handleFilter = () => {
    const params = new URLSearchParams();

    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(",")); // ej: 1,2,3
    }
    if (selectedTypes.length > 0) {
      params.set("types", selectedTypes.join(",")); // ej: 4,5
    }

    router.push(`/resultados?${params.toString()}`);
  };

  return (
    <main className="space-y-8 p-4">
      {/* Filtro de Marcas */}
      <section>
        <h3 className="text-base md:text-xl pb-4  italic">
          Selecciona la marca y el tipo de vehículo que buscas</h3>
        <h2 className="text-lg font-semibold mb-2">Marcas</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-12 gap-4">
          {brands.map((brand) => (
            <FilterBrandCard
              key={brand.id}
              id={brand.id}
              name={brand.name}
              logo={brand.logo_url}
              isActive={selectedBrands.includes(brand.id)}
              onToggle={handleToggleBrand}
            />
          ))}
        </div>
      </section>

      {/* Filtro de Tipos de Vehículo */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Tipos de Vehículo</h2>
        <TypeFilterGrid
          defaultSelected={selectedTypes}
          onSelectionChange={setSelectedTypes}
        />
      </section>

      {/* Botón Flotante */}
      <button
        onClick={handleFilter}
        className="text-sm fixed bottom-3 right-6 bg-green-700 hover:bg-green-600 text-gray-200 font-semibold px-6 py-3 rounded-lg shadow-lg"
      >
        FILTRAR
      </button>
    </main>
  );
}
