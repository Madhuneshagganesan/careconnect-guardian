
import React from 'react';
import CaregiverCard from './CaregiverCard';
import Button from '@/components/ui/Button';
import { Caregiver } from '@/types/caregiver';

interface CaregiverListProps {
  caregivers: Caregiver[];
  searchTerm: string;
  selectedFilter: string;
  setSearchTerm: (term: string) => void;
  setSelectedFilter: (filter: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: number, name: string) => void;
}

const CaregiverList: React.FC<CaregiverListProps> = ({
  caregivers,
  searchTerm,
  selectedFilter,
  setSearchTerm,
  setSelectedFilter,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium">
            {caregivers.length} caregivers available
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caregivers.map((caregiver, index) => (
            <CaregiverCard
              key={caregiver.id}
              caregiver={caregiver}
              isFavorite={isFavorite(caregiver.id.toString())}
              onToggleFavorite={onToggleFavorite}
              index={index}
            />
          ))}
        </div>
        
        {caregivers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No caregivers match your search criteria</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaregiverList;
