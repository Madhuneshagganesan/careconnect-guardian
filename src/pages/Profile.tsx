import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedCard from '@/components/ui/AnimatedCard';
import Button from '@/components/ui/Button';
import { 
  User, Edit, Bell, CreditCard, MapPin, Clock, 
  LogOut, Settings, Calendar as CalendarIcon, Phone, Mail,
  Heart, ChevronRight, ArrowRight, Star
} from 'lucide-react';
import LiveTracking from '@/components/tracking/LiveTracking';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PrivacySettingsDialog } from '@/components/settings/PrivacySettingsDialog';

const favoritesCaregivers = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Elder Care Specialist",
    rating: 4.9,
    reviews: 124
  },
  {
    id: 2,
    name: "Michael Thompson",
    specialty: "Physical Therapist",
    rating: 4.8,
    reviews: 97
  },
  {
    id: 3,
    name: "Emily Davies",
    specialty: "Home Care Nurse",
    rating: 4.7,
    reviews: 83
  }
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeSidebarItem, setActiveSidebarItem] = useState('appointments');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dob: user?.dob || '',
    age: user?.age || '',
    gender: user?.gender || '',
    emergencyContact: user?.emergencyContact || '',
    health: {
      condition: user?.health?.condition || '',
      treatment: user?.health?.treatment || '',
      height: user?.health?.height || '',
      weight: user?.health?.weight || '',
      bloodGroup: user?.health?.bloodGroup || ''
    }
  });
  
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dob: user.dob || '',
        age: user.age || 0,
        gender: user.gender || '',
        emergencyContact: user.emergencyContact || '',
        health: {
          condition: user.health?.condition || '',
          treatment: user.health?.treatment || '',
          height: user.health?.height || '',
          weight: user.health?.weight || '',
          bloodGroup: user.health?.bloodGroup || ''
        }
      });
    }
  }, [user]);
  
  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: 2 },
    { id: 'past', label: 'Past', count: 5 },
    { id: 'favorites', label: 'Favorites', count: 3 }
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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      name: `${profileData.firstName} ${profileData.lastName}`,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      dob: profileData.dob,
      age: Number(profileData.age),
      gender: profileData.gender,
      emergencyContact: profileData.emergencyContact,
      health: {
        condition: profileData.health.condition,
        treatment: profileData.health.treatment,
        height: profileData.health.height,
        weight: profileData.health.weight,
        bloodGroup: profileData.health.bloodGroup
      }
    };
    
    updateProfile(updatedData)
      .then(() => {
        setIsEditingProfile(false);
      })
      .catch(error => {
        console.error('Failed to update profile:', error);
      });
  };

  const handleLogout = () => {
    logout().then(() => {
      navigate('/login');
    });
  };

  const handleReschedule = (id: number) => {
    toast({
      title: "Reschedule Request Sent",
      description: `Your request to reschedule appointment #${id} has been sent.`,
    });
  };

  const handleCancel = (id: number) => {
    toast({
      description: "Are you sure you want to cancel this appointment?",
      action: (
        <div className="flex space-x-2">
          <Button 
            variant="warm" 
            size="sm" 
            onClick={() => {
              toast({
                title: "Appointment Cancelled",
                description: `Your appointment #${id} has been cancelled.`,
              });
            }}
          >
            Yes, Cancel
          </Button>
        </div>
      ),
    });
  };

  const handleAddReview = (id: number) => {
    toast({
      title: "Add Review",
      description: `You can add a review for appointment #${id}.`,
      action: (
        <Button variant="primary" size="sm">
          Review Now
        </Button>
      ),
    });
  };

  const renderSidebarContent = () => {
    switch (activeSidebarItem) {
      case 'personal-info':
        return (
          <AnimatedCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>
              
              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full border border-input rounded-md px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full border border-input rounded-md px-4 py-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full border border-input rounded-md px-4 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full border border-input rounded-md px-4 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input 
                      type="text" 
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      className="w-full border border-input rounded-md px-4 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input 
                        type="date" 
                        value={profileData.dob}
                        onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                        className="w-full border border-input rounded-md px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input 
                        type="number" 
                        value={profileData.age}
                        onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                        className="w-full border border-input rounded-md px-4 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select 
                      value={profileData.gender}
                      onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                      className="w-full border border-input rounded-md px-4 py-2"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input 
                      type="tel" 
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      className="w-full border border-input rounded-md px-4 py-2"
                    />
                  </div>

                  <h3 className="font-medium mt-4">Health Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health Condition</label>
                    <input 
                      type="text" 
                      value={profileData.health.condition}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        health: {...profileData.health, condition: e.target.value}
                      })}
                      placeholder="Any health conditions we should be aware of"
                      className="w-full border border-input rounded-md px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Treatment</label>
                    <input 
                      type="text" 
                      value={profileData.health.treatment}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        health: {...profileData.health, treatment: e.target.value}
                      })}
                      placeholder="Any ongoing treatments"
                      className="w-full border border-input rounded-md px-4 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                      <input 
                        type="text" 
                        value={profileData.health.height}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          health: {...profileData.health, height: e.target.value}
                        })}
                        placeholder="cm"
                        className="w-full border border-input rounded-md px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                      <input 
                        type="text" 
                        value={profileData.health.weight}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          health: {...profileData.health, weight: e.target.value}
                        })}
                        placeholder="kg"
                        className="w-full border border-input rounded-md px-4 py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <input 
                        type="text" 
                        value={profileData.health.bloodGroup}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          health: {...profileData.health, bloodGroup: e.target.value}
                        })}
                        placeholder="e.g. O+"
                        className="w-full border border-input rounded-md px-4 py-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Basic Information</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center">
                      <User className="text-muted-foreground mr-3" size={18} />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p>{profileData.firstName} {profileData.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="text-muted-foreground mr-3" size={18} />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="text-muted-foreground mr-3" size={18} />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="text-muted-foreground mr-3" size={18} />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{profileData.address || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <h4 className="font-medium mb-2">Additional Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                          <p>{profileData.dob || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p>{profileData.age || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p>{profileData.gender || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Emergency Contact</p>
                          <p>{profileData.emergencyContact || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <h4 className="font-medium mb-2">Health Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Health Condition</p>
                          <p>{profileData.health?.condition || 'None reported'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Current Treatment</p>
                          <p>{profileData.health?.treatment || 'None'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Height</p>
                          <p>{profileData.health?.height || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Weight</p>
                          <p>{profileData.health?.weight || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Blood Group</p>
                          <p>{profileData.health?.bloodGroup || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AnimatedCard>
        );
      
      case 'favorite-caregivers':
        return (
          <AnimatedCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Favorite Caregivers</h2>
              
              <div className="space-y-4">
                {favoritesCaregivers.map(caregiver => (
                  <div key={caregiver.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-guardian-100 rounded-full flex items-center justify-center">
                        <span className="text-guardian-400">Photo</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{caregiver.name}</h3>
                        <p className="text-sm text-muted-foreground">{caregiver.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-sm">{caregiver.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({caregiver.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => {
                          navigate('/book-service');
                        }}
                      >
                        Book Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Request Sent",
                            description: `Your request for ${caregiver.name}'s details has been sent.`,
                          });
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedCard>
        );
      
      case 'payment-methods':
        return (
          <AnimatedCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <CreditCard className="text-primary" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Cash on Delivery</h3>
                        <p className="text-sm text-muted-foreground">Pay after service completion</p>
                      </div>
                    </div>
                    <span className="text-xs bg-guardian-100 text-guardian-600 px-2 py-1 rounded-full">Default</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        );
      
      case 'settings':
        return (
          <AnimatedCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive updates about your bookings</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          name="toggle" 
                          id="toggle-email" 
                          defaultChecked
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          htmlFor="toggle-email" 
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                      <style>{`
                        .toggle-checkbox:checked {
                          right: 0;
                          border-color: #10B981;
                        }
                        .toggle-checkbox:checked + .toggle-label {
                          background-color: #10B981;
                        }
                      `}</style>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">SMS Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive text messages about your bookings</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          name="toggle" 
                          id="toggle-sms" 
                          defaultChecked
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          htmlFor="toggle-sms" 
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">Marketing Emails</p>
                        <p className="text-xs text-muted-foreground">Receive special offers and updates</p>
                      </div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          name="toggle" 
                          id="toggle-marketing" 
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label 
                          htmlFor="toggle-marketing" 
                          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Privacy</h3>
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-between"
                    onClick={() => {
                      toast({
                        title: "Privacy Settings",
                        description: "Privacy settings will be available soon.",
                      });
                    }}
                  >
                    <span>Privacy & Data Settings</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Account</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-between text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      onClick={() => {
                        toast({
                          title: "Deactivate Account",
                          description: "Are you sure you want to deactivate your account?",
                          action: (
                            <Button 
                              variant="warm" 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Account Deactivation",
                                  description: "Your account deactivation request has been received.",
                                });
                              }}
                            >
                              Confirm
                            </Button>
                          ),
                        });
                      }}
                    >
                      <span>Deactivate Account</span>
                      <ChevronRight size={16} />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full text-left justify-between text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        toast({
                          title: "Delete Account",
                          description: "This action cannot be undone. Are you sure?",
                          action: (
                            <Button 
                              variant="warm" 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Account Deletion",
                                  description: "Your account deletion request has been received.",
                                });
                                navigate('/');
                              }}
                            >
                              Delete
                            </Button>
                          ),
                        });
                      }}
                    >
                      <span>Delete Account</span>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        );
      
      default:
        return (
          <>
            <AnimatedCard>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <MapPin className="mr-2 text-primary" />
                  Live Caregiver Tracking
                </h2>
                <LiveTracking />
              </div>
            </AnimatedCard>
            
            <AnimatedCard className="mt-8">
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReschedule(1)}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                        >
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
                          <span>Michael Thompson</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancel(2)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                        >
                          <a href="#tracking">Track</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Medical Care Visit</h3>
                          <p className="text-sm text-muted-foreground">July 15, 2023, 2:00 PM - 3:30 PM</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>1.5 hours</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>Dr. Emily Davies</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddReview(3)}
                        >
                          Add Review
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Booking Again",
                              description: "Redirecting you to book this service again.",
                            });
                            navigate('/book-service');
                          }}
                        >
                          Book Again
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">Physical Therapy</h3>
                          <p className="text-sm text-muted-foreground">July 10, 2023, 11:00 AM - 12:00 PM</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>1 hour</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>Michael Thompson</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddReview(4)}
                        >
                          Add Review
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Booking Again",
                              description: "Redirecting you to book this service again.",
                            });
                            navigate('/book-service');
                          }}
                        >
                          Book Again
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedCard>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AnimatedCard>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex-shrink-0 h-16 w-16 bg-guardian-100 rounded-full flex items-center justify-center text-guardian-600 text-xl font-semibold">
                    {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <button 
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${activeSidebarItem === 'appointments' ? 'bg-guardian-100 text-guardian-900' : 'hover:bg-slate-100'}`}
                    onClick={() => setActiveSidebarItem('appointments')}
                  >
                    <CalendarIcon className="mr-3" size={18} />
                    <span>Appointments</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${activeSidebarItem === 'personal-info' ? 'bg-guardian-100 text-guardian-900' : 'hover:bg-slate-100'}`}
                    onClick={() => setActiveSidebarItem('personal-info')}
                  >
                    <User className="mr-3" size={18} />
                    <span>Personal Information</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${activeSidebarItem === 'favorite-caregivers' ? 'bg-guardian-100 text-guardian-900' : 'hover:bg-slate-100'}`}
                    onClick={() => setActiveSidebarItem('favorite-caregivers')}
                  >
                    <Heart className="mr-3" size={18} />
                    <span>Favorite Caregivers</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${activeSidebarItem === 'payment-methods' ? 'bg-guardian-100 text-guardian-900' : 'hover:bg-slate-100'}`}
                    onClick={() => setActiveSidebarItem('payment-methods')}
                  >
                    <CreditCard className="mr-3" size={18} />
                    <span>Payment Methods</span>
                  </button>
                  
                  <button 
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${activeSidebarItem === 'settings' ? 'bg-guardian-100 text-guardian-900' : 'hover:bg-slate-100'}`}
                    onClick={() => setActiveSidebarItem('settings')}
                  >
                    <Settings className="mr-3" size={18} />
                    <span>Settings</span>
                  </button>
                  
                  <button 
                    className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-8"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3" size={18} />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </AnimatedCard>
          </div>
          
          <div className="md:col-span-3">
            {renderSidebarContent()}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
