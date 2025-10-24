import { AuthService } from "@/lib/auth";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";

/**
 * Authentication Context
 *
 * This provides authentication state to your entire app.
 * Any component can access the current user and auth status.
 */
export const AuthContext = React.createContext<{
  user: User | null;
  loading: boolean;
  signOut: () => void;
}>({
  user: null,
  loading: true,
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in when app starts
    const checkUser = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // listener for auth state changes (no multi-device sync needed)
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange((user) => {
      console.log("Auth state changed:", user ? "Logged in" : "Logged out");
      setUser(user);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await AuthService.signOut();
    // The listener will automatically update the user state
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to easily use auth context in components
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
