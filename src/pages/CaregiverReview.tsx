
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/shadcn-button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

const CaregiverReview = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caregiverData, setCaregiverData] = useState({
    id: id || '1',
    name: 'Loading...',
    service: 'Loading...',
    date: new Date().toLocaleDateString()
  });

  // Get caregiver data from localStorage or bookings
  useEffect(() => {
    // First, check if we have a booking with this caregiver
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const caregiverBooking = bookings.find(booking => booking.caregiverId?.toString() === id);
    
    if (caregiverBooking) {
      // Use data from the booking
      setCaregiverData({
        id: id || '1',
        name: caregiverBooking.caregiver || 'Unknown Caregiver',
        service: caregiverBooking.service || 'Home Care',
        date: caregiverBooking.date ? `${caregiverBooking.date}, ${caregiverBooking.time || ''}` : new Date().toLocaleDateString()
      });
    } else {
      // Fallback to localStorage for active caregiver info
      const activeName = localStorage.getItem('activeCaregiverName');
      if (activeName) {
        setCaregiverData(prev => ({
          ...prev,
          name: activeName
        }));
      }
    }
  }, [id]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, we would submit this to a backend
      // await submitReview({ caregiverId: id, rating, feedback });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Store the review in localStorage for persistence
      const reviews = JSON.parse(localStorage.getItem('caregiver_reviews') || '[]');
      reviews.push({
        id: Date.now().toString(),
        caregiverId: id,
        rating,
        feedback,
        date: new Date().toISOString()
      });
      localStorage.setItem('caregiver_reviews', JSON.stringify(reviews));
      
      toast({
        title: "Review Submitted",
        description: `Thank you for reviewing ${caregiverData.name}!`,
      });
      
      // Navigate back to home or profile
      navigate('/profile');
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast({
        title: "Submission Failed",
        description: "We couldn't submit your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Rate Your Experience</h1>
        
        <Card className="p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">{caregiverData.name}</h2>
            <p className="text-gray-600">{caregiverData.service}</p>
            <p className="text-sm text-gray-500 mb-4">{caregiverData.date}</p>
          </div>
          
          <div className="mb-8">
            <label className="block text-lg font-medium mb-3">How would you rate your caregiver?</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl focus:outline-none"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    size={32}
                    className={`${
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {rating ? (
                rating === 5 ? "Excellent!" :
                rating === 4 ? "Good service" :
                rating === 3 ? "Average" :
                rating === 2 ? "Below average" :
                "Poor experience"
              ) : "Select a rating"}
            </p>
          </div>
          
          <div className="mb-8">
            <label htmlFor="feedback" className="flex items-center gap-2 text-lg font-medium mb-3">
              <MessageSquare size={20} />
              <span>Share your feedback (optional)</span>
            </label>
            <Textarea
              id="feedback"
              placeholder="Tell us about your experience with this caregiver..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-guardian-200 hover:bg-guardian-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitReview}
              disabled={isSubmitting || rating === 0}
              className="bg-guardian-500 hover:bg-guardian-600"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">●</span>
                  Submitting...
                </>
              ) : "Submit Review"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CaregiverReview;
