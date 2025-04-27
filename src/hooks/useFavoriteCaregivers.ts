
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
      setFavorites([]);
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
    } catch (error) {
      console.error('Error in favorite caregivers fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (caregiverId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(caregiverId);
      
      if (isFavorite) {
        console.log("Removing from favorites:", caregiverId);
        
        await supabase
          .from('favorite_caregivers')
          .delete()
          .eq('user_id', user.id)
          .eq('caregiver_id', caregiverId);
        
        setFavorites(prev => prev.filter(id => id !== caregiverId));
        toast({
          description: "Removed from favorites",
        });
      } else {
        console.log("Adding to favorites:", caregiverId);
        
        await supabase
          .from('favorite_caregivers')
          .insert({ user_id: user.id, caregiver_id: caregiverId });
        
        setFavorites(prev => [...prev, caregiverId]);
        toast({
          description: "Added to favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  return {
    favorites,
    isLoading,
    toggleFavorite
  };
}
