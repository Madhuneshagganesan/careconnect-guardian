
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Heart, Shield, Star, Award, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const values = [
    {
      title: "Compassion",
      description: "We approach every interaction with empathy and genuine care for the well-being of others.",
      icon: <Heart className="text-warm-500" size={24} />,
    },
    {
      title: "Safety",
      description: "We prioritize the security and protection of both our clients and caregivers above all else.",
      icon: <Shield className="text-guardian-500" size={24} />,
    },
    {
      title: "Excellence",
      description: "We strive for the highest standards in every aspect of our service and continuous improvement.",
      icon: <Star className="text-warm-500" size={24} />,
    },
    {
      title: "Integrity",
      description: "We conduct ourselves with honesty, transparency, and ethical practices in all relationships.",
      icon: <Award className="text-guardian-500" size={24} />,
    },
    {
      title: "Community",
      description: "We foster meaningful connections and support networks for families and caregivers alike.",
      icon: <Users className="text-warm-500" size={24} />,
    },
  ];

  const founders = [
    {
      name: "Madhunesha Ganesan",
      role: "Co-Founder & CEO",
      bio: "15+ years experience in healthcare administration and technology"
    },
    {
      name: "Mounamithra",
      role: "Co-Founder & CTO",
      bio: "Expert in healthcare technology with a focus on accessibility"
    },
    {
      name: "Kanimozhi",
      role: "Co-Founder & COO",
      bio: "Specialized in operations and caregiving service management"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-xl text-muted-foreground">
              Guardian Go was founded with a simple mission: to make quality caregiving accessible to all.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-20">
            <div className="bg-guardian-50 rounded-2xl p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg mb-4">
                  At Guardian Go, we believe that everyone deserves access to compassionate, reliable care. Our platform bridges the gap between those seeking care and qualified caregivers, creating meaningful connections that enhance lives.
                </p>
                <p className="text-lg mb-4">
                  We're committed to transforming the caregiving industry through technology that emphasizes safety, quality, and human connection. Our goal is to empower both care recipients and caregivers through a platform that values transparency, fairness, and respect.
                </p>
                <p className="text-lg">
                  By providing tools that simplify finding, booking, and managing care services, we aim to reduce stress and increase peace of mind for families while creating sustainable opportunities for caregiving professionals.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground">
                These principles guide everything we do at Guardian Go
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-border shadow-sm text-center">
                  <div className="w-12 h-12 rounded-full bg-guardian-50 flex items-center justify-center mb-4 mx-auto">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section (with updated founders) */}
          <section className="mb-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
              <p className="text-lg text-muted-foreground">
                Meet the dedicated individuals working to make Guardian Go the best caregiving platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {founders.map((founder, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-border shadow-sm text-center">
                  <div className="w-24 h-24 rounded-full bg-guardian-100 mx-auto mb-4"></div>
                  <h3 className="text-xl font-medium">{founder.name}</h3>
                  <p className="text-guardian-500 mb-2">{founder.role}</p>
                  <p className="text-muted-foreground text-sm">
                    {founder.bio}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-warm-50 rounded-2xl px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl mb-8">
                Whether you're looking for care or providing it, be part of our growing community.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/book-service">
                  <Button variant="primary" size="lg">
                    Find a Caregiver
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
