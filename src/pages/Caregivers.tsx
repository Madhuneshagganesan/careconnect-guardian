
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useFavoriteCaregivers } from '@/hooks/useFavoriteCaregivers';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PrivacySettingsDialog } from '@/components/settings/PrivacySettingsDialog';
import SearchFilterBar from '@/components/caregivers/SearchFilterBar';
import FilterPills from '@/components/caregivers/FilterPills';
import CaregiverList from '@/components/caregivers/CaregiverList';
import CTASection from '@/components/caregivers/CTASection';
import { Caregiver } from '@/types/caregiver';

const Caregivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const caregivers: Caregiver[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      specialty: 'Elder Care Specialist',
      rating: 4.9,
      reviews: 156,
      experience: '7 years',
      hourlyRate: '₹350',
      location: 'Indiranagar, Bangalore',
      distance: '2.3 km away',
      services: ['Meal Preparation', 'Personal Care', 'Medical Assistance'],
      availability: 'Available Now',
      imageUrl: '',
      badges: ['Verified', 'First Aid Certified', 'Top Rated']
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      specialty: 'Physiotherapy Assistant',
      rating: 4.8,
      reviews: 124,
      experience: '5 years',
      hourlyRate: '₹380',
      location: 'Koramangala, Bangalore',
      distance: '3.5 km away',
      services: ['Medical Assistance', 'Mobility Support', 'Exercise Assistance'],
      availability: 'Available in 2 hours',
      imageUrl: '',
      badges: ['Verified', 'Medical Training']
    },
    {
      id: 3,
      name: 'Ananya Patel',
      specialty: 'Personal Care Aide',
      rating: 4.9,
      reviews: 212,
      experience: '6 years',
      hourlyRate: '₹320',
      location: 'HSR Layout, Bangalore',
      distance: '4.1 km away',
      services: ['Personal Care', 'Household Help', 'Companionship'],
      availability: 'Available from tomorrow',
      imageUrl: '',
      badges: ['Verified', 'CPR Certified', 'Top Rated']
    },
    {
      id: 4,
      name: 'Vikram Singh',
      specialty: 'Home Health Aide',
      rating: 4.7,
      reviews: 98,
      experience: '4 years',
      hourlyRate: '₹300',
      location: 'Whitefield, Bangalore',
      distance: '8.2 km away',
      services: ['Medical Assistance', 'Personal Care', 'Errands'],
      availability: 'Available Now',
      imageUrl: '',
      badges: ['Verified', 'First Aid Certified']
    },
    {
      id: 5,
      name: 'Deepa Nair',
      specialty: 'Senior Care Specialist',
      rating: 4.9,
      reviews: 173,
      experience: '8 years',
      hourlyRate: '₹400',
      location: 'JP Nagar, Bangalore',
      distance: '5.7 km away',
      services: ['Meal Preparation', 'Medication Management', 'Companionship'],
      availability: 'Available in 3 hours',
      imageUrl: '',
      badges: ['Verified', 'Nursing Assistant', 'Top Rated']
    },
    {
      id: 6,
      name: 'Sanjay Reddy',
      specialty: 'Disability Support Worker',
      rating: 4.8,
      reviews: 131,
      experience: '6 years',
      hourlyRate: '₹360',
      location: 'Jayanagar, Bangalore',
      distance: '6.3 km away',
      services: ['Mobility Support', 'Personal Care', 'Household Help'],
      availability: 'Available from tomorrow',
      imageUrl: '',
      badges: ['Verified', 'Specialized Training']
    }
  ];
  
  const filters = [
    { id: 'all', label: 'All Caregivers' },
    { id: 'available-now', label: 'Available Now' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'medical', label: 'Medical Assistance' },
    { id: 'personal-care', label: 'Personal Care' },
    { id: 'household', label: 'Household Help' }
  ];
  
  const { favorites, toggleFavorite, isFavorite } = useFavoriteCaregivers();
  const { user } = useAuth();

  const filteredCaregivers = caregivers.filter(caregiver => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         caregiver.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caregiver.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'available-now') return matchesSearch && caregiver.availability.includes('Available Now');
    if (selectedFilter === 'top-rated') return matchesSearch && caregiver.badges.includes('Top Rated');
    if (selectedFilter === 'medical') return matchesSearch && caregiver.services.includes('Medical Assistance');
    if (selectedFilter === 'personal-care') return matchesSearch && caregiver.services.includes('Personal Care');
    if (selectedFilter === 'household') return matchesSearch && caregiver.services.includes('Household Help');
    
    return matchesSearch;
  });

  const handleFavoriteToggle = async (caregiverId: number, name: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save favorites",
          variant: "destructive",
        });
        return;
      }
      
      const isNowFavorite = await toggleFavorite(caregiverId.toString());
      
      if (isNowFavorite) {
        toast({
          title: "Added to Favorites",
          description: `${name} has been added to your favorites`,
        });
      } else {
        toast({
          title: "Removed from Favorites",
          description: `${name} has been removed from your favorites`,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header */}
        <section className="bg-guardian-50 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">Find Your Perfect Caregiver</h1>
                <PrivacySettingsDialog />
              </div>
              
              {/* Search and Filter */}
              <SearchFilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                filters={filters}
              />
              
              {/* Filter Pills */}
              <FilterPills 
                filters={filters}
                selectedFilter={selectedFilter}
                onFilterSelect={setSelectedFilter}
              />
            </div>
          </div>
        </section>
        
        {/* Caregivers List */}
        <CaregiverList 
          caregivers={filteredCaregivers}
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          setSearchTerm={setSearchTerm}
          setSelectedFilter={setSelectedFilter}
          isFavorite={isFavorite}
          onToggleFavorite={handleFavoriteToggle}
        />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Caregivers;
