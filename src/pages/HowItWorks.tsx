
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Search, Calendar, MapPin, CreditCard, PhoneCall, UserCheck, Headphones, CheckCircle, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Find the Right Caregiver',
      description: 'Browse through our network of verified caregivers based on your specific needs and location.',
      icon: <Search size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600'
    },
    {
      id: 2,
      title: 'Book a Service',
      description: 'Schedule a one-time service or set up recurring sessions through our easy booking interface.',
      icon: <Calendar size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600'
    },
    {
      id: 3,
      title: 'Track in Real-time',
      description: "Monitor your caregiver's location and ETA from the moment they accept your request.",
      icon: <MapPin size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600'
    },
    {
      id: 4,
      title: 'Secure Payment',
      description: 'Pay securely through our platform with multiple payment options and transparent pricing.',
      icon: <CreditCard size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600'
    }
  ];

  const features = [
    {
      title: 'Verified Caregivers',
      description: 'Every caregiver undergoes thorough background checks, skill assessments, and reference verification.',
      icon: <Shield size={24} />,
    },
    {
      title: 'Transparent Ratings',
      description: 'View detailed ratings and reviews from other clients to make informed decisions.',
      icon: <Star size={24} />,
    },
    {
      title: 'Flexible Booking',
      description: 'Book services on-demand or schedule regular care sessions based on your needs.',
      icon: <Calendar size={24} />,
    },
    {
      title: 'Live Tracking',
      description: 'Know exactly when your caregiver will arrive with real-time location tracking.',
      icon: <MapPin size={24} />,
    },
    {
      title: 'Secure Payments',
      description: 'All transactions are processed securely with transparent pricing and no hidden fees.',
      icon: <CreditCard size={24} />,
    },
    {
      title: '24/7 Support',
      description: 'Our support team is available around the clock to assist with any issues or questions.',
      icon: <Headphones size={24} />,
    },
  ];

  const faqs = [
    {
      question: 'How do you verify caregivers?',
      answer: 'We conduct thorough background checks, verify professional credentials, check references, and assess skills through interviews and tests. All caregivers must also complete our training program.'
    },
    {
      question: 'Can I book a caregiver for the same day?',
      answer: 'Yes, you can request same-day care through our app. While we can't guarantee availability for immediate service, we typically can arrange care within a few hours.'
    },
    {
      question: 'What happens if I need to cancel a booking?',
      answer: 'Cancellations made at least 24 hours before the scheduled service are fully refunded. For cancellations with less notice, a cancellation fee may apply.'
    },
    {
      question: 'How do I pay for services?',
      answer: 'Payment is processed securely through our app. You can use credit/debit cards, UPI, or digital wallets. Payment is only processed after the service is completed.'
    },
    {
      question: 'Can I request the same caregiver for future bookings?',
      answer: 'Yes, you can mark caregivers as favorites and request them for future bookings. Subject to their availability, we'll prioritize matching you with your preferred caregivers.'
    },
    {
      question: 'What if I'm not satisfied with the service?',
      answer: 'Your satisfaction is our priority. If you're not completely satisfied, please contact our customer support team within 24 hours of service completion, and we'll work to resolve your concerns.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">How Guardian Go Works</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Our platform connects you with trusted caregivers in a seamless, transparent process
              </p>
              <Link to="/book-service">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Step by Step Process */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Simple Process</h2>
              <p className="text-muted-foreground">
                Getting the care you need is just four easy steps away
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: `${step.id * 0.1}s` }}>
                  <div className="relative mb-8">
                    <div className={`${step.iconBg} ${step.iconColor} w-16 h-16 rounded-full flex items-center justify-center mb-4 z-10 relative`}>
                      {step.icon}
                    </div>
                    {step.id < steps.length && (
                      <div className="absolute top-8 left-full w-full h-0.5 bg-guardian-100 -z-10 hidden lg:block" style={{ width: 'calc(100% - 4rem)' }}></div>
                    )}
                    <div className="absolute top-0 left-0 -z-10 w-6 h-6 text-sm font-bold rounded-full bg-guardian-500 text-white flex items-center justify-center">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/book-service">
                <Button variant="primary" size="lg">
                  Book a Service
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Video Walkthrough */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">See Guardian Go in Action</h2>
              <p className="text-muted-foreground mb-8">
                Watch how our platform connects you with qualified caregivers in minutes
              </p>
              
              <div className="bg-white rounded-xl border border-border shadow-sm aspect-video flex items-center justify-center">
                <div className="text-muted-foreground">Video Placeholder</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Platform Features</h2>
              <p className="text-muted-foreground">
                Designed with care, safety, and convenience in mind
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-border shadow-sm animate-fade-in"
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
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our services
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto divide-y divide-border">
              {faqs.map((faq, index) => (
                <div key={index} className="py-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <h3 className="text-lg font-medium mb-3 flex items-start">
                    <CheckCircle size={20} className="text-guardian-500 mr-2 mt-1 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions? We're here to help.
              </p>
              <Link to="/about-us">
                <Button variant="outline" size="lg" className="mr-4">
                  <PhoneCall size={18} className="mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-guardian-500 to-guardian-600 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Experience Effortless Care?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of families who trust Guardian Go for reliable and compassionate caregiving services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/book-service">
                  <Button variant="primary" size="lg" className="bg-white text-guardian-600 hover:bg-gray-100">
                    Book a Caregiver
                  </Button>
                </Link>
                <Link to="/caregivers">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-guardian-600">
                    Browse Caregivers
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

export default HowItWorks;
