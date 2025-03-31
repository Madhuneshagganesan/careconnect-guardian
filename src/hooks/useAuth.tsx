
import { createContext, useContext, useState, useEffect } from 'react';

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
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
