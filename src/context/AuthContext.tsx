"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/utils/supabaseClient";

type AppUser = {
  id: string;
  nombre: string;
  usuario: string;
  sucursal: string;
  active: boolean;
  role?: "admin" | "user";
};

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión persistente al montar el cliente
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: appUser } = await supabase
          .from("app_users")
          .select("id, nombre, usuario, sucursal, active, role")
          .eq("id", session.user.id)
          .single();

        if (appUser) setUser(appUser);
      }

      setLoading(false);
    };

    fetchSession();

    // Escuchar cambios en la sesión
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) setUser(null);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Función login
  const login = async (email: string, password: string) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !authData.user) throw new Error(error?.message || "Error al iniciar sesión");

    const { data: appUser } = await supabase
      .from("app_users")
      .select("id, nombre, usuario, sucursal, active, role")
      .eq("id", authData.user.id)
      .single();

    if (!appUser?.active) {
      await supabase.auth.signOut();
      throw new Error("Usuario inactivo");
    }

    setUser(appUser);
  };

  // Función logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
