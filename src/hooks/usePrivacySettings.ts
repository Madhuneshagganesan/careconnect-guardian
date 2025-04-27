
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
      
      // Create fallback settings if we can't fetch from Supabase
      const fallbackSettings = {
        share_location: true,
        share_contact: true,
        share_status: true
      };
      
      // Try to get from localStorage first
      const storedSettings = localStorage.getItem(`privacy_settings_${user.id}`);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
        setIsLoading(false);
        return;
      }

      try {
        // Try Supabase as a fallback, but don't block on it
        const { data, error } = await supabase
          .from('privacy_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching privacy settings:', error);
          // If we can't fetch from Supabase, use the fallback settings
          setSettings(fallbackSettings);
          localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(fallbackSettings));
        } else {
          console.log("Fetched privacy settings:", data);
          setSettings(data);
          localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error in Supabase fetch:', error);
        setSettings(fallbackSettings);
        localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(fallbackSettings));
      }
    } catch (error) {
      console.error('Error in privacy settings fetch:', error);
      // Set default settings if there's an error
      const defaultSettings = {
        share_location: true,
        share_contact: true,
        share_status: true
      };
      setSettings(defaultSettings);
      localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(defaultSettings));
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<PrivacySettings>) => {
    if (!user) return;

    try {
      console.log("Updating privacy settings:", newSettings);
      
      // Get current settings
      const currentSettings = settings || {
        share_location: true,
        share_contact: true,
        share_status: true
      };
      
      // Merge with new settings
      const updatedSettings = { ...currentSettings, ...newSettings };
      
      // Store in localStorage first (guaranteed to work)
      localStorage.setItem(`privacy_settings_${user.id}`, JSON.stringify(updatedSettings));
      
      // Try to update in Supabase as well, but don't block on it
      try {
        await supabase
          .from('privacy_settings')
          .upsert({ 
            user_id: user.id,
            ...updatedSettings
          });
      } catch (supabaseError) {
        console.log('Supabase update failed, but localStorage succeeded:', supabaseError);
      }
      
      // Update state
      setSettings(updatedSettings);
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
