
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Shield, Heart, Users, Award } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: <Shield className="w-10 h-10 text-guardian-500" />,
      title: 'Safety First',
      description: 'We prioritize the safety and security of both our clients and caregivers through rigorous verification processes.'
    },
    {
      icon: <Heart className="w-10 h-10 text-warm-500" />,
      title: 'Compassionate Care',
      description: 'Our approach is built on empathy, understanding, and genuine concern for the wellbeing of those we serve.'
    },
    {
      icon: <Users className="w-10 h-10 text-guardian-500" />,
      title: 'Community Focused',
      description: 'We believe in building stronger communities by connecting those in need with skilled, compassionate caregivers.'
    },
    {
      icon: <Award className="w-10 h-10 text-warm-500" />,
      title: 'Excellence in Service',
      description: 'We are committed to maintaining the highest standards of professionalism and service quality.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Guardian Go</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Connecting families with compassionate caregivers for reliable, personalized care services.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Guardian Go was founded in 2020 with a simple mission: to revolutionize how families access quality care services. Our founders experienced firsthand the challenges of finding reliable caregivers for their loved ones and decided there had to be a better way.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  What began as a small network of verified caregivers has now grown into a comprehensive platform connecting thousands of families with skilled care professionals across the country.
                </p>
                <p className="text-lg text-muted-foreground">
                  Throughout our journey, our core values of compassion, reliability, and innovation have remained unchanged. We continue to leverage technology to make high-quality care accessible to all.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1350&q=80" 
                  alt="Guardian Go team" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 md:py-24 bg-guardian-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                These core principles guide everything we do at Guardian Go
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 border border-border bg-white shadow-sm text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
              <p className="text-lg text-muted-foreground">
                Meet the passionate individuals behind Guardian Go
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Priya Sharma',
                  role: 'CEO & Founder',
                  bio: 'Former healthcare administrator with 15+ years of experience in elder care services.',
                  image: 'https://randomuser.me/api/portraits/women/23.jpg'
                },
                {
                  name: 'Rajesh Kumar',
                  role: 'CTO',
                  bio: 'Technology innovator with a passion for creating solutions that improve lives.',
                  image: 'https://randomuser.me/api/portraits/men/54.jpg'
                },
                {
                  name: 'Ananya Patel',
                  role: 'Head of Caregiver Relations',
                  bio: 'Experienced social worker dedicated to building our caregiver community.',
                  image: 'https://randomuser.me/api/portraits/women/65.jpg'
                }
              ].map((member, index) => (
                <Card key={index} className="overflow-hidden border-none shadow-md">
                  <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                    <p className="text-guardian-500 mb-3">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
