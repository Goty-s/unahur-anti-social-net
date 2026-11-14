import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/usuarioContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, setMostrarLogin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setMostrarLogin(true);
    }
  }, [isAuthenticated, setMostrarLogin]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}