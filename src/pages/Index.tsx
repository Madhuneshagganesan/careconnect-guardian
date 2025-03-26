
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ServiceCards from '@/components/home/ServiceCards';
import CaregiversPreview from '@/components/home/CaregiversPreview';
import HowItWorks from '@/components/home/HowItWorks';
import TestimonialSlider from '@/components/home/TestimonialSlider';
import Button from '@/components/ui/Button';
import { ArrowRight, Star, Shield, Clock, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const features = [
    {
      icon: <Shield size={24} />,
      title: 'Verified Caregivers',
      description: 'Every caregiver undergoes a rigorous verification process for your safety'
    },
    {
      icon: <Clock size={24} />,
      title: 'Real-time Tracking',
      description: 'Monitor the location and arrival time of your caregiver'
    },
    {
      icon: <Star size={24} />,
      title: 'Quality Assurance',
      description: 'Our rating system ensures continued high standards of service'
    },
    {
      icon: <Headphones size={24} />,
      title: '24/7 Support',
      description: 'Our team is always available to assist you with any queries'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <ServiceCards />
        
        {/* Why Choose Us */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Guardian Go</h2>
              <p className="text-lg text-muted-foreground">
                We're committed to delivering care that's reliable, transparent, and tailored to individual needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-white shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-guardian-50 flex items-center justify-center mb-4 text-guardian-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <CaregiversPreview />
        <HowItWorks />
        <TestimonialSlider />
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Effortless Care?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of families who trust Guardian Go for reliable and compassionate caregiving services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/book-service">
                  <Button variant="primary" size="lg">
                    Book a Caregiver Now
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
