
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [loginData, setLoginData] = useState({
    accountName: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    contactType: 'email',
    contact: '',
    password: '',
    confirmPassword: '',
  });

  const [forgotData, setForgotData] = useState({
    contact: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle login form change
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle register form change
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle forgot password form change
  const handleForgotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulating login request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set authentication flag in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      toast({
        title: "Login successful",
        description: "Welcome back to Voluntus Long-term Capital.",
        duration: 5000,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid account name or password. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulating registration request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Let's complete your profile setup.",
        duration: 5000,
      });

      // Redirect to onboarding
      navigate('/onboarding');
      
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error registering your account. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle forgot password submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulating forgot password request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reset link sent",
        description: "If an account exists with this contact, you'll receive a password reset link.",
        duration: 5000,
      });

      // Reset form
      setForgotData({
        contact: '',
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was an error processing your request. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle demo account login
  const handleDemoLogin = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard');
      
      toast({
        title: "Demo Account Activated",
        description: "You are now using a demo account to explore the platform.",
        duration: 5000,
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="py-5 text-center mb-4">
          <Link to="/" className="inline-block mb-2">
            <img src="/logo.png" alt="Voluntus" className="h-18 mx-auto" />
          </Link>
          <h1 className="text-lg font-medium">Client Portal</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="forgot">Reset Password</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="p-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={loginData.accountName}
                  onChange={handleLoginChange}
                  placeholder="Enter your account name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-sm" 
                  onClick={handleDemoLogin}
                  disabled={isSubmitting}
                >
                  Try Demo Account
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="p-6">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactType">Contact Type</Label>
                <select
                  id="contactType"
                  name="contactType"
                  value={registerData.contactType}
                  onChange={handleRegisterChange}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Number</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">
                  {registerData.contactType === 'email' ? 'Email' : 'Phone Number'}
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  type={registerData.contactType === 'email' ? 'email' : 'tel'}
                  value={registerData.contact}
                  onChange={handleRegisterChange}
                  placeholder={registerData.contactType === 'email' ? 'name@example.com' : '+852 XXXX XXXX'}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    name="password"
                    type={showRegPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showRegPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </TabsContent>

          {/* Forgot Password Tab */}
          <TabsContent value="forgot" className="p-6">
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-contact">Email or Phone Number</Label>
                <Input
                  id="forgot-contact"
                  name="contact"
                  type="text"
                  value={forgotData.contact}
                  onChange={handleForgotChange}
                  placeholder="Enter your registered email or phone"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Reset Password'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 text-center">
          <p className="text-sm text-gray-500">
            Need help? <Link to="/contact" className="text-black hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
