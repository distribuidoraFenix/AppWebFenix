"use client";

import { usePathname } from "next/navigation";
import Navbar from "./NavBar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Ocultar navbar en /login
  if (pathname === "/login") return null;

  return <Navbar />;
}
