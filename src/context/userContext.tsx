import { createContext, useContext, useState } from "react";
import type { User } from "../types/index";
import { getUsers } from "../services/api";

type LoginData = {
  nickName: string;
  password: string;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => void;
  showLogin : boolean;
  setShowLogin: (mostrar: boolean) => void;
};

const userContext = createContext<UserContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showLogin , setShowLogin] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as User;
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

  const value: UserContextType = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
    showLogin,
    setShowLogin
  };

  return (
    <userContext.Provider value={value}>
      {children}
    </userContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(userContext);

  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}