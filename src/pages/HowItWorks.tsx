
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorksSection from '@/components/home/HowItWorks';
import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const features = [
    {
      title: "Personalized Care Matching",
      description: "Our algorithm pairs you with caregivers who match your specific needs and preferences.",
      icon: "⚙️",
    },
    {
      title: "Real-time Communication",
      description: "Stay connected with caregivers through our secure messaging system.",
      icon: "💬",
    },
    {
      title: "Background Verified",
      description: "All caregivers undergo thorough background checks for your safety and peace of mind.",
      icon: "🔒",
    },
    {
      title: "Flexible Scheduling",
      description: "Book services for one-time needs or set up recurring appointments easily.",
      icon: "📅",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How Guardian Go Works</h1>
            <p className="text-xl text-muted-foreground">
              Providing care should be simple and transparent. Here's how we make it happen.
            </p>
          </div>

          {/* Section with the HowItWorks component */}
          <HowItWorksSection />

          {/* Additional Features Section */}
          <section className="py-16">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Features That Make Us Different</h2>
              <p className="text-lg text-muted-foreground">
                We've designed our platform with both caregivers and care recipients in mind
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-border shadow-sm">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-guardian-50 rounded-2xl px-6 my-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Experience Effortless Care?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of families who trust Guardian Go for reliable and compassionate caregiving services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/book-service">
                  <Button variant="primary" size="lg">
                    Book a Caregiver Now
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/caregivers">
                  <Button variant="outline" size="lg">
                    Browse Caregivers
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

export default HowItWorks;
