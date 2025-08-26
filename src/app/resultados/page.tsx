"use client";

import CarCard from "@/components/common/CarCard";

export default function ResultadosPage() {
  // 🚗 Datos de prueba (mock), luego estos vendrán de tu lógica de filtros
  const cars = [
    {
      id: 1,
      nombre: "Toyota Hilux",
      año: 2023,
      precio: 35000,
      marcalogo: "/logos/toyota.png",
      imagen: "/cars/hilux.png",
    },
    {
      id: 2,
      nombre: "Nissan Navara",
      año: 2022,
      precio: 32000,
      marcalogo: "/logos/nissan.png",
      imagen: "/cars/navara.png",
    },
  ];

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </main>
  );
}
