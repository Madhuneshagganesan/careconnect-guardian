
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export function useFavoriteCaregivers() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      // Use local storage for non-authenticated users
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      setIsLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // For local development/demo, use localStorage instead of Supabase
      // This avoids UUID format issues with the mock user IDs
      const storageKey = `favorites_${user.id}`;
      const storedFavorites = localStorage.getItem(storageKey);
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        console.log("Fetched favorite caregivers from localStorage:", favoriteIds);
        setFavorites(favoriteIds);
      } else {
        // Initialize empty favorites for this user
        localStorage.setItem(storageKey, JSON.stringify([]));
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error in favorite caregivers fetch:', error);
      
      // Fallback to general localStorage
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (caregiverId: string) => {
    try {
      const isFavorite = favorites.includes(caregiverId);
      let newFavorites: string[];
      
      if (isFavorite) {
        console.log("Removing from favorites:", caregiverId);
        newFavorites = favorites.filter(id => id !== caregiverId);
      } else {
        console.log("Adding to favorites:", caregiverId);
        newFavorites = [...favorites, caregiverId];
      }
      
      setFavorites(newFavorites);
      
      // Store in user-specific localStorage key if authenticated
      if (user) {
        localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      }
      
      // Also store in general localStorage as fallback
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
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
    isFavorite
  };
}
