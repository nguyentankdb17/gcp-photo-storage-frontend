import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

interface AuthContextProps {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};
