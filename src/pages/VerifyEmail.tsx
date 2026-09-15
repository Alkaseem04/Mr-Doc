import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEO from '../components/SEO';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setMessage(data.message);
        } else {
          setError(true);
          setMessage(data.message || 'Verification failed');
        }
      } catch (err) {
        setError(true);
        setMessage('An error occurred during verification');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO 
        title="Verify Email - Mr.Doc Healthcare"
        description="Verify your email to activate your Mr. Doc account."
        keywords={["verify email", "account activation", "healthcare"]}
      />
      
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            Verifying your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p>Verifying your email...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${error ? 'bg-red-100' : 'bg-green-100'}`}>
                {error ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={`mb-6 ${error ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
              {!error && (
                <Button onClick={handleLoginRedirect} className="health-button">
                  Go to Login
                </Button>
              )}
              {error && (
                <Button onClick={() => navigate('/auth')} variant="outline" className="border-border text-foreground hover:bg-muted">
                  Try Again
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;