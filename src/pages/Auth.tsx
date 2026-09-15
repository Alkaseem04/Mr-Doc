import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, Calendar, MapPin, Stethoscope, UserCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SEO from '../components/SEO';
import { useUser } from '@/contexts/UserContext';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    address: '',
    specialization: '',
    clinic: '',
    licenseNumber: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.require2FA) {
          // For admin, store userId temporarily and redirect to OTP verification
          localStorage.setItem('tempUserId', data.userId);
          navigate('/verify-otp');
        } else {
          // Store token in localStorage (in a real app, use secure httpOnly cookies)
          localStorage.setItem('token', data.token);
          
          // Login user in context
          login({
            id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
          });
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${data.name}!`
          });
          
          // Redirect based on user type
          if (data.role === 'admin') {
            navigate('/admin/users');
          } else if (data.role === 'doctor') {
            navigate('/doctor-dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid email or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Signup failed",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    // Validate password strength
    if (signupData.password.length < 6) {
      toast({
        title: "Signup failed",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: userType,
          phone: signupData.phone,
          dateOfBirth: signupData.dob,
          gender: signupData.gender,
          address: signupData.address,
          specialization: signupData.specialization,
          clinic: signupData.clinic,
          licenseNumber: signupData.licenseNumber
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Account created",
          description: data.message || "Signup successful! Please check your email for verification link."
        });
        
        // Redirect to login after signup
        navigate('/auth');
      } else {
        toast({
          title: "Signup failed",
          description: data.message || "An error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignupInputChange = (field: string, value: string) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO 
        title="Login or Signup - Mr.Doc Healthcare"
        description="Access your Mr.Doc account or create a new one to manage your health information and appointments."
        keywords={["login", "signup", "authentication", "healthcare", "patient portal"]}
      />
      
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Mr.Doc</CardTitle>
          <CardDescription>
            Your personal health assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={loginData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full health-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Logging in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={userType === 'patient' ? "default" : "outline"}
                  className={`flex-1 ${userType === 'patient' ? 'health-button' : ''}`}
                  onClick={() => setUserType('patient')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Patient
                </Button>
                <Button
                  variant={userType === 'doctor' ? "default" : "outline"}
                  className={`flex-1 ${userType === 'doctor' ? 'health-button' : ''}`}
                  onClick={() => setUserType('doctor')}
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Doctor
                </Button>
              </div>
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={signupData.name}
                      onChange={(e) => handleSignupInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signupData.email}
                      onChange={(e) => handleSignupInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="pl-10"
                      value={signupData.phone}
                      onChange={(e) => handleSignupInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {userType === 'patient' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-dob">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="signup-dob"
                          type="date"
                          className="pl-10"
                          value={signupData.dob}
                          onChange={(e) => handleSignupInputChange('dob', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-gender">Gender</Label>
                      <select
                        id="signup-gender"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={signupData.gender}
                        onChange={(e) => handleSignupInputChange('gender', e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="signup-address"
                          type="text"
                          placeholder="123 Main St, City, State"
                          className="pl-10"
                          value={signupData.address}
                          onChange={(e) => handleSignupInputChange('address', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {userType === 'doctor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-specialization">Specialization</Label>
                      <Input
                        id="signup-specialization"
                        type="text"
                        placeholder="e.g., Cardiologist, Pediatrician"
                        value={signupData.specialization}
                        onChange={(e) => handleSignupInputChange('specialization', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-clinic">Clinic/Hospital</Label>
                      <Input
                        id="signup-clinic"
                        type="text"
                        placeholder="e.g., City Hospital"
                        value={signupData.clinic}
                        onChange={(e) => handleSignupInputChange('clinic', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-license-number">License Number</Label>
                      <Input
                        id="signup-license-number"
                        type="text"
                        placeholder="License number"
                        value={signupData.licenseNumber}
                        onChange={(e) => handleSignupInputChange('licenseNumber', e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={signupData.password}
                      onChange={(e) => handleSignupInputChange('password', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={signupData.confirmPassword}
                      onChange={(e) => handleSignupInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full health-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;