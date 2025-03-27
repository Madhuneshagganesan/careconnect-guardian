
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API to send a password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If an account exists with that email, you will receive a password reset link shortly.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending the reset link. Please try again.",
        variant: "destructive",
      });
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-guardian-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-guardian-600 to-guardian-400 bg-clip-text text-transparent">
                Guardian<span className="text-warm-500">Go</span>
              </span>
            </h1>
          </Link>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>
        
        {isSubmitted ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
              <p className="font-medium">Check your email</p>
              <p className="mt-1">We've sent a password reset link to {email}</p>
            </div>
            <p className="text-muted-foreground mb-6">
              Didn't receive an email? Check your spam folder or try again.
            </p>
            <div className="flex flex-col space-y-4">
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                Try again with a different email
              </Button>
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                {!isLoading && <Send size={18} className="mr-2" />}
                Send Reset Link
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center text-guardian-500 hover:underline">
                <ArrowLeft size={16} className="mr-1" />
                Back to login
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
