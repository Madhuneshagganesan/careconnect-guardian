
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import Button from '@/components/ui/Button';
import { Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface RequestCustomMatchProps {
  trigger: React.ReactNode;
}

const RequestCustomMatch: React.FC<RequestCustomMatchProps> = ({ trigger }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const timeOptions = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "We've received your custom match request. Our team will contact you shortly.",
      });
    }, 1500);
  };
  
  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setRequirements('');
    setDate(undefined);
    setTime('');
    setSubmitted(false);
  };
  
  return (
    <Dialog onOpenChange={(open) => {
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request a Custom Caregiver Match</DialogTitle>
          <DialogDescription>
            Tell us your specific requirements and we'll match you with the perfect caregiver for your needs.
          </DialogDescription>
        </DialogHeader>
        
        {submitted ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-medium mb-2">Thank You!</h3>
            <p className="text-muted-foreground mb-6">
              Your request has been submitted successfully. Our team will contact you within 24 hours to discuss your requirements.
            </p>
            <DialogClose asChild>
              <Button variant="primary">Close</Button>
            </DialogClose>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400"
                    placeholder="Your phone number"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400"
                    placeholder="Your email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Preferred Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400 bg-white"
                        >
                          {date ? format(date, 'PPP') : <span className="text-muted-foreground">Select date</span>}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Preferred Time</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400 bg-white"
                        >
                          {time || <span className="text-muted-foreground">Select time</span>}
                          <Clock className="ml-2 h-4 w-4 opacity-50" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0" align="start">
                        <div className="max-h-60 overflow-y-auto p-1">
                          {timeOptions.map((timeOption) => (
                            <button
                              key={timeOption}
                              type="button"
                              className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-guardian-50 ${time === timeOption ? 'bg-guardian-100 text-guardian-700' : ''}`}
                              onClick={() => setTime(timeOption)}
                            >
                              {timeOption}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium mb-1">Specific Requirements</label>
                  <textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400"
                    placeholder="Please describe your care needs and any specific requirements for a caregiver"
                    rows={4}
                    required
                  ></textarea>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" variant="primary" isLoading={submitting}>
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestCustomMatch;
