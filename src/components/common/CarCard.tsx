"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Car {
  id: number;
  nombre: string;
  año: number;
  precio: number;
  marcalogo: string;
  imagen: string;
}

export default function CarCard({ car }: { car: Car }) {
  const router = useRouter();

  const handleVerDetalles = () => {
    router.push(`/vehiculo-detalle?id=${car.id}`);
  };

  const handleCotizar = () => {
    router.push(`/cotizacion?id=${car.id}&precio=${car.precio}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-4">
      {/* Div superior: logo + nombre y año */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 relative">
          <Image
            src={car.marcalogo}
            alt={`Logo de ${car.nombre}`}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="xs:text-sm sm:text-base lg:text-lg font-bold">
            {car.nombre}
          </h3>
          <p className="text-gray-600 font-medium">{car.año}</p>
        </div>
      </div>

      {/* Imagen del vehículo */}
      <div className="flex justify-center">
        <Image
          src={car.imagen}
          alt={car.nombre}
          width={256}
          height={256}
          className="object-contain"
        />
      </div>

      {/* Precio */}
      <p className="text-gray-800 font-bold text-2xl text-center">
        ${car.precio}
      </p>

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={handleVerDetalles}
          className="flex-1 px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
        >
          Ver Detalles
        </button>
        <button
          onClick={handleCotizar}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Cotizar
        </button>
      </div>
    </div>
  );
}
