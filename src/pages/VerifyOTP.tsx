import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEO from '../components/SEO';
import { useUser } from '@/contexts/UserContext';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  // Get userId from localStorage (set during login)
  React.useEffect(() => {
    const storedUserId = localStorage.getItem('tempUserId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // If no userId, redirect to login
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Login user
        login({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        });
        
        // Store token
        localStorage.setItem('token', data.token);
        
        // Clear temp userId
        localStorage.removeItem('tempUserId');
        
        toast({
          title: "Login successful",
          description: data.message
        });
        
        // Redirect to admin dashboard
        navigate('/admin/users');
      } else {
        toast({
          title: "Verification failed",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    // In a real implementation, you would call an API to resend the OTP
    toast({
      title: "OTP Resent",
      description: "A new OTP has been sent to your email"
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO 
        title="Verify OTP - Mr.Doc Healthcare"
        description="Enter your one-time verification code to access your admin account."
        keywords={["verify otp", "admin login", "two-factor authentication", "healthcare"]}
      />
      
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Login Verification</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full health-button"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Verifying...
                </div>
              ) : (
                "Verify and Continue"
              )}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm"
                onClick={handleResendOTP}
              >
                Resend OTP
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTP;