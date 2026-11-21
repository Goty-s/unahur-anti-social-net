import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import { useLogin } from "../context/LoginContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated  } = useAuth();
  const {setShowLogin} = useLogin();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLogin(true);
    }
  }, [isAuthenticated, setShowLogin]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}