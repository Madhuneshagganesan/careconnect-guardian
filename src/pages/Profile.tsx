import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/ui/AnimatedCard';
import Button from '@/components/ui/Button';
import { User, Edit, Bell, CreditCard, MapPin, Clock, CheckCircle, ArrowRight, Heart, LogOut, Settings, Calendar, Star } from 'lucide-react';
import LiveTracking from '@/components/tracking/LiveTracking';
import VoiceAssistant from '@/components/voice/VoiceAssistant';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: 2 },
    { id: 'past', label: 'Past', count: 5 },
    { id: 'favorites', label: 'Favorites', count: 3 }
  ];
  
  const upcomingBookings = [
    {
      id: 1,
      service: 'Meal Preparation',
      caregiver: 'Priya Sharma',
      date: 'Today',
      time: '3:00 PM - 5:00 PM',
      status: 'Confirmed',
      imageUrl: ''
    },
    {
      id: 2,
      service: 'Medical Assistance',
      caregiver: 'Rajesh Kumar',
      date: 'Tomorrow',
      time: '10:00 AM - 12:00 PM',
      status: 'Pending',
      imageUrl: ''
    }
  ];
  
  const pastBookings = [
    {
      id: 3,
      service: 'Personal Care',
      caregiver: 'Ananya Patel',
      date: 'Nov 10, 2023',
      time: '9:00 AM - 11:00 AM',
      status: 'Completed',
      imageUrl: ''
    },
    {
      id: 4,
      service: 'Errands & Shopping',
      caregiver: 'Vikram Singh',
      date: 'Nov 5, 2023',
      time: '2:00 PM - 4:00 PM',
      status: 'Completed',
      imageUrl: ''
    },
    {
      id: 5,
      service: 'Household Help',
      caregiver: 'Deepa Nair',
      date: 'Oct 28, 2023',
      time: '11:00 AM - 3:00 PM',
      status: 'Completed',
      imageUrl: ''
    }
  ];
  
  const favoritesCaregivers = [
    {
      id: 1,
      name: 'Priya Sharma',
      specialty: 'Elder Care Specialist',
      rating: 4.9,
      reviews: 156,
      imageUrl: ''
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      specialty: 'Physiotherapy Assistant',
      rating: 4.8,
      reviews: 124,
      imageUrl: ''
    },
    {
      id: 3,
      name: 'Ananya Patel',
      specialty: 'Personal Care Aide',
      rating: 4.9,
      reviews: 212,
      imageUrl: ''
    }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Completed':
        return 'bg-guardian-100 text-guardian-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <User size={40} />
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">John Smith</h1>
                <p className="text-muted-foreground">Member since January 2023</p>
              </div>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2 self-start">
                <Edit size={16} />
                Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={18} />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bell size={18} />
                <span>Notifications On</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard size={18} />
                <span>Payment Methods: 2</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AnimatedCard className="p-4 sticky top-24">
              <nav className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/10 rounded-lg font-medium">
                  <Calendar size={20} />
                  <span>Appointments</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                  <User size={20} />
                  <span>Personal Info</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                  <Heart size={20} />
                  <span>Favorite Caregivers</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                  <CreditCard size={20} />
                  <span>Payment Methods</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                  <Settings size={20} />
                  <span>Settings</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors">
                  <LogOut size={20} />
                  <span>Logout</span>
                </a>
              </nav>
            </AnimatedCard>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <AnimatedCard>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <MapPin className="mr-2 text-primary" />
                  Live Caregiver Tracking
                </h2>
                <LiveTracking />
              </div>
            </AnimatedCard>
            
            <AnimatedCard>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Appointments</h2>
                
                <div className="flex border-b mb-6">
                  <button 
                    className={`pb-2 px-4 font-medium ${activeTab === 'upcoming' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Upcoming
                  </button>
                  <button 
                    className={`pb-2 px-4 font-medium ${activeTab === 'past' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setActiveTab('past')}
                  >
                    Past
                  </button>
                </div>
                
                {activeTab === 'upcoming' ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Home Care Service</h3>
                          <p className="text-sm text-muted-foreground">Today, 3:00 PM - 5:00 PM</p>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Confirmed</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>2 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>Sarah Johnson</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="default" size="sm">
                          <a href="#tracking">Track</a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Elder Care Service</h3>
                          <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM - 12:00 PM</p>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Confirmed</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>2 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>Michael Brown</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="outline" size="sm">Cancel</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-muted/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Home Care Service</h3>
                          <p className="text-sm text-muted-foreground">June 15, 2023, 2:00 PM - 4:00 PM</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>2 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>Sarah Johnson</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-amber-400" size={16} />
                        </div>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-muted/30">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Elder Care Service</h3>
                          <p className="text-sm text-muted-foreground">June 10, 2023, 10:00 AM - 12:00 PM</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>2 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>Michael Brown</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-amber-400" size={16} />
                          <Star className="text-gray-300" size={16} />
                        </div>
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <Button asChild className="gap-2">
                    <a href="/book-service">
                      Book New Service
                      <ArrowRight size={16} />
                    </a>
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </main>
      
      <VoiceAssistant />
      
      <Footer />
    </>
  );
};

export default Profile;
