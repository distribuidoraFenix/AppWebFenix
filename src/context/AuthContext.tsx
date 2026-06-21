"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        console.log("Iniciando verificación de sesión...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.log("No existe sesión activa");
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const { data: appUser, error: userError } = await supabase
          .from("app_users")
          .select("id, nombre, usuario, sucursal, active, role")
          .eq("id", session.user.id)
          .single();

        if (userError || !appUser) {
          console.error("Usuario no encontrado en app_users:", userError);
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setUser(appUser);
        }
      } catch (error) {
        console.error("Error inesperado:", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          console.log("Loading finalizado");
          setLoading(false);
        }
      }
    };

    fetchSession();

    // El escuchador de eventos solo gestiona la memoria de la sesión
  
        // El escuchador de eventos SOLO actualiza la memoria de forma segura, sin bloquear con loadings eternos
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AUTH EVENT ENTRANTE:", event, "SESSION EXISTE?:", !!session);

      if (!session?.user) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      // Si es un inicio de sesión o refresco de token, actualizamos los datos del usuario en segundo plano
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        try {
          const { data: appUser } = await supabase
            .from("app_users")
            .select("id, nombre, usuario, sucursal, active, role")
            .eq("id", session.user.id)
            .single();

          if (appUser && isMounted) {
            setUser(appUser);
          }
        } catch (err) {
          console.error("Error en segundo plano actualizando app_user:", err);
        } finally {
          // Garantizamos que el loading baje a false SIEMPRE en producción
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || "Error al iniciar sesión");
    }

    const { data: appUser } = await supabase
      .from("app_users")
      .select("id, nombre, usuario, sucursal, active, role")
      .eq("id", data.user.id)
      .single();

    if (!appUser?.active) {
      await supabase.auth.signOut();
      throw new Error("Usuario inactivo");
    }

    setUser(appUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
