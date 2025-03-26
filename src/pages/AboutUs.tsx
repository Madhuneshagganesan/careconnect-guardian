
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Users, Shield, Award, Heart, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Aisha Patel',
      role: 'Founder & CEO',
      bio: 'With over 15 years of experience in healthcare management, Aisha founded Guardian Go to transform caregiving services in India.',
      imageUrl: ''
    },
    {
      name: 'Raj Sharma',
      role: 'Head of Caregiver Operations',
      bio: 'Former hospital administrator with a passion for improving quality of care and caregiver working conditions.',
      imageUrl: ''
    },
    {
      name: 'Priya Mehta',
      role: 'Chief Technology Officer',
      bio: 'Tech veteran who left a corporate career to build platforms that make real differences in people's lives.',
      imageUrl: ''
    },
    {
      name: 'Vikram Singh',
      role: 'Head of Customer Experience',
      bio: 'Healthcare professional with expertise in creating personalized care plans for diverse patient needs.',
      imageUrl: ''
    }
  ];

  // Company values
  const values = [
    {
      icon: <Shield size={24} />,
      title: 'Trust & Safety',
      description: 'We meticulously verify all caregivers and maintain strict safety protocols to protect our clients and workers.'
    },
    {
      icon: <Award size={24} />,
      title: 'Excellence in Care',
      description: 'We're committed to maintaining the highest standards of care through continuous training and quality assurance.'
    },
    {
      icon: <Heart size={24} />,
      title: 'Compassion',
      description: 'We approach every interaction with genuine empathy and understanding for both clients and caregivers.'
    },
    {
      icon: <Users size={24} />,
      title: 'Inclusivity',
      description: 'We serve all communities with respect, celebrating diversity in our team, caregivers, and clients.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">Our Mission: Care That Empowers</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                At Guardian Go, we're revolutionizing caregiving in India with technology that connects families to verified, skilled caregivers while creating dignified employment opportunities.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Founded in 2022, Guardian Go emerged from a personal experience of our founder, Aisha Patel, who struggled to find reliable care for her aging mother in Bangalore.
                    </p>
                    <p>
                      After witnessing firsthand the challenges of finding trustworthy caregivers and the often difficult working conditions of care workers, Aisha assembled a team of healthcare and technology experts to create a platform that addresses both sides of the caregiving equation.
                    </p>
                    <p>
                      Today, Guardian Go operates in major cities across India, providing families with peace of mind and caregivers with fair compensation and professional development opportunities.
                    </p>
                  </div>
                </div>
                <div className="bg-guardian-100 h-96 rounded-xl flex items-center justify-center">
                  <span className="text-guardian-400">Company Image</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground">
                These core principles guide every decision we make and interaction we have
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl border border-border shadow-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-full bg-guardian-50 flex items-center justify-center mb-4 text-guardian-500">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground">
                The passionate professionals behind Guardian Go
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl border border-border shadow-sm text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-24 h-24 bg-guardian-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-guardian-400">Photo</span>
                  </div>
                  <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                  <p className="text-guardian-500 font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-muted-foreground mb-8">
                    Have questions or feedback? We'd love to hear from you. Our customer support team is available 24/7.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="text-guardian-500 mr-4 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">Headquarters</h3>
                        <p className="text-muted-foreground">
                          123 Care Avenue, Indiranagar<br />
                          Bangalore, Karnataka 560038
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="text-guardian-500 mr-4 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">Email</h3>
                        <p className="text-muted-foreground">support@guardiango.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="text-guardian-500 mr-4 mt-1" size={20} />
                      <div>
                        <h3 className="font-medium mb-1">Phone</h3>
                        <p className="text-muted-foreground">+91 80 1234 5678</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400 focus:border-transparent"
                        placeholder="Your email"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400 focus:border-transparent"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    
                    <Button type="submit" variant="primary">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
