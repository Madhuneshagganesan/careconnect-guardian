
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, BellRing, Check, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLiveTracking } from '@/providers/LiveTrackingProvider';

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
  const { trackingData } = useLiveTracking();

  // Helper function to add a notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      time: new Date(),
      read: false,
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
    
    toast({
      title: notification.title,
      description: notification.message,
    });
    
    return newNotification.id;
  }, []);

  // Check for unread notifications
  useEffect(() => {
    const unreadExists = notifications.some(notification => !notification.read);
    setHasUnread(unreadExists);
  }, [notifications]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        parsedNotifications.forEach((notif: any) => {
          notif.time = new Date(notif.time);
        });
        setNotifications(parsedNotifications);
      } catch (e) {
        console.error("Error parsing notifications:", e);
      }
    }
  }, []);

  // Track caregiver status changes and generate notifications
  useEffect(() => {
    if (trackingData) {
      const statusNotificationKey = `status_${trackingData.status}`;
      const hasShownStatus = localStorage.getItem(statusNotificationKey);
      
      if (!hasShownStatus) {
        let message = "";
        let type: 'info' | 'success' | 'warning' | 'error' = 'info';
        
        switch (trackingData.status) {
          case 'assigned':
            message = "A caregiver has been assigned to your booking.";
            break;
          case 'on_the_way':
            message = `Your caregiver is on the way and will arrive in approximately ${trackingData.eta} minutes.`;
            break;
          case 'arrived':
            message = "Your caregiver has arrived at the destination.";
            type = 'success';
            break;
          case 'started':
            message = "Your service has started.";
            type = 'success';
            break;
          case 'completed':
            message = "Your service has been completed. Please rate your experience.";
            type = 'success';
            break;
        }
        
        if (message) {
          addNotification({
            title: `Caregiver ${trackingData.status}`,
            message,
            type,
            link: '/profile'
          });
          
          localStorage.setItem(statusNotificationKey, 'true');
        }
      }
    }
  }, [trackingData, addNotification]);

  // Simulate receiving a caregiver notification after 5 seconds if there are none
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications.length === 0) {
        addNotification({
          title: 'Caregiver Update',
          message: 'Your caregiver is on the way and will arrive in 15 minutes.',
          type: 'info',
          link: '/profile'
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
        addNotification(randomType);
      }
    }, 60000); // Check once per minute

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [addNotification, notifications.length]);

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

  const getNotificationTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-guardian-50 border-guardian-200';
    }
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
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
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
                  className="text-xs text-guardian-600 hover:text-guardian-800 flex items-center"
                >
                  <Check size={12} className="mr-1" /> Mark all as read
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
                          notification.read ? 'bg-white' : getNotificationTypeStyles(notification.type)
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
                        {notification.link && (
                          <div className="flex justify-end mt-2">
                            <span className="text-xs text-guardian-600 flex items-center">
                              View details <ArrowRight size={10} className="ml-1" />
                            </span>
                          </div>
                        )}
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
