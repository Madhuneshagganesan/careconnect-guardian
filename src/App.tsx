
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
import { useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Auth route component - redirects to home if already logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - redirect to home if already logged in */}
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
      <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
      
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/caregivers" element={<Caregivers />} />
      <Route path="/caregivers/:id" element={<CaregiverDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<AboutUs />} />
      
      {/* Protected Routes - require authentication */}
      <Route path="/book-service" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
