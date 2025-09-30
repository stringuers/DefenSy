import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'developer' | 'team' | 'enterprise' | 'custom';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  redirectToDashboard: boolean;
  setRedirectToDashboard: (redirect: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('defensis_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('defensis_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Login failed:', error.detail || 'Unknown error');
        return false;
      }

      const data = await response.json();
      
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        plan: data.user.plan || 'free'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      setRedirectToDashboard(true);
      localStorage.setItem('defensis_user', JSON.stringify(userData));
      localStorage.setItem('defensis_token', data.access_token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Signup failed:', error.detail || 'Unknown error');
        return false;
      }

      const data = await response.json();
      
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        plan: data.user.plan || 'free'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      setRedirectToDashboard(true);
      localStorage.setItem('defensis_user', JSON.stringify(userData));
      localStorage.setItem('defensis_token', data.access_token);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRedirectToDashboard(false);
    localStorage.removeItem('defensis_user');
    localStorage.removeItem('defensis_token');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('defensis_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    redirectToDashboard,
    setRedirectToDashboard
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
