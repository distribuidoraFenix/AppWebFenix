"use client";

import { useState } from "react";
import Image from "next/image";

interface FilterCardProps {
  id: number;
  name: string;
  image: string;
  onToggle: (id: number) => void;
  isActive: boolean;
}

export default function FilterCard({ id, name, image, onToggle, isActive }: FilterCardProps) {
  return (
    <div
      onClick={() => onToggle(id)}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border cursor-pointer transition-all duration-300 
        ${isActive ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
    >
      <Image src={image} alt={name} width={60} height={60} className="rounded-md" />
      <span className="mt-2 text-sm font-medium">{name}</span>
    </div>
  );
}
