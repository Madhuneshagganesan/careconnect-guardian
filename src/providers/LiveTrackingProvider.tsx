
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface LiveTracking {
  caregiver_id: string;
  location_lat: number;
  location_lng: number;
  status: string;
  eta: number;
}

interface LiveTrackingContextType {
  trackingData: LiveTracking | null;
}

const LiveTrackingContext = createContext<LiveTrackingContextType>({
  trackingData: null,
});

export const LiveTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  const [trackingData, setTrackingData] = useState<LiveTracking | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

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
          setTrackingData(payload.new as LiveTracking);
          
          // Show real-time notifications for status changes
          if (payload.old.status !== payload.new.status) {
            toast({
              title: "Caregiver Status Updated",
              description: `Status changed to: ${payload.new.status}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <LiveTrackingContext.Provider value={{ trackingData }}>
      {children}
    </LiveTrackingContext.Provider>
  );
};

export const useLiveTracking = () => useContext(LiveTrackingContext);
