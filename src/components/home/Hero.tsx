
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Calendar, Phone } from 'lucide-react';
import Button from '../ui/Button';

const Hero = () => {
  return (
    <section className="pt-32 pb-12 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center">
          {/* Hero Content */}
          <div className="w-full md:w-1/2 space-y-6 md:pr-12 mb-10 md:mb-0">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-guardian-200 bg-guardian-50 text-guardian-600 text-sm font-medium animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span>Supporting independence with care</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <span className="text-foreground">Reliable caregivers at your </span>
              <span className="bg-gradient-to-r from-guardian-600 to-guardian-400 bg-clip-text text-transparent">fingertips</span>
            </h1>
            
            <p className="text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Guardian Go connects you with verified caregivers who provide personalized assistance for the elderly and disabled—making everyday life easier and more independent.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/book-service">
                <Button variant="primary" size="lg">
                  Book a Caregiver
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/caregivers">
                <Button variant="outline" size="lg">
                  Browse Caregivers
                </Button>
              </Link>
            </div>
            
            <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <p className="text-sm text-muted-foreground mb-3">Trusted by families across India</p>
              <div className="flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-guardian-100" />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-foreground">4.9/5</span>
                  <span className="text-muted-foreground ml-1">(2,000+ reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Features */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative">
              {/* Main image placeholder */}
              <div className="w-full h-[450px] rounded-3xl bg-gradient-to-br from-guardian-100 to-guardian-50 shadow-lg overflow-hidden relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="absolute inset-0 bg-guardian-500/5 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center text-guardian-300">
                  <span className="text-lg">Caregiver and user interaction image</span>
                </div>
              </div>
              
              {/* Feature cards */}
              <div className="absolute -left-12 top-12 w-64 glassmorphism rounded-xl p-4 shadow-lg animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-start">
                  <div className="mr-3 rounded-full bg-guardian-100 p-2">
                    <Search size={20} className="text-guardian-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Find Caregivers</h3>
                    <p className="text-xs text-muted-foreground mt-1">Browse through verified caregivers in your area</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-12 top-1/3 w-64 glassmorphism rounded-xl p-4 shadow-lg animate-slide-in-right" style={{ animationDelay: '0.7s' }}>
                <div className="flex items-start">
                  <div className="mr-3 rounded-full bg-warm-100 p-2">
                    <Calendar size={20} className="text-warm-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Easy Booking</h3>
                    <p className="text-xs text-muted-foreground mt-1">Schedule services with just a few taps</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 left-1/4 w-64 glassmorphism rounded-xl p-4 shadow-lg animate-slide-up" style={{ animationDelay: '0.9s' }}>
                <div className="flex items-start">
                  <div className="mr-3 rounded-full bg-guardian-100 p-2">
                    <Phone size={20} className="text-guardian-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">24/7 Support</h3>
                    <p className="text-xs text-muted-foreground mt-1">Our team is always here to help you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
