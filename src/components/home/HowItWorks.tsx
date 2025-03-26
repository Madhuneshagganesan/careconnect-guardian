
import React from 'react';
import { Search, Calendar, MapPin, CreditCard } from 'lucide-react';

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

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Guardian Go Works</h2>
          <p className="text-lg text-muted-foreground">
            Our simple process ensures you can get the care you need quickly and reliably
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
          <p className="text-lg font-medium bg-guardian-50 inline-block px-6 py-3 rounded-full">
            Ready to experience effortless care? <a href="/book-service" className="text-guardian-500 underline underline-offset-2">Book a service today</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
