
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export function useFavoriteCaregivers() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (user) {
        // For local development/demo, use localStorage with user-specific key
        const storageKey = `favorites_${user.id}`;
        const storedFavorites = localStorage.getItem(storageKey);
        
        if (storedFavorites) {
          try {
            const favoriteIds = JSON.parse(storedFavorites);
            console.log("Fetched favorite caregivers from localStorage for user:", user.id, favoriteIds);
            setFavorites(Array.isArray(favoriteIds) ? favoriteIds : []);
          } catch (error) {
            console.error('Error parsing favorites from localStorage:', error);
            setFavorites([]);
            // Reset corrupted data
            localStorage.setItem(storageKey, JSON.stringify([]));
          }
        } else {
          // Initialize empty favorites for this user
          localStorage.setItem(storageKey, JSON.stringify([]));
          setFavorites([]);
        }
      } else {
        // Clear favorites when no user is logged in
        setFavorites([]);
        console.log("No user logged in, favorites cleared");
      }
    } catch (error) {
      console.error('Error in favorite caregivers fetch:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (caregiverId: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save favorites",
          variant: "destructive",
        });
        return Promise.reject("User not authenticated");
      }

      const isFavorite = favorites.includes(caregiverId);
      let newFavorites: string[];
      
      if (isFavorite) {
        console.log("Removing from favorites for user", user.id, ":", caregiverId);
        newFavorites = favorites.filter(id => id !== caregiverId);
      } else {
        console.log("Adding to favorites for user", user.id, ":", caregiverId);
        newFavorites = [...favorites, caregiverId];
      }
      
      setFavorites(newFavorites);
      
      // Store in user-specific localStorage key
      const storageKey = `favorites_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      
      return Promise.resolve(!isFavorite); // Return whether it's now a favorite
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return Promise.reject(error);
    }
  };

  const isFavorite = (caregiverId: string) => {
    return favorites.includes(caregiverId);
  };

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    refreshFavorites: fetchFavorites
  };
}
