
import React, { useState, useEffect } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: Date;
  read: boolean;
  link?: string;
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const navigate = useNavigate();

  // Check for unread notifications
  useEffect(() => {
    const unreadExists = notifications.some(notification => !notification.read);
    setHasUnread(unreadExists);
  }, [notifications]);

  // Simulate receiving real-time notifications
  useEffect(() => {
    // Load notifications from localStorage on mount
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      // Convert string dates back to Date objects
      parsedNotifications.forEach((notif: any) => {
        notif.time = new Date(notif.time);
      });
      setNotifications(parsedNotifications);
    }

    // Simulate receiving a caregiver notification after 5 seconds if there are none
    const timer = setTimeout(() => {
      if (notifications.length === 0) {
        const newNotification = {
          id: Date.now().toString(),
          title: 'Caregiver Update',
          message: 'Your caregiver is on the way and will arrive in 15 minutes.',
          type: 'info' as const,
          time: new Date(),
          read: false,
          link: '/profile'
        };
        
        setNotifications(prev => {
          const updated = [...prev, newNotification];
          localStorage.setItem('notifications', JSON.stringify(updated));
          return updated;
        });
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    }, 5000);

    // Set up simulated interval for generating notifications based on user activity
    const interval = setInterval(() => {
      // Random chance to generate a notification (10% chance every minute)
      if (Math.random() < 0.1) {
        const notificationTypes = [
          {
            title: 'Payment Confirmed',
            message: 'Your recent payment was successfully processed.',
            type: 'success' as const,
            link: '/profile'
          },
          {
            title: 'Caregiver Arrived',
            message: 'Your caregiver has arrived at the destination.',
            type: 'info' as const,
            link: '/profile'
          },
          {
            title: 'Service Rating',
            message: 'Please rate your recent caregiving service.',
            type: 'info' as const,
            link: '/profile'
          },
        ];

        const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        const newNotification = {
          id: Date.now().toString(),
          title: randomType.title,
          message: randomType.message,
          type: randomType.type,
          time: new Date(),
          read: false,
          link: randomType.link
        };
        
        setNotifications(prev => {
          const updated = [...prev, newNotification];
          localStorage.setItem('notifications', JSON.stringify(updated));
          return updated;
        });
        
        toast({
          title: randomType.title,
          description: randomType.message,
        });
      }
    }, 60000); // Check once per minute

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    setShowNotifications(false);
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
        aria-label="Notifications"
      >
        {hasUnread ? (
          <BellRing size={20} className="text-guardian-500" />
        ) : (
          <Bell size={20} />
        )}
        {hasUnread && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {showNotifications && (
        <>
          {/* Backdrop for closing notifications */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowNotifications(false)}
          ></div>
          
          {/* Notifications panel */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-50 animate-fade-in">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              {hasUnread && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs text-guardian-600 hover:text-guardian-800"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div>
                  {notifications
                    .sort((a, b) => b.time.getTime() - a.time.getTime())
                    .map(notification => (
                      <div 
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-border cursor-pointer transition-colors ${
                          notification.read ? 'bg-white' : 'bg-guardian-50'
                        } hover:bg-muted/20`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-medium ${!notification.read ? 'text-guardian-700' : ''}`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(notification.time)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-border text-center">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/profile');
                  setShowNotifications(false);
                }}
                className="text-sm text-guardian-600 hover:text-guardian-800"
              >
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
