
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Clock, Award, Heart } from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import Button from '@/components/ui/Button';
import { Caregiver } from '@/types/caregiver';

interface CaregiverCardProps {
  caregiver: Caregiver;
  isFavorite: boolean;
  onToggleFavorite: (id: number, name: string) => void;
  index: number;
}

const CaregiverCard: React.FC<CaregiverCardProps> = ({ 
  caregiver, 
  isFavorite, 
  onToggleFavorite,
  index
}) => {
  return (
    <AnimatedCard
      key={caregiver.id}
      delay={index}
      className="h-full"
      hoverEffect="lift"
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
          <div className="h-20 w-20 bg-guardian-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-guardian-400">Photo</span>
          </div>
          
          <div>
            <h3 className="text-xl font-medium">{caregiver.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">{caregiver.specialty}</p>
            <div className="flex items-center mb-1">
              <Star size={16} className="text-yellow-500 mr-1" />
              <span className="font-medium">{caregiver.rating}</span>
              <span className="text-muted-foreground text-sm ml-1">({caregiver.reviews} reviews)</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={14} className="mr-1" />
              <span>{caregiver.distance}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-sm font-medium mb-1">Services</p>
          <div className="flex flex-wrap gap-1.5">
            {caregiver.services.map(service => (
              <span key={service} className="px-2 py-0.5 text-xs bg-guardian-50 text-guardian-700 rounded-full">
                {service}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {caregiver.badges.map((badge) => (
            <span 
              key={badge} 
              className={`px-2 py-0.5 text-xs rounded-full flex items-center ${
                badge === 'Verified' 
                  ? 'bg-green-100 text-green-700' 
                  : badge === 'Top Rated'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-guardian-100 text-guardian-700'
              }`}
            >
              {badge === 'Verified' && <CheckCircle size={10} className="mr-1" />}
              {badge === 'Top Rated' && <Award size={10} className="mr-1" />}
              {badge}
            </span>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">Experience</p>
            <p className="font-medium">{caregiver.experience}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Hourly Rate</p>
            <p className="font-medium">{caregiver.hourlyRate}/hr</p>
          </div>
        </div>
        
        <div className="bg-guardian-50 rounded-lg px-3 py-2 mb-4 flex items-center text-sm">
          <Clock size={16} className="text-guardian-500 mr-2" />
          <span className={caregiver.availability.includes('Now') ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
            {caregiver.availability}
          </span>
        </div>
        
        <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
          <Link to={`/caregiver/${caregiver.id}`} className="inline-block">
            <Button 
              variant="secondary"
              className="w-full" 
            >
              View Profile
            </Button>
          </Link>
          <Button 
            variant="primary"
            onClick={() => onToggleFavorite(caregiver.id, caregiver.name)}
          >
            <Heart 
              size={16} 
              className="mr-1" 
              fill={isFavorite ? "currentColor" : "none"} 
            />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default CaregiverCard;
