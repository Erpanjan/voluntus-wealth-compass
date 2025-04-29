
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvisorChat from '@/components/dashboard/AdvisorChat';
import PolicyReview from '@/components/dashboard/PolicyReview';
import AccountManagement from '@/components/dashboard/AccountManagement';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  // In a real app, this would check authentication status from a context or API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('onboardingComplete');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#F1F1F1] to-white py-16 px-6">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">Welcome to Your Financial Dashboard</h1>
            <p className="text-lg text-gray-700">
              Access your personalized investment solutions and connect with your advisor.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <Tabs defaultValue="advisor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="advisor">Advisor Interface</TabsTrigger>
            <TabsTrigger value="policy">Policy Review</TabsTrigger>
            <TabsTrigger value="account">Account Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="advisor" className="mt-8">
            <AdvisorChat />
          </TabsContent>
          
          <TabsContent value="policy" className="mt-8">
            <PolicyReview />
          </TabsContent>
          
          <TabsContent value="account" className="mt-8">
            <AccountManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
