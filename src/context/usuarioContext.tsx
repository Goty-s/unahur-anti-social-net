import { createContext, useContext, useState } from "react";
import type { UsuarioContextType, LoginData } from "../types/usuarioContext";
import type { User } from "../types/Post.interface";
import { getUsers } from "../services/api";

const usuarioContext = createContext<UsuarioContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const usuarioGuardado = localStorage.getItem("user");
    if (usuarioGuardado) {
      try {
        return JSON.parse(usuarioGuardado) as User;
      } catch {
        return null;
      }
    }
    return null;
  });

async function login(data: LoginData): Promise<boolean> {
  try {
    const usuarios = await getUsers();

    console.log("Usuarios recibidos de la API:", usuarios);

    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.nickName === data.nickName
    );

    console.log("Usuario encontrado:", usuarioEncontrado);

    if (!usuarioEncontrado || data.password !== "123456") {
      return false;
    }

    setUser(usuarioEncontrado);
    localStorage.setItem("user", JSON.stringify(usuarioEncontrado));
    return true;

  } catch (error) {
    console.error("Error al consultar la API:", error);
    return false;
  }
}

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  const value: UsuarioContextType = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return (
    <usuarioContext.Provider value={value}>
      {children}
    </usuarioContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(usuarioContext);

  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}