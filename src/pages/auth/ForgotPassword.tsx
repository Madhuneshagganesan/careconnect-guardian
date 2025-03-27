
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you'll receive password reset instructions.",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      });
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-guardian-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-guardian-600 to-guardian-400 bg-clip-text text-transparent">
              Guardian<span className="text-warm-500">Go</span>
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full"
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              {!isLoading && <Mail size={18} className="mr-2" />}
              Send Reset Link
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-guardian-500 hover:underline inline-flex items-center">
                <ArrowLeft size={16} className="mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-guardian-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <Mail size={32} className="text-guardian-500" />
            </div>
            <h3 className="text-xl font-medium">Check your email</h3>
            <p className="text-muted-foreground">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Redirecting to login page...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
