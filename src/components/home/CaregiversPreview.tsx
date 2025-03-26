
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import AnimatedCard from '../ui/AnimatedCard';
import Button from '../ui/Button';

const CaregiversPreview = () => {
  const caregivers = [
    {
      id: 1,
      name: 'Priya Sharma',
      specialty: 'Elder Care Specialist',
      rating: 4.9,
      reviews: 156,
      experience: '7 years',
      hourlyRate: '₹350',
      imageUrl: '',
      badges: ['Verified', 'First Aid Certified']
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      specialty: 'Physiotherapy Assistant',
      rating: 4.8,
      reviews: 124,
      experience: '5 years',
      hourlyRate: '₹380',
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
      imageUrl: '',
      badges: ['Verified', 'CPR Certified']
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-guardian-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Caregivers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Our carefully vetted caregivers bring experience, compassion, and professionalism to every service
            </p>
          </div>
          <Link to="/caregivers">
            <Button variant="outline" className="group">
              View All Caregivers
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {caregivers.map((caregiver, index) => (
            <AnimatedCard 
              key={caregiver.id} 
              delay={index} 
              className="h-full bg-white"
              hoverEffect="lift"
            >
              <div className="flex flex-col h-full">
                <div className="h-48 bg-guardian-100 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-guardian-400">Caregiver Photo</span>
                </div>
                
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-medium">{caregiver.name}</h3>
                    <p className="text-sm text-muted-foreground">{caregiver.specialty}</p>
                  </div>
                  <div className="flex items-center px-2 py-1 bg-guardian-50 rounded-md text-sm">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="font-medium">{caregiver.rating}</span>
                    <span className="text-muted-foreground ml-1">({caregiver.reviews})</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {caregiver.badges.map((badge) => (
                    <span 
                      key={badge} 
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        badge === 'Verified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-guardian-100 text-guardian-700'
                      }`}
                    >
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
                
                <div className="mt-auto pt-4">
                  <Link to={`/caregivers/${caregiver.id}`}>
                    <Button variant="secondary" fullWidth>
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaregiversPreview;
