import { createContext, useContext, useState } from "react";

type LoginContextType = {
    showLogin: boolean;
    setShowLogin: (mostrar: boolean) => void;
};

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export function LoginProvider({ children }: { children: React.ReactNode }) {
    const [showLogin, setShowLogin] = useState(false);

    const value: LoginContextType = {
        showLogin,
        setShowLogin
    };

    return (
        <LoginContext.Provider value={value}>
            {children}
        </LoginContext.Provider>
    );
}

export function useLogin() {
    const context = useContext(LoginContext);

    if (context === undefined) {
        throw new Error("useLogin debe usarse dentro de un LoginProvider");
    }

    return context;
}