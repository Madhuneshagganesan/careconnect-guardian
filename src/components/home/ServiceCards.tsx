
import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Heart, Home, Stethoscope, Calendar } from 'lucide-react';
import AnimatedCard from '../ui/AnimatedCard';

const ServiceCards = () => {
  const services = [
    {
      id: 1,
      title: 'Meal Preparation',
      description: 'Nutritious meals tailored to dietary needs and preferences',
      icon: <UtensilsCrossed size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600',
      link: '/services#meal-preparation'
    },
    {
      id: 2,
      title: 'Errands & Shopping',
      description: 'Grocery shopping, prescription pickups, and other errands',
      icon: <ShoppingBag size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600',
      link: '/services#errands'
    },
    {
      id: 3,
      title: 'Personal Care',
      description: 'Assistance with bathing, dressing, and personal hygiene',
      icon: <Heart size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600',
      link: '/services#personal-care'
    },
    {
      id: 4,
      title: 'Household Help',
      description: 'Light housekeeping, laundry, and home organization',
      icon: <Home size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600',
      link: '/services#household'
    },
    {
      id: 5,
      title: 'Medical Assistance',
      description: 'Medication reminders and basic medical support',
      icon: <Stethoscope size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600',
      link: '/services#medical'
    },
    {
      id: 6,
      title: 'Companionship',
      description: 'Social engagement, conversation, and recreational activities',
      icon: <Calendar size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600',
      link: '/services#companionship'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive care services tailored to enhance the quality of life for the elderly and disabled
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link key={service.id} to={service.link}>
              <AnimatedCard 
                delay={index} 
                hoverEffect="lift"
                className="h-full flex flex-col"
              >
                <div className={`${service.iconBg} ${service.iconColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm flex-grow">{service.description}</p>
                <div className="mt-4 text-guardian-500 text-sm font-medium flex items-center">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </AnimatedCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
