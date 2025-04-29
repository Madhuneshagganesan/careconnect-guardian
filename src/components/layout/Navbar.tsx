import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Bell, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchDialog from '@/components/search/SearchDialog';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Caregivers', path: '/caregivers' },
    { name: 'Services', path: '/services' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about-us' },  // Updated from '/about' to '/about-us'
  ];
  
  const mockNotifications = [
    {
      id: 1,
      title: 'Caregiver Assigned',
      message: 'Sarah Johnson has been assigned to your booking.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Booking Confirmed',
      message: 'Your booking for tomorrow at 2:00 PM has been confirmed.',
      time: '1 day ago',
      unread: false
    },
    {
      id: 3,
      title: 'Payment Processed',
      message: 'Your payment of $120 has been successfully processed.',
      time: '3 days ago',
      unread: false
    }
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const markAllAsRead = () => {
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };
  
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center text-2xl font-bold text-guardian-600 transition-all hover:text-guardian-700"
          >
            <span className="bg-gradient-to-r from-guardian-600 to-guardian-400 bg-clip-text text-transparent">
              Guardian<span className="text-warm-500">Go</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-guardian-500 relative ${
                    location.pathname === link.path
                      ? 'text-guardian-500 after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-full after:bg-guardian-500 after:content-[""]'
                      : 'text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <SearchDialog
              trigger={
                <button
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-guardian-50 hover:text-guardian-500"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              }
            />
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-guardian-50 hover:text-guardian-500"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {mockNotifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-medium">Notifications</h3>
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-guardian-500 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.length > 0 ? (
                      <div className="divide-y divide-border">
                        {mockNotifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${notification.unread ? 'bg-guardian-50/40' : ''}`}
                          >
                            <div className="flex justify-between mb-1">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{notification.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-border text-center">
                    <Link 
                      to="/profile" 
                      className="text-xs text-guardian-500 hover:underline"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-guardian-50 hover:text-guardian-500">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-guardian-100 text-guardian-800">
                        {user?.name.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="p-2 border-b border-border">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/book-service" className="cursor-pointer">
                      Book a Service
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={() => setShowLogoutDialog(true)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/login" 
                className="hidden md:flex rounded-full p-2 text-muted-foreground transition-colors hover:bg-guardian-50 hover:text-guardian-500"
                aria-label="User profile"
              >
                <User size={20} />
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-guardian-50 hover:text-guardian-500"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            
            {!isMobile && (
              <Link
                to="/book-service"
                className="hidden md:inline-flex items-center justify-center rounded-full bg-guardian-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-guardian-600 focus:outline-none focus:ring-2 focus:ring-guardian-500 focus:ring-offset-2"
              >
                Book a Caregiver
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border animate-slide-down">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-guardian-50 text-guardian-500'
                      : 'text-foreground hover:bg-muted hover:text-guardian-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-2 py-1.5 text-sm font-medium rounded-lg transition-colors text-foreground hover:bg-muted hover:text-guardian-500"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="px-2 py-1.5 text-sm font-medium rounded-lg transition-colors text-red-500 hover:bg-red-50"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-2 py-1.5 text-sm font-medium rounded-lg transition-colors text-foreground hover:bg-muted hover:text-guardian-500"
                >
                  Log in
                </Link>
              )}
              
              <Link
                to="/book-service"
                className="mt-2 flex items-center justify-center rounded-full bg-guardian-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-guardian-600 focus:outline-none focus:ring-2 focus:ring-guardian-500 focus:ring-offset-2"
              >
                Book a Caregiver
              </Link>
            </div>
          </nav>
        )}
      </div>
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Navbar;
