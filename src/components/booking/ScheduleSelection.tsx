
import React from 'react';
import { format, addDays } from 'date-fns';

interface ScheduleSelectionProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
}

interface Duration {
  id: string;
  label: string;
  hours: number;
  price: number;
}

const ScheduleSelection: React.FC<ScheduleSelectionProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedDuration,
  setSelectedDuration
}) => {
  // Generate dates for the next 7 days
  const generateDates = () => {
    const today = new Date();
    const dates = [];
    
    for(let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      let label = '';
      
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Tomorrow';
      else label = format(date, 'EEE, dd MMM');
      
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: label,
        date: date
      });
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const time = `${displayHour}:00 ${isPM ? 'PM' : 'AM'}`;
      slots.push(time);
    }
    return slots;
  };
  
  const times = generateTimeSlots();
  
  const durations: Duration[] = [
    { id: '1hour', label: '1 hour', hours: 1, price: 0 },
    { id: '2hours', label: '2 hours', hours: 2, price: 600 },
    { id: '4hours', label: '4 hours (Half day)', hours: 4, price: 1200 },
    { id: '8hours', label: '8 hours (Full day)', hours: 8, price: 2400 }
  ];
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Schedule Your Service</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Select a Date</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                selectedDate === date.label
                  ? 'border-guardian-500 bg-guardian-50 text-guardian-700'
                  : 'border-border hover:border-guardian-200'
              }`}
              onClick={() => setSelectedDate(date.label)}
            >
              <p className={`text-sm ${selectedDate === date.label ? 'font-medium' : ''}`}>{date.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Select a Time</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {times.map((time) => (
            <div
              key={time}
              className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                selectedTime === time
                  ? 'border-guardian-500 bg-guardian-50 text-guardian-700'
                  : 'border-border hover:border-guardian-200'
              }`}
              onClick={() => setSelectedTime(time)}
            >
              <p className={`text-sm ${selectedTime === time ? 'font-medium' : ''}`}>{time}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Duration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {durations.map((duration) => (
            <div
              key={duration.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                selectedDuration === duration.id
                  ? 'border-guardian-500 bg-guardian-50 text-guardian-700'
                  : 'border-border hover:border-guardian-200'
              }`}
              onClick={() => setSelectedDuration(duration.id)}
            >
              <div className="flex justify-between">
                <p className={`text-sm ${selectedDuration === duration.id ? 'font-medium' : ''}`}>
                  {duration.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {duration.price > 0 ? `+₹${duration.price}` : '+₹0'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSelection;
