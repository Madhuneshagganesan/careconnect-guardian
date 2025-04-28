
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
      console.log("Fetching favorites for user:", user.id);
      
      const { data, error } = await supabase
        .from('favorite_caregivers')
        .select('caregiver_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      const favoriteIds = data.map(f => f.caregiver_id);
      console.log("Fetched favorite caregivers:", favoriteIds);
      setFavorites(favoriteIds);
      
      // Also store in localStorage as fallback
      localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error in favorite caregivers fetch:', error);
      
      // Try to load from localStorage as fallback
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
      
      if (user) {
        if (isFavorite) {
          console.log("Removing from favorites:", caregiverId);
          
          await supabase
            .from('favorite_caregivers')
            .delete()
            .eq('user_id', user.id)
            .eq('caregiver_id', caregiverId);
          
          newFavorites = favorites.filter(id => id !== caregiverId);
        } else {
          console.log("Adding to favorites:", caregiverId);
          
          await supabase
            .from('favorite_caregivers')
            .insert({ user_id: user.id, caregiver_id: caregiverId });
          
          newFavorites = [...favorites, caregiverId];
        }
      } else {
        // Handle non-authenticated users via localStorage
        if (isFavorite) {
          newFavorites = favorites.filter(id => id !== caregiverId);
        } else {
          newFavorites = [...favorites, caregiverId];
        }
      }
      
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return Promise.reject(error);
    }
  };

  return {
    favorites,
    isLoading,
    toggleFavorite
  };
}
