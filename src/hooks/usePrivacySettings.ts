
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface PrivacySettings {
  share_location: boolean;
  share_contact: boolean;
  share_status: boolean;
}

export function usePrivacySettings() {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSettings(null);
      setIsLoading(false);
      return;
    }
    
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      console.log("Fetching privacy settings for user:", user.id);
      
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, create default settings
          await createDefaultSettings();
          return;
        }
        console.error('Error fetching privacy settings:', error);
        throw error;
      }

      console.log("Fetched privacy settings:", data);
      setSettings(data);
    } catch (error) {
      console.error('Error in privacy settings fetch:', error);
      toast({
        title: "Error",
        description: "Failed to load privacy settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;
    
    try {
      const defaultSettings = {
        user_id: user.id,
        share_location: true,
        share_contact: true,
        share_status: true
      };
      
      const { data, error } = await supabase
        .from('privacy_settings')
        .insert(defaultSettings)
        .select()
        .single();
        
      if (error) throw error;
      
      setSettings(data);
    } catch (error) {
      console.error('Error creating default privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<PrivacySettings>) => {
    if (!user) return;

    try {
      console.log("Updating privacy settings:", newSettings);
      
      const { error } = await supabase
        .from('privacy_settings')
        .update(newSettings)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    settings,
    isLoading,
    updateSettings
  };
}
