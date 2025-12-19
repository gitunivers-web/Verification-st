import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiRequest } from "./queryClient";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  twoFactorEnabled?: boolean;
}

interface LoginResult {
  requires2FA?: boolean;
  pendingAuthToken?: string;
  token?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  verify2FA: (pendingAuthToken: string, code: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; language?: string }) => Promise<string>;
  logout: () => void;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Erreur de connexion");
    }

    // If 2FA is required, return pending auth token without setting auth state
    if (data.requires2FA) {
      return { requires2FA: true, pendingAuthToken: data.pendingAuthToken };
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    
    return { token: data.token, user: data.user };
  };

  const verify2FA = async (pendingAuthToken: string, code: string) => {
    const response = await apiRequest("POST", "/api/auth/2fa/verify", { pendingAuthToken, token: code });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Code invalide");
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem("auth_user", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string; language?: string }) => {
    const response = await apiRequest("POST", "/api/auth/register", data);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Erreur d'inscription");
    }

    return result.message;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      verify2FA,
      register,
      logout,
      isAdmin: user?.role === "admin",
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
