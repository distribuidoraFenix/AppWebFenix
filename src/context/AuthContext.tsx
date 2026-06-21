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

async function loadAppUser(userId: string) {
  const { data: appUser, error } = await supabase
    .from("app_users")
    .select("id, nombre, usuario, sucursal, active, role")
    .eq("id", userId)
    .single();

  if (error || !appUser?.active) {
    console.error("Usuario no encontrado o inactivo en app_users:", error);
    return null;
  }

  return appUser;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        console.log("Iniciando verificacion de sesion...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.log("No existe sesion activa");
          if (isMounted) setUser(null);
          return;
        }

        const appUser = await loadAppUser(session.user.id);
        if (isMounted) setUser(appUser);
      } catch (error) {
        console.error("Error inesperado verificando sesion:", error);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) {
          console.log("Loading finalizado");
          setLoading(false);
        }
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AUTH EVENT ENTRANTE:", event, "SESSION EXISTE?:", !!session);

      if (!session?.user) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setLoading(false);

      // Supabase recomienda evitar consultas async directas dentro del callback.
      setTimeout(() => {
        void loadAppUser(session.user.id).then((appUser) => {
          if (isMounted) setUser(appUser);
        });
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      setLoading(false);
      throw new Error(error?.message || "Error al iniciar sesion");
    }

    const appUser = await loadAppUser(data.user.id);

    if (!appUser) {
      await supabase.auth.signOut();
      setLoading(false);
      throw new Error("Usuario inactivo");
    }

    setUser(appUser);
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
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
