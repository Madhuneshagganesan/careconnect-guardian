
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-guardian-50 py-12 mt-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-guardian-600 to-guardian-400 bg-clip-text text-transparent">
                Guardian<span className="text-warm-500">Go</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">
              Connecting the elderly and disabled with verified caregivers for personalized assistance and support services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-guardian-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-guardian-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-guardian-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-guardian-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/caregivers" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Find Caregivers
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-guardian-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                1234 Guardian Street<br />
                Bengaluru, Karnataka 560001
              </li>
              <li className="text-sm text-muted-foreground">
                <a href="tel:+919876543210" className="hover:text-guardian-500 transition-colors">
                  +91 9876 543 210
                </a>
              </li>
              <li className="text-sm text-muted-foreground">
                <a href="mailto:support@guardiango.com" className="hover:text-guardian-500 transition-colors">
                  support@guardiango.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} GuardianGo. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center">
            Made with <Heart size={12} className="mx-1 text-warm-500" /> for those who need care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
