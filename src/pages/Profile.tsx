import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/ui/AnimatedCard';
import Button from '@/components/ui/Button';
import { User, Edit, Bell, CreditCard, MapPin, Clock, CheckCircle, ArrowRight, Heart, LogOut, Settings, Calendar, Star } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="col-span-1">
              <AnimatedCard className="bg-white mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-guardian-100 flex items-center justify-center mb-4">
                    <User size={32} className="text-guardian-400" />
                  </div>
                  <h2 className="text-xl font-bold mb-1">Raj Mehta</h2>
                  <p className="text-muted-foreground text-sm mb-4">raj.mehta@example.com</p>
                  <Button variant="outline" size="sm" className="mb-4">
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                  <div className="w-full border-t border-border pt-4 mt-2">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-guardian-600">7</p>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-guardian-600">3</p>
                        <p className="text-sm text-muted-foreground">Favorite Caregivers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
              
              <AnimatedCard className="bg-white">
                <h3 className="font-medium mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/book-service" className="flex items-center p-3 rounded-lg hover:bg-guardian-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                      <Calendar size={16} className="text-guardian-600" />
                    </div>
                    <span>Book a Service</span>
                    <ArrowRight size={16} className="ml-auto text-guardian-500" />
                  </a>
                  <a href="/caregivers" className="flex items-center p-3 rounded-lg hover:bg-guardian-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                      <User size={16} className="text-guardian-600" />
                    </div>
                    <span>Find Caregivers</span>
                    <ArrowRight size={16} className="ml-auto text-guardian-500" />
                  </a>
                  <a href="/wallet" className="flex items-center p-3 rounded-lg hover:bg-guardian-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                      <CreditCard size={16} className="text-guardian-600" />
                    </div>
                    <span>My Wallet</span>
                    <ArrowRight size={16} className="ml-auto text-guardian-500" />
                  </a>
                  <a href="/settings" className="flex items-center p-3 rounded-lg hover:bg-guardian-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                      <Settings size={16} className="text-guardian-600" />
                    </div>
                    <span>Settings</span>
                    <ArrowRight size={16} className="ml-auto text-guardian-500" />
                  </a>
                  <a href="/help" className="flex items-center p-3 rounded-lg hover:bg-guardian-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                      <Bell size={16} className="text-guardian-600" />
                    </div>
                    <span>Help & Support</span>
                    <ArrowRight size={16} className="ml-auto text-guardian-500" />
                  </a>
                  <a href="/logout" className="flex items-center p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <LogOut size={16} className="text-red-600" />
                    </div>
                    <span>Sign Out</span>
                  </a>
                </div>
              </AnimatedCard>
            </div>
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-2">
              <AnimatedCard className="bg-white mb-6">
                <h2 className="text-xl font-bold mb-4">My Bookings</h2>
                
                <div className="border-b border-border mb-6">
                  <div className="flex overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`inline-flex items-center px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'border-guardian-500 text-guardian-700'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          activeTab === tab.id
                            ? 'bg-guardian-100 text-guardian-700'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {activeTab === 'upcoming' && (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border border-border rounded-lg p-4 hover:border-guardian-200 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div className="flex items-center mb-2 sm:mb-0">
                            <div className="w-10 h-10 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                              <span className="font-medium text-guardian-600">
                                {booking.caregiver.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{booking.service}</h3>
                              <p className="text-sm text-muted-foreground">with {booking.caregiver}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Calendar size={16} className="text-muted-foreground mr-2" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock size={16} className="text-muted-foreground mr-2" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Track Caregiver
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:border-red-200">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'past' && (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div key={booking.id} className="border border-border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div className="flex items-center mb-2 sm:mb-0">
                            <div className="w-10 h-10 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                              <span className="font-medium text-guardian-600">
                                {booking.caregiver.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{booking.service}</h3>
                              <p className="text-sm text-muted-foreground">with {booking.caregiver}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center text-sm">
                            <Calendar size={16} className="text-muted-foreground mr-2" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock size={16} className="text-muted-foreground mr-2" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Star size={16} className="mr-1" />
                            Rate & Review
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar size={16} className="mr-1" />
                            Book Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'favorites' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoritesCaregivers.map((caregiver) => (
                      <div key={caregiver.id} className="border border-border rounded-lg p-4 hover:border-guardian-200 transition-all">
                        <div className="flex items-center mb-3">
                          <div className="w-12 h-12 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                            <span className="font-medium text-guardian-600">
                              {caregiver.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">{caregiver.name}</h3>
                            <p className="text-sm text-muted-foreground">{caregiver.specialty}</p>
                          </div>
                          <button className="ml-auto text-warm-500 hover:text-warm-600 transition-colors">
                            <Heart size={20} fill="currentColor" />
                          </button>
                        </div>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium text-sm">{caregiver.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">({caregiver.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" fullWidth>
                            View Profile
                          </Button>
                          <Button variant="primary" size="sm" fullWidth>
                            Book
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {((activeTab === 'upcoming' && upcomingBookings.length === 0) || 
                  (activeTab === 'past' && pastBookings.length === 0) || 
                  (activeTab === 'favorites' && favoritesCaregivers.length === 0)) && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-guardian-50 flex items-center justify-center mx-auto mb-4">
                      {activeTab === 'favorites' ? (
                        <Heart size={24} className="text-guardian-300" />
                      ) : (
                        <Calendar size={24} className="text-guardian-300" />
                      )}
                    </div>
                    <h3 className="text-lg font-medium mb-2">No {activeTab} items</h3>
                    <p className="text-muted-foreground mb-4">
                      {activeTab === 'upcoming' 
                        ? 'You have no upcoming bookings at the moment.' 
                        : activeTab === 'past'
                          ? 'You have no past bookings yet.'
                          : 'You have no favorite caregivers yet.'}
                    </p>
                    {activeTab === 'upcoming' && (
                      <Button variant="primary">
                        Book a Service
                      </Button>
                    )}
                    {activeTab === 'favorites' && (
                      <Button variant="primary">
                        Find Caregivers
                      </Button>
                    )}
                  </div>
                )}
              </AnimatedCard>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatedCard className="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Saved Addresses</h3>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start p-3 rounded-lg bg-guardian-50 border border-guardian-100">
                      <div className="w-8 h-8 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                        <CheckCircle size={16} className="text-guardian-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Home</p>
                        <p className="text-sm text-muted-foreground">123 Main Street, Apt 4B, Indiranagar, Bangalore, 560038</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-3 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                        <MapPin size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Parents' Home</p>
                        <p className="text-sm text-muted-foreground">456 Park Avenue, HSR Layout, Bangalore, 560102</p>
                      </div>
                    </div>
                    
                    <button className="w-full flex items-center justify-center text-sm text-guardian-600 font-medium mt-2">
                      + Add New Address
                    </button>
                  </div>
                </AnimatedCard>
                
                <AnimatedCard className="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Payment Methods</h3>
                    <Button variant="ghost" size="sm">
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-lg bg-guardian-50 border border-guardian-100">
                      <div className="w-8 h-8 rounded-full bg-guardian-100 flex items-center justify-center mr-3">
                        <CheckCircle size={16} className="text-guardian-600" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">HDFC Credit Card</p>
                        <p className="text-sm text-muted-foreground">•••• •••• •••• 4567</p>
                      </div>
                      <div className="w-8 h-5 bg-muted rounded">
                        <span className="text-xs">VISA</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                        <CreditCard size={16} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Guardian Go Wallet</p>
                        <p className="text-sm text-muted-foreground">Balance: ₹2,500</p>
                      </div>
                    </div>
                    
                    <button className="w-full flex items-center justify-center text-sm text-guardian-600 font-medium mt-2">
                      + Add Payment Method
                    </button>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
