
import React from 'react';
import { CheckCircle } from 'lucide-react';

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
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedService === service.id
                ? 'border-guardian-500 bg-guardian-50'
                : 'border-border hover:border-guardian-200 hover:bg-guardian-50/50'
            }`}
            onClick={() => setSelectedService(service.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{service.title}</h3>
              {selectedService === service.id && (
                <CheckCircle size={18} className="text-guardian-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
            <p className="text-sm font-medium">₹{service.price}/hour</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
