
import React, { useState, useEffect } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

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

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
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
      
      // Login successful, store current user (without password)
      const { password: _, ...userWithoutPassword } = existingUser;
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.firstName}!`,
      });
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Omit<User, 'id'> & { password: string }) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        return Promise.reject(new Error("Email already in use. Please use a different email or login."));
      }
      
      // Create new user with ID
      const newUser = {
        id: `user_${Date.now()}`,
        ...userData,
      };
      
      // Store user in users array
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      toast({
        title: "Account created",
        description: `Welcome to Guardian Go, ${userData.firstName}!`,
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

  const updateProfile = async (updatedUserData: Partial<User>) => {
    if (!user) return Promise.reject(new Error("No user is currently logged in"));
    
    try {
      // Update user in localStorage
      const updatedUser = {...user, ...updatedUserData};
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in the users array
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = storedUsers.map((u: any) => {
        if (u.id === user.id) {
          const { password } = u; // Keep the password from the original user object
          return { ...updatedUser, password };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
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
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
