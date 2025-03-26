
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Star, MapPin, CheckCircle, Award, Calendar, Shield, Stethoscope, Heart, Home, Clock, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const CaregiverDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [caregiver, setCaregiver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchCaregiver = () => {
      setLoading(true);
      
      // Mock data - in a real app, this would come from an API
      const caregiverData = {
        id: parseInt(id || '1'),
        name: id === '1' ? 'Priya Sharma' : id === '2' ? 'Rajesh Kumar' : 'Ananya Patel',
        specialty: id === '1' ? 'Elder Care Specialist' : id === '2' ? 'Physiotherapy Assistant' : 'Personal Care Aide',
        rating: id === '1' ? 4.9 : id === '2' ? 4.8 : 4.9,
        reviews: id === '1' ? 156 : id === '2' ? 124 : 212,
        experience: id === '1' ? '7 years' : id === '2' ? '5 years' : '6 years',
        hourlyRate: id === '1' ? '₹350' : id === '2' ? '₹380' : '₹320',
        location: id === '1' ? 'Indiranagar, Bangalore' : id === '2' ? 'Koramangala, Bangalore' : 'HSR Layout, Bangalore',
        distance: id === '1' ? '2.3 km away' : id === '2' ? '3.5 km away' : '4.1 km away',
        services: id === '1' 
          ? ['Meal Preparation', 'Personal Care', 'Medical Assistance'] 
          : id === '2' 
            ? ['Medical Assistance', 'Mobility Support', 'Exercise Assistance']
            : ['Personal Care', 'Household Help', 'Companionship'],
        availability: id === '1' ? 'Available Now' : id === '2' ? 'Available in 2 hours' : 'Available from tomorrow',
        languages: ['English', 'Hindi', id === '1' ? 'Kannada' : id === '2' ? 'Tamil' : 'Bengali'],
        education: id === '1' ? 'B.Sc. Nursing' : id === '2' ? 'Physiotherapy Diploma' : 'Home Health Aide Certification',
        certifications: id === '1' 
          ? ['First Aid', 'CPR', 'Elder Care Specialist'] 
          : id === '2' 
            ? ['Medical Training', 'Physical Rehabilitation', 'Patient Handling'] 
            : ['CPR Certified', 'Dementia Care', 'Palliative Care'],
        bio: `With ${id === '1' ? '7' : id === '2' ? '5' : '6'} years of experience in providing compassionate care, I specialize in ${id === '1' ? 'elder care' : id === '2' ? 'physical therapy support' : 'personal care assistance'}. I believe in treating each client with dignity and respect, while ensuring their safety and comfort. My approach is to build a trusted relationship with both clients and their families.`,
        schedule: [
          { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
          { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
          { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
          { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
          { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
          { day: 'Saturday', hours: 'By appointment' },
          { day: 'Sunday', hours: 'Unavailable' },
        ],
        testimonials: [
          {
            name: 'Ravi Mehta',
            rating: 5,
            date: '2 months ago',
            comment: `${id === '1' ? 'Priya' : id === '2' ? 'Rajesh' : 'Ananya'} is absolutely wonderful. Professional, caring, and attentive to every detail. My father looks forward to her visits and his health has improved significantly under her care.`
          },
          {
            name: 'Meena Desai',
            rating: id === '2' ? 4 : 5,
            date: '4 months ago',
            comment: `We're extremely satisfied with ${id === '1' ? 'Priya' : id === '2' ? 'Rajesh' : 'Ananya'}'s services. ${id === '1' ? 'She' : id === '2' ? 'He' : 'She'} is always punctual and goes above and beyond to ensure my mother's comfort.`
          }
        ],
        badges: id === '1' 
          ? ['Verified', 'First Aid Certified', 'Top Rated'] 
          : id === '2' 
            ? ['Verified', 'Medical Training']
            : ['Verified', 'CPR Certified', 'Top Rated']
      };
      
      setTimeout(() => {
        setCaregiver(caregiverData);
        setLoading(false);
      }, 800);
    };
    
    fetchCaregiver();
  }, [id]);
  
  const handleContactCaregiver = () => {
    toast({
      title: "Message sent!",
      description: `Your message to ${caregiver?.name} has been sent. They will respond shortly.`,
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 px-4">
          <div className="container mx-auto flex items-center justify-center h-full">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-40 mb-8"></div>
              <div className="h-48 bg-gray-200 rounded w-full max-w-xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!caregiver) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 px-4">
          <div className="container mx-auto text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Caregiver Not Found</h1>
            <p className="mb-8">The caregiver you're looking for may not exist or has been removed.</p>
            <Button variant="primary" to="/caregivers">
              <ArrowLeft size={16} className="mr-2" />
              Back to Caregivers
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Back Button */}
        <div className="container mx-auto px-4 sm:px-6 mb-6">
          <Link to="/caregivers" className="inline-flex items-center text-muted-foreground hover:text-guardian-500 transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            Back to caregivers
          </Link>
        </div>
        
        {/* Caregiver Header */}
        <section className="container mx-auto px-4 sm:px-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-border p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="w-32 h-32 bg-guardian-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <span className="text-guardian-400">Photo</span>
              </div>
              
              {/* Info */}
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{caregiver.name}</h1>
                  <div className="flex items-center justify-center md:justify-start">
                    {caregiver.badges.map((badge: string) => (
                      <span 
                        key={badge} 
                        className={`ml-2 px-2 py-0.5 text-xs rounded-full flex items-center ${
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
                </div>
                
                <p className="text-muted-foreground mb-3">{caregiver.specialty}</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="font-medium">{caregiver.rating}</span>
                    <span className="text-muted-foreground ml-1">({caregiver.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MapPin size={16} className="mr-1" />
                    <span>{caregiver.location}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Clock size={16} className="mr-1" />
                    <span className={caregiver.availability.includes('Now') ? 'text-green-600 font-medium' : ''}>
                      {caregiver.availability}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {caregiver.services.map((service: string) => (
                    <span key={service} className="px-2 py-1 text-xs bg-guardian-50 text-guardian-700 rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-3 min-w-40">
                <div className="text-center mb-2">
                  <p className="text-muted-foreground text-sm">Hourly Rate</p>
                  <p className="text-2xl font-bold text-guardian-600">{caregiver.hourlyRate}/hr</p>
                </div>
                
                <Button 
                  variant="primary" 
                  to={`/book-service?caregiver=${caregiver.id}`}
                  fullWidth
                >
                  Book Now
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleContactCaregiver}
                  fullWidth
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tabs */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold mb-4">About {caregiver.name}</h2>
              
              <p className="mb-6">{caregiver.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-3">Details</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Clock size={16} className="text-guardian-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Experience</p>
                        <p className="text-muted-foreground">{caregiver.experience}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Shield size={16} className="text-guardian-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Education</p>
                        <p className="text-muted-foreground">{caregiver.education}</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <MapPin size={16} className="text-guardian-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-muted-foreground">{caregiver.location}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Specializations</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {caregiver.services.map((service: string) => (
                      <div key={service} className="flex items-start">
                        {service.includes('Medical') && 
                          <Stethoscope size={16} className="text-guardian-500 mt-1 mr-2 flex-shrink-0" />}
                        {service.includes('Personal') && 
                          <Heart size={16} className="text-guardian-500 mt-1 mr-2 flex-shrink-0" />}
                        {service.includes('Household') && 
                          <Home size={16} className="text-guardian-500 mt-1 mr-2 flex-shrink-0" />}
                        {(service.includes('Meal') || service.includes('Mobility') || service.includes('Exercise') || service.includes('Companionship')) && 
                          <CheckCircle size={16} className="text-guardian-500 mt-1 mr-2 flex-shrink-0" />}
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-medium mt-6 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {caregiver.languages.map((language: string) => (
                      <span key={language} className="px-2 py-1 text-xs bg-guardian-50 text-guardian-700 rounded-full">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {caregiver.certifications.map((cert: string) => (
                    <span key={cert} className="px-3 py-1.5 bg-guardian-50 text-guardian-700 rounded-lg inline-flex items-center">
                      <Shield size={14} className="mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="bg-white rounded-xl shadow-sm border border-border p-6">
              <h2 className="text-xl font-bold mb-6">Weekly Schedule</h2>
              
              <div className="overflow-hidden rounded-lg border border-border">
                {caregiver.schedule.map((item: { day: string, hours: string }, index: number) => (
                  <div 
                    key={item.day} 
                    className={`flex justify-between p-4 ${
                      index < caregiver.schedule.length - 1 ? 'border-b border-border' : ''
                    } ${item.day === 'Sunday' ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div className="flex items-center">
                      <Calendar size={16} className="text-guardian-500 mr-3" />
                      <span className="font-medium">{item.day}</span>
                    </div>
                    <span className={item.hours.includes('Unavailable') ? 'text-gray-400' : ''}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-4">Book an Appointment</h3>
                <Button 
                  variant="primary" 
                  to={`/book-service?caregiver=${caregiver.id}`}
                >
                  Check Availability
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="bg-white rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Reviews</h2>
                <div className="flex items-center">
                  <Star size={18} className="text-yellow-500 mr-1" />
                  <span className="font-medium text-lg">{caregiver.rating}</span>
                  <span className="text-muted-foreground ml-1">({caregiver.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {caregiver.testimonials.map((review: any, index: number) => (
                  <div key={index} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">{review.name}</p>
                      <p className="text-muted-foreground text-sm">{review.date}</p>
                    </div>
                    <div className="flex items-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? "text-yellow-500" : "text-gray-200"} 
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="mt-6">
                See All Reviews
              </Button>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaregiverDetail;
