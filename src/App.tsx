
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import HowItWorks from '@/pages/HowItWorks';
import Services from '@/pages/Services';
import Caregivers from '@/pages/Caregivers';
import CaregiverDetail from '@/pages/CaregiverDetail';
import CaregiverReview from '@/pages/CaregiverReview';
import BookService from '@/pages/BookService';
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import { AuthProvider } from '@/providers/AuthProvider'; 
import { LiveTrackingProvider } from '@/providers/LiveTrackingProvider';
import VoiceAssistant from '@/components/voice/VoiceAssistant';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LiveTrackingProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-us" element={<AboutUs />} />
            {/* Redirect /about to /about-us */}
            <Route path="/about" element={<Navigate to="/about-us" replace />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/services" element={<Services />} />
            <Route path="/caregivers" element={<Caregivers />} />
            <Route path="/caregiver/:id" element={<CaregiverDetail />} />
            <Route path="/caregiver/:id/review" element={<CaregiverReview />} />
            <Route path="/book-service" element={<BookService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <VoiceAssistant />
        </LiveTrackingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
