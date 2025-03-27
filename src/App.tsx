
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Caregivers from "./pages/Caregivers";
import BookService from "./pages/BookService";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import CaregiverDetail from "./pages/CaregiverDetail";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthProvider from "./providers/AuthProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Main App Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/caregivers" element={<Caregivers />} />
            <Route path="/caregivers/:id" element={<CaregiverDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book-service" element={<BookService />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
