
import React from 'react';
import Button from '@/components/ui/Button';
import RequestCustomMatch from '@/components/forms/RequestCustomMatch';

const CTASection: React.FC = () => {
  return (
    <section className="py-12 bg-guardian-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Let us know your specific requirements, and we'll help match you with the perfect caregiver.
          </p>
          <RequestCustomMatch 
            trigger={
              <Button variant="primary" size="lg">
                Request a Custom Match
              </Button>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
