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

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log("Iniciando verificación de sesión...");

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("SESSION:", session);

        if (sessionError) {
          console.error("Error obteniendo sesión:", sessionError);
          return;
        }

        if (!session?.user) {
          console.log("No existe sesión activa");
          setUser(null);
          return;
        }

        const { data: appUser, error: userError } = await supabase
          .from("app_users")
          .select(
            "id, nombre, usuario, sucursal, active, role"
          )
          .eq("id", session.user.id)
          .single();

        console.log("APP USER:", appUser);

        if (userError) {
          console.error("Error obteniendo appUser:", userError);
          setUser(null);
          return;
        }

        if (!appUser) {
          console.warn("Usuario no encontrado en app_users");
          setUser(null);
          return;
        }

        setUser(appUser);
      } catch (error) {
        console.error("Error inesperado:", error);
        setUser(null);
      } finally {
        console.log("Loading finalizado");
        setLoading(false);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("AUTH EVENT:", _event);

        if (!session?.user) {
          setUser(null);
          return;
        }

        const { data: appUser } = await supabase
          .from("app_users")
          .select(
            "id, nombre, usuario, sucursal, active, role"
          )
          .eq("id", session.user.id)
          .single();

        if (appUser) {
          setUser(appUser);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error || !data.user) {
      throw new Error(
        error?.message || "Error al iniciar sesión"
      );
    }

    const { data: appUser } = await supabase
      .from("app_users")
      .select(
        "id, nombre, usuario, sucursal, active, role"
      )
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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    );
  }

  return context;
};