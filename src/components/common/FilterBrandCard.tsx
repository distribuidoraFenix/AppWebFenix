"use client";

import Image from "next/image";

interface FilterCardProps {
  id: number;
  name: string;
  logo: string;
  onToggle: (id: number) => void;
  isActive: boolean;
}

export default function FilterCard({ id, name, logo, onToggle, isActive }: FilterCardProps) {
  return (
    <div
      onClick={() => onToggle(id)}
      className={`w-auto h-20 p-2 sm:p-2 md:p-1 sm:h-24 flex flex-col items-center justify-center rounded border cursor-pointer transition-all duration-300 
        ${isActive ? "border-red-500 bg-green-200" : "border-gray-300 bg-white"}`}
    >
      <Image 
        src={logo && logo.trim() !== "" ? logo : "/placeholder.webp"} 
        alt={name} 
        width={60} 
        height={60} 
         
      />    
    </div>
  );
}
