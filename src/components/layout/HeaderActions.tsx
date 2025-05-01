
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import NotificationSystem from '@/components/notifications/NotificationSystem';
import { UserCircle } from 'lucide-react';

const HeaderActions = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div className="flex items-center gap-3">
      <NotificationSystem />
      
      {isAuthenticated ? (
        <Link to="/profile">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-guardian-50 flex items-center justify-center border border-guardian-100">
              <UserCircle className="text-guardian-700" size={20} />
            </div>
            <span className="text-sm font-medium hidden sm:inline-block">
              {user?.email?.split('@')[0] || 'Profile'}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="outline" size="sm">Log in</Button>
          </Link>
          <Link to="/signup" className="hidden sm:block">
            <Button variant="primary" size="sm">Sign up</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderActions;
