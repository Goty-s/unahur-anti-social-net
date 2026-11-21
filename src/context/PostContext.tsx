import { createContext, useContext, useState } from "react";

type PostContextType = {
    postUpdate: number;
    notifyPostCreated: () => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
    const [postUpdate, setPostUpdate] = useState(0);

    function notifyPostCreated() {
        setPostUpdate((previous) => previous + 1);
    }

    const value: PostContextType = {
        postUpdate,
        notifyPostCreated
    };

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
}

export function usePost() {
    const context = useContext(PostContext);

    if (context === undefined) {
        throw new Error("usePost debe usarse dentro de un PostProvider");
    }

    return context;
}