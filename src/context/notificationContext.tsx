import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import styles from "./Notifications.module.css";

interface NotificationItem {
    id: number;
    message: string;
}

interface NotificationContextType {
    notify: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DURATION_MS = 4000;
let nextId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [advices, setAdvices] = useState<NotificationItem[]>([]);

    const removeNotification = useCallback((id: number) => {
        setAdvices((prev) => prev.filter((advice) => advice.id !== id));
    }, []);

    const notify = useCallback(
        (message: string) => {
            nextId += 1;
            const id = nextId;
            setAdvices((prev) => [...prev, { id, message }]);
            setTimeout(() => removeNotification(id), DURATION_MS);
        },
        [removeNotification]
    );

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}

            <div className={styles.container}>
                <div className={styles.advicesStack}>
                    {advices.map((advice) => (
                        <div key={advice.id} className={styles.advice}>
                            <span className={styles.message}>{advice.message}</span>
                            <button className={styles.closeButton} onClick={() => removeNotification(advice.id)}>
                                <i className="bi bi-x" />
                            </button>
                            <span className={styles.progress} style={{ animationDuration: `${DURATION_MS}ms` }} />
                        </div>
                    ))}
                </div>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification debe usarse dentro de NotificationProvider");
    }
    return context;
}