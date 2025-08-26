"use client";

import Image from "next/image";

interface FilterTypeCardProps {
  id: number;
  name: string;
  icon: string;
  isActive: boolean;
  onToggle: (id: number) => void;
}

export default function FilterTypeCard({ id, name, icon, isActive, onToggle }: FilterTypeCardProps) {
  return (
    <div
      onClick={() => onToggle(id)}
      className={`w-auto text-gray-800 h-16 p-2 sm:p-2 md:p-1 sm:h-32 md:h-28 flex flex-col items-center justify-center rounded border cursor-pointer transition-all duration-300 
        ${isActive ? "bg-green-200 border-red-400" : "bg-white hover:bg-gray-50"}`}
    >
      <Image
        src={icon}
        alt={name}
        width={60}
        height={60}
      />
      <span className="hidden sm:block mt-2 text-sm md:text-xs font-bold italic">{name}</span>
    </div>
  );
}
