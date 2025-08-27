"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import CarCard from "@/components/common/CarCard";

// 🔹 Tipo de la tabla en Supabase
interface CarRow {
  id: number;
  nombre: string;
  ano: number;
  precio: number;
  imagen_url: string | null;
  brands?: {
    logo_url: string | null;
  };
}

// 🔹 Tipo adaptado para el componente
interface Car {
  id: number;
  nombre: string;
  ano: number;
  precio: number;
  marcalogo: string;
  imagen: string;
}

export default function ResultadosClient() {
  const searchParams = useSearchParams();

  const brandsParam = searchParams.get("brands");
  const typesParam = searchParams.get("types");

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);

      const brandsIds = brandsParam ? brandsParam.split(",").map(Number) : [];
      const typesIds = typesParam ? typesParam.split(",").map(Number) : [];

      let query = supabase
        .from("data_car")
        .select(`
          id, nombre, ano, precio, imagen_url, 
          brands(logo_url)
        `);

      if (brandsIds.length > 0) {
        query = query.in("brand_id", brandsIds);
      }

      if (typesIds.length > 0) {
        query = query.in("type_id", typesIds);
      }

      const { data, error } = await query.returns<CarRow[]>();

      if (error) {
        console.error("Error al cargar autos:", error.message);
        setCars([]);
      } else if (data) {
        const adapted: Car[] = data.map((car) => ({
          id: car.id,
          nombre: car.nombre,
          ano: car.ano,
          precio: car.precio,
          marcalogo: car.brands?.logo_url || "/placeholder.webp",
          imagen: car.imagen_url || "/placeholder.webp",
        }));
        setCars(adapted);
      }

      setLoading(false);
    };

    fetchCars();
  }, [brandsParam, typesParam]);

  if (loading) return <p className="p-4">Cargando autos...</p>;
  if (cars.length === 0) return <p className="p-4">No se encontraron resultados</p>;

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </main>
  );
}
