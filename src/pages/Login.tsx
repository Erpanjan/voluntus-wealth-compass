
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      
      // Show success toast
      toast({
        title: "Login successful",
        description: "Welcome back to Voluntus Long-term Capital.",
        duration: 5000,
      });

      // Redirect to dashboard (in a real app)
      // history.push('/dashboard');
    } catch (error) {
      // Show error toast
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
      
      // Show success toast
      toast({
        title: "Registration successful",
        description: "A verification link has been sent to your contact. Please verify to continue.",
        duration: 5000,
      });

      // Reset form
      setRegisterData({
        contactType: 'email',
        contact: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      // Show error toast
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
      
      // Show success toast
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
      // Show error toast
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-voluntus-gray-light py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="py-6 px-8 bg-voluntus-blue text-white text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-2">
            <div className="text-2xl font-bold">
              <span className="text-white">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg leading-none">VOLUNTUS</span>
              <span className="text-xs text-white/80 leading-none">LONG-TERM CAPITAL</span>
            </div>
          </Link>
          <h1 className="text-xl font-semibold">Client Portal</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="forgot">Forgot Password</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="p-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium mb-1">
                  Account Name
                </label>
                <input
                  id="accountName"
                  name="accountName"
                  type="text"
                  required
                  value={loginData.accountName}
                  onChange={handleLoginChange}
                  className="w-full"
                  placeholder="Enter your account name"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="p-6">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label htmlFor="contactType" className="block text-sm font-medium mb-1">
                  Contact Type
                </label>
                <select
                  id="contactType"
                  name="contactType"
                  value={registerData.contactType}
                  onChange={handleRegisterChange}
                  className="w-full rounded-lg border border-voluntus-gray-light bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-voluntus-blue"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Number</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium mb-1">
                  {registerData.contactType === 'email' ? 'Email' : 'Phone Number'}
                </label>
                <input
                  id="contact"
                  name="contact"
                  type={registerData.contactType === 'email' ? 'email' : 'tel'}
                  required
                  value={registerData.contact}
                  onChange={handleRegisterChange}
                  className="w-full"
                  placeholder={registerData.contactType === 'email' ? 'name@example.com' : '+852 XXXX XXXX'}
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className="w-full"
                  placeholder="••••••••"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </TabsContent>

          {/* Forgot Password Tab */}
          <TabsContent value="forgot" className="p-6">
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-contact" className="block text-sm font-medium mb-1">
                  Email or Phone Number
                </label>
                <input
                  id="forgot-contact"
                  name="contact"
                  type="text"
                  required
                  value={forgotData.contact}
                  onChange={handleForgotChange}
                  className="w-full"
                  placeholder="Enter your registered email or phone"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Reset Password'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 text-center">
          <p className="text-sm text-voluntus-text-secondary">
            Need help? <a href="/contact" className="text-voluntus-blue hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
