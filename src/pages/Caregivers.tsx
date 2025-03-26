
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/ui/AnimatedCard';
import Button from '@/components/ui/Button';
import RequestCustomMatch from '@/components/forms/RequestCustomMatch';
import { Link } from 'react-router-dom';
import { Star, Filter, Search, MapPin, CheckCircle, Clock, Award } from 'lucide-react';

const Caregivers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const caregivers = [
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header */}
        <section className="bg-guardian-50 py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Caregiver</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Browse through our network of verified caregivers, each specializing in different aspects of care
              </p>
              
              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Search by name, specialty, or service..."
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <select
                      className="pl-10 pr-8 py-2 border border-input rounded-lg appearance-none bg-transparent focus:outline-none focus:ring-2 focus:ring-guardian-400"
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                      {filters.map(filter => (
                        <option key={filter.id} value={filter.id}>
                          {filter.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.map(filter => (
                  <button
                    key={filter.id}
                    className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-guardian-500 text-white'
                        : 'bg-white border border-border text-muted-foreground hover:bg-guardian-50 hover:text-guardian-500'
                    }`}
                    onClick={() => setSelectedFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Caregivers List */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium">
                {filteredCaregivers.length} caregivers available
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCaregivers.map((caregiver, index) => (
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
                      <Link to={`/caregivers/${caregiver.id}`}>
                        <Button variant="secondary" fullWidth>
                          View Profile
                        </Button>
                      </Link>
                      <Link to={`/book-service?caregiver=${caregiver.id}`}>
                        <Button variant="primary" fullWidth>
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
            
            {filteredCaregivers.length === 0 && (
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
        
        {/* CTA Section */}
        <section className="py-12 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Let us know your specific requirements, and we'll help match you with the perfect caregiver.
              </p>
              <RequestCustomMatch 
                trigger={
                  <Button variant="primary" size="lg">
                    Request a Custom Match
                  </Button>
                }
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Caregivers;
