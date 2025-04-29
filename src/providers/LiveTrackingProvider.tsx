
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';

interface LiveTracking {
  caregiver_id: string;
  location_lat: number;
  location_lng: number;
  status: string;
  eta: number;
}

interface LiveTrackingContextType {
  trackingData: LiveTracking | null;
  isLoading: boolean;
  error: string | null;
}

const LiveTrackingContext = createContext<LiveTrackingContextType>({
  trackingData: null,
  isLoading: false,
  error: null,
});

export const LiveTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const [trackingData, setTrackingData] = useState<LiveTracking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { settings } = usePrivacySettings();

  useEffect(() => {
    if (!user) return;

    // Subscribe to live tracking updates
    const channel = supabase
      .channel('live_tracking_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_tracking',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Live tracking update received:", payload);
          setTrackingData(payload.new as LiveTracking);
          
          // Show real-time notifications for status changes
          if (payload.old && payload.old.status !== payload.new.status) {
            toast({
              title: "Caregiver Status Updated",
              description: `Status changed to: ${payload.new.status}`,
            });
          }
          
          // Show ETA updates
          if (payload.old && payload.old.eta !== payload.new.eta) {
            toast({
              title: "ETA Updated",
              description: `Your caregiver will arrive in approximately ${payload.new.eta} minutes`,
            });
          }
        }
      )
      .subscribe();

    console.log("Subscribed to live tracking channel");

    // Initial fetch of tracking data
    const fetchTrackingData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('live_tracking')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching tracking data:', error);
          setError('Failed to fetch tracking data. Using mock data instead.');
          // We'll continue with mock data in the LiveTracking component
          return;
        }

        if (data) {
          setTrackingData(data as LiveTracking);
        }
      } catch (error) {
        console.error('Error in tracking data fetch:', error);
        setError('Failed to fetch tracking data. Using mock data instead.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackingData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <LiveTrackingContext.Provider value={{ trackingData, isLoading, error }}>
      {children}
    </LiveTrackingContext.Provider>
  );
};

export const useLiveTracking = () => useContext(LiveTrackingContext);
