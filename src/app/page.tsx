"use client";

import { useEffect, useState } from "react";
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

  // 🔹 Fetch de marcas activas
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("active", true);

      if (error) {
        console.error("Error al cargar marcas:", error.message);
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

  return (
    <main className="space-y-8 p-4">
      {/* Filtro de Marcas */}
      <section>
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
    </main>
  );
}
