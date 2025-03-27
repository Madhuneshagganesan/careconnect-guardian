
import React, { useState, useEffect } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user exists in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === email);
      
      if (!existingUser) {
        return Promise.reject(new Error("No account found with this email. Please sign up."));
      }
      
      if (existingUser.password !== password) {
        return Promise.reject(new Error("Incorrect password. Please try again."));
      }
      
      // Login successful, store current user
      const currentUser = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name
      };
      
      localStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${currentUser.name}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        return Promise.reject(new Error("Email already in use. Please use a different email or login."));
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        password // In a real app, this would be hashed
      };
      
      // Store user in users array
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      // Create current user object (without password)
      const currentUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      };
      
      // Set current user
      localStorage.setItem('user', JSON.stringify(currentUser));
      setUser(currentUser);
      
      toast({
        title: "Account created",
        description: `Welcome to Guardian Go, ${name}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Remove current user from localStorage
      localStorage.removeItem('user');
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
