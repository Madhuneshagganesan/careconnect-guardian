
import React, { useState } from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
}

interface ServiceSelectionProps {
  services: Service[];
  selectedService: string;
  setSelectedService: (id: string) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  services, 
  selectedService, 
  setSelectedService 
}) => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    
    // Show a toast notification when a service is selected
    const service = services.find(s => s.id === serviceId);
    if (service) {
      toast({
        title: `${service.title} selected`,
        description: "You can change this selection at any time.",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <AnimatedCard
            key={service.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedService === service.id
                ? 'border-guardian-500 bg-guardian-50'
                : hoveredService === service.id
                ? 'border-guardian-200 bg-guardian-50/50'
                : 'border-border hover:border-guardian-200 hover:bg-guardian-50/50'
            }`}
            onClick={() => handleServiceSelect(service.id)}
            onMouseEnter={() => setHoveredService(service.id)}
            onMouseLeave={() => setHoveredService(null)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{service.title}</h3>
              {selectedService === service.id && (
                <CheckCircle size={18} className="text-guardian-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">₹{service.price}/hour</p>
              <div className="flex items-center text-amber-500">
                <Star size={14} fill="currentColor" />
                <span className="text-xs ml-1">Top rated</span>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
