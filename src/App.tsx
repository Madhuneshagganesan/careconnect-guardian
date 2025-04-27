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
import VoiceAssistant from "./components/voice/VoiceAssistant";
import SOSButton from "./components/sos/SOSButton";
import { LiveTrackingProvider } from './providers/LiveTrackingProvider';

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
  const { isAuthenticated } = useAuth();
  
  // If not authenticated, only allow access to auth routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  
  // If authenticated, show all routes
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/caregivers" element={<ProtectedRoute><Caregivers /></ProtectedRoute>} />
      <Route path="/caregivers/:id" element={<ProtectedRoute><CaregiverDetail /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
      <Route path="/how-it-works" element={<ProtectedRoute><HowItWorks /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
      <Route path="/book-service" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/signup" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <LiveTrackingProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
              {/* Always show Voice Assistant regardless of auth status */}
              <VoiceAssistant />
              {/* Show SOS button only when authenticated */}
              <SOSContent />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LiveTrackingProvider>
    </AuthProvider>
  );
}

// Component to conditionally render SOS button
const SOSContent = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return <SOSButton />;
};

export default App;
