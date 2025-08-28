"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import FilterTypeCard from "@/components/common/FilterTypeCard";

export interface TypeCar {
  id: number;
  tipo_vehiculo: string;
  icono_url: string;
}

interface TypeFilterGridProps {
  defaultSelected?: number[];                  // opcional: ids preseleccionados
  onSelectionChange?: (ids: number[]) => void; // opcional: notifica cambios al padre
}

export default function TypeFilterGrid({
  defaultSelected = [],
  onSelectionChange,
}: TypeFilterGridProps) {
  const [types, setTypes] = useState<TypeCar[]>([]);
  const [selected, setSelected] = useState<number[]>(defaultSelected);

  // 🔹 Avisar al padre cuando cambian los seleccionados
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selected);
    }
  }, [selected, onSelectionChange]);

  // 🔹 Cargar tipos desde Supabase
  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from("typeCar")
        .select("id, tipo_vehiculo, icono_url");

      if (error) {
        console.error("❌ Error al cargar tipos:", error.message);
      } else {
        setTypes(data || []);
      }
    };

    fetchTypes();
  }, []);

  // 🔹 Manejar click en un tipo
  const handleToggleType = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="grid grid-cols-4 p-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 2xl:grid-cols-12 gap-4">
      {types.length === 0 && (
        <p className="text-red-400 italic">Cargando . . . </p>
      )}
      {types.map((t) => (
        <FilterTypeCard
          key={t.id}
          id={t.id}
          name={t.tipo_vehiculo}
          icon={t.icono_url}
          isActive={selected.includes(t.id)}
          onToggle={handleToggleType}
        />
      ))}
    </section>
  );
}
