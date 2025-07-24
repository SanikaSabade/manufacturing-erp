import React, { createContext, useContext, useState, useEffect } from 'react';
import { setupInterceptors } from "../utils/axios";

type User = {
  name: string;
  role: 'admin' | 'employee';
  email:string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'employee') => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string, role: 'admin' | 'employee') => {
    setLoading(true);
    setError(null);
    try {
      const route = role === 'admin' ? 'login' : 'login-employee';
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/auth/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await res.json();
      const userData: User = {
        name: data.user.name,
        role: data.user.role,
        email: data.user.email,
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setupInterceptors(logout);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved && !user) setUser(JSON.parse(saved));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
