import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/supabaseClient.js";
import { Session } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem("weatherAppUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) {
        console.error("Sign-in error:", error.message);
        setIsLoading(false);
        throw new Error(error.message);
      }

      const user = {
        id: data.user?.id || "1",
        email: data.user?.email || email,
        name: email.split("@")[0],
      };

      setUser(user);
      localStorage.setItem("weatherAppUser", JSON.stringify(user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      setIsLoading(false);
      throw new Error(error.message);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
    });

    if (error) {
      console.error("Error signing up: ", error);
      setIsLoading(false);
      throw new Error(error.message);
    }

    const user = {
      id: data.user?.id || "1",
      email: data.user?.email || email,
      name: name,
    };

    setUser(user);
    localStorage.setItem("weatherAppUser", JSON.stringify(user));
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      
    }
    setUser(null);
    localStorage.removeItem("weatherAppUser");
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, login, signup, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
