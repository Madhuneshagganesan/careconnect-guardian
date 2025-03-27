
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorksSection from '@/components/home/HowItWorks';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';

const HowItWorks = () => {
  const faqs = [
    {
      question: 'How do I book a caregiver?',
      answer: 'You can book a caregiver through our app by navigating to the "Book a Service" page, selecting your preferred service type, location, date, and time. You can either choose a specific caregiver or let us match you with the best available professional.'
    },
    {
      question: 'What types of care services do you offer?',
      answer: 'We offer a wide range of care services including personal care, companion care, specialized care for seniors, physiotherapy assistance, medication management, and overnight care. All our services can be customized to meet your specific needs.'
    },
    {
      question: 'How are your caregivers vetted?',
      answer: 'All caregivers on our platform undergo a rigorous verification process that includes background checks, license verification, reference checks, and interviews. We also monitor ratings and reviews to ensure ongoing quality of service.'
    },
    {
      question: 'What happens if I need to cancel or reschedule?',
      answer: 'You can cancel or reschedule a booking up to 24 hours before the scheduled service time without any penalty. Cancellations made less than 24 hours in advance may incur a fee depending on the circumstances.'
    },
    {
      question: 'How does payment work?',
      answer: 'We offer secure payment processing through our platform. You can pay using credit/debit cards or other digital payment methods. Payment is typically processed after the service is completed to ensure your satisfaction.'
    },
    {
      question: 'Can I request the same caregiver for future services?',
      answer: 'Yes, if you're happy with a particular caregiver, you can add them to your favorites and request them for future bookings. Subject to their availability, we'll prioritize matching you with your preferred caregivers.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">How Guardian Go Works</h1>
              <p className="text-xl text-muted-foreground mb-8">
                A simple, secure process to connect you with qualified caregivers
              </p>
              <Link to="/book-service">
                <Button variant="primary" size="lg">
                  Get Started Now
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Steps */}
        <section className="py-16 md:py-24">
          <HowItWorksSection />
        </section>
        
        {/* Features */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-lg text-muted-foreground">
                Discover what makes Guardian Go the preferred choice for care services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Tracking",
                  description: "Monitor your caregiver's location and estimated arrival time for complete peace of mind."
                },
                {
                  title: "Secure Messaging",
                  description: "Communicate directly with your caregiver through our secure in-app messaging system."
                },
                {
                  title: "Voice Assistant",
                  description: "Use voice commands to book services, check status, or get help in emergency situations."
                },
                {
                  title: "Customized Care Plans",
                  description: "Create detailed care plans that can be shared with all your assigned caregivers."
                },
                {
                  title: "Transparent Pricing",
                  description: "See clear pricing information with no hidden fees or unexpected charges."
                },
                {
                  title: "Quality Assurance",
                  description: "Rate and review services to help maintain our high standards of care."
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 border border-border hover:border-guardian-300 transition-colors">
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our services
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto divide-y divide-border">
              {faqs.map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-xl font-medium mb-3 flex items-start">
                    <HelpCircle className="text-guardian-500 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-muted-foreground pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 md:py-24 bg-guardian-500 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Better Care?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join thousands of families who trust Guardian Go for their care needs
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/book-service">
                  <Button variant="white" size="lg">
                    Book a Service Now
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/caregivers">
                  <Button variant="white-outline" size="lg">
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
