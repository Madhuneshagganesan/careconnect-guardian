
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import AnimatedCard from '../ui/AnimatedCard';

const TestimonialSlider = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Ravi Desai',
      role: 'Son of elderly parent',
      content: 'Guardian Go has been a blessing for our family. The caregivers are professional, punctual, and genuinely care about my father\'s wellbeing. The real-time tracking gives us peace of mind.',
      rating: 5,
      image: ''
    },
    {
      id: 2,
      name: 'Meera Kapoor',
      role: 'User with mobility issues',
      content: 'As someone with limited mobility, this app has been life-changing. The voice commands make it easy to schedule assistance, and the caregivers are well-trained and respectful.',
      rating: 5,
      image: ''
    },
    {
      id: 3,
      name: 'Sanjay Malhotra',
      role: 'Caretaker of disabled spouse',
      content: 'The subscription plan offers excellent value for the quality of service provided. The caregivers help me take care of my wife while I can focus on work knowing she\'s in good hands.',
      rating: 4,
      image: ''
    },
    {
      id: 4,
      name: 'Anjali Singh',
      role: 'User with chronic illness',
      content: 'I\'ve tried several caregiving services, but Guardian Go stands out for its exceptional caregivers and user-friendly platform. The emergency SOS feature gives me confidence.',
      rating: 5,
      image: ''
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-rotate testimonials
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  // Calculate visible testimonials based on current index
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground">
            Hear from individuals and families who have experienced the Guardian Go difference
          </p>
        </div>
        
        <div className="relative">
          {/* Desktop view */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <AnimatedCard
                key={`${testimonial.id}-${index}`}
                className="flex flex-col h-full"
                glassEffect={true}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-guardian-100 rounded-full flex items-center justify-center mr-4">
                    <span className="font-medium text-guardian-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">{renderStars(testimonial.rating)}</div>
                
                <p className="text-muted-foreground flex-grow italic">"{testimonial.content}"</p>
              </AnimatedCard>
            ))}
          </div>
          
          {/* Mobile view */}
          <div className="md:hidden">
            <AnimatedCard 
              className="flex flex-col"
              glassEffect={true}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-guardian-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-medium text-guardian-600">
                    {testimonials[currentIndex].name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">{renderStars(testimonials[currentIndex].rating)}</div>
              
              <p className="text-muted-foreground italic">"{testimonials[currentIndex].content}"</p>
            </AnimatedCard>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-guardian-200 text-guardian-600 hover:bg-guardian-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 10000);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-guardian-500 w-4' : 'bg-guardian-200'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-guardian-200 text-guardian-600 hover:bg-guardian-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
