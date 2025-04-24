
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
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_caregivers')
        .select('caregiver_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setFavorites(data.map(f => f.caregiver_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
