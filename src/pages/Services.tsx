
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { UtensilsCrossed, ShoppingBag, Heart, Home, Stethoscope, Calendar, ArrowRight } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Meal Preparation',
      description: 'Nutritious meals tailored to dietary needs and preferences. Our caregivers can prepare meals according to specific dietary restrictions and preferences, ensuring proper nutrition and hydration.',
      icon: <UtensilsCrossed size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600',
      benefits: [
        'Personalized meal planning',
        'Dietary restriction accommodation',
        'Grocery shopping assistance',
        'Meal prep for multiple days'
      ]
    },
    {
      id: 2,
      title: 'Errands & Shopping',
      description: 'Grocery shopping, prescription pickups, and other errands handled with care. We ensure all your essential needs are met without you having to leave your home.',
      icon: <ShoppingBag size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600',
      benefits: [
        'Grocery shopping with detailed lists',
        'Prescription medication pickup',
        'Bill payments and postal services',
        'Personal shopping assistance'
      ]
    },
    {
      id: 3,
      title: 'Personal Care',
      description: 'Assistance with bathing, dressing, and personal hygiene provided with dignity and respect. Our caregivers are trained to provide compassionate care while maintaining privacy.',
      icon: <Heart size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600',
      benefits: [
        'Bathing and showering assistance',
        'Grooming and dressing help',
        'Mobility assistance',
        'Toileting and incontinence care'
      ]
    },
    {
      id: 4,
      title: 'Household Help',
      description: 'Light housekeeping, laundry, and home organization to maintain a clean and safe living environment. We help keep your home comfortable and hazard-free.',
      icon: <Home size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600',
      benefits: [
        'Regular cleaning and tidying',
        'Laundry and linen changing',
        'Organization and decluttering',
        'Light maintenance tasks'
      ]
    },
    {
      id: 5,
      title: 'Medical Assistance',
      description: 'Medication reminders and basic medical support to ensure proper health management. Our caregivers can help monitor health conditions and coordinate with healthcare providers.',
      icon: <Stethoscope size={24} />,
      iconBg: 'bg-guardian-100',
      iconColor: 'text-guardian-600',
      benefits: [
        'Medication management and reminders',
        'Vital signs monitoring',
        'Doctor appointment coordination',
        'Recovery assistance after hospital stays'
      ]
    },
    {
      id: 6,
      title: 'Companionship',
      description: 'Social engagement, conversation, and recreational activities to combat loneliness and improve mental wellbeing. Our caregivers provide emotional support and meaningful interaction.',
      icon: <Calendar size={24} />,
      iconBg: 'bg-warm-100',
      iconColor: 'text-warm-600',
      benefits: [
        'Engaging conversations and activities',
        'Cognitive stimulation games',
        'Accompaniment to social events',
        'Emotional support and friendship'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header */}
        <section className="py-12 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive care services tailored to enhance the quality of life for the elderly and disabled
              </p>
            </div>
          </div>
        </section>
        
        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <AnimatedCard 
                  key={service.id} 
                  delay={index} 
                  className="h-full"
                >
                  <div className="flex flex-col h-full p-6">
                    <div className={`${service.iconBg} ${service.iconColor} w-14 h-14 rounded-full flex items-center justify-center mb-6`}>
                      {service.icon}
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    
                    <div className="mt-auto">
                      <h3 className="font-medium mb-2">Benefits:</h3>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start">
                            <ArrowRight size={16} className="text-guardian-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        variant="primary" 
                        to="/book-service"
                      >
                        Book This Service
                      </Button>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a Customized Care Package?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                We can create personalized care plans that combine multiple services to meet your unique needs.
              </p>
              <Button variant="primary" size="lg" to="/book-service">
                Contact Us For Custom Services
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
