
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchDialog from '@/components/search/SearchDialog';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Caregivers', path: '/caregivers' },
    { name: 'Services', path: '/services' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
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
            
            <Link 
              to="/profile" 
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-guardian-50 hover:text-guardian-500"
              aria-label="User profile"
            >
              <User size={20} />
            </Link>
            
            <button
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-guardian-50 hover:text-guardian-500"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
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
    </header>
  );
};

export default Navbar;
