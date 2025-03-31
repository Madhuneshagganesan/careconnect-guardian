
import React, { createContext, useContext } from 'react';

interface UserHealth {
  condition?: string;
  treatment?: string;
  height?: string;
  weight?: string;
  bloodGroup?: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  dob?: string;
  phone?: string;
  age?: number;
  emergencyContact?: string;
  health?: UserHealth;
  gender?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (user: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);
