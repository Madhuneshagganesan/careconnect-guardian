
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderActions from './HeaderActions';
import { Navigation } from 'lucide-react';
import { useLiveTracking } from '@/providers/LiveTrackingProvider';
import { Button } from '@/components/ui/shadcn-button';

const NavbarRightSection = () => {
  const { trackingData } = useLiveTracking();
  const isActiveTracking = !!trackingData;
  
  return (
    <div className="flex items-center gap-3">
      {isActiveTracking && (
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="relative">
            <Navigation className="h-5 w-5 text-guardian-700" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </Button>
        </Link>
      )}
      <HeaderActions />
    </div>
  );
};

export default NavbarRightSection;
