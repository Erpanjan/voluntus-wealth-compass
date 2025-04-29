
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdvisorChat from '@/components/dashboard/AdvisorChat';
import PolicyReview from '@/components/dashboard/PolicyReview';
import AccountManagement from '@/components/dashboard/AccountManagement';

const Dashboard = () => {
  // In a real app, this would check authentication status from a context or API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('advisor');

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
    <div className="min-h-screen bg-white flex">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="container mx-auto max-w-6xl">
          {activeTab === 'advisor' && <AdvisorChat />}
          {activeTab === 'policy' && <PolicyReview />}
          {activeTab === 'account' && <AccountManagement />}
        </div>
      </div>
      
      {/* Right Sidebar with Navigation Tabs */}
      <div className="w-64 bg-gray-100 border-l min-h-screen flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Financial Dashboard</h2>
          <p className="text-xs text-gray-500">Client Portal</p>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 py-6">
          <nav className="space-y-1 px-2">
            <button 
              onClick={() => setActiveTab('advisor')}
              className={`w-full text-left px-3 py-2 transition-colors ${
                activeTab === 'advisor' 
                  ? 'font-semibold text-black' 
                  : 'font-normal text-gray-600 hover:text-black'
              }`}
            >
              Advisor Interface
            </button>
            
            <button 
              onClick={() => setActiveTab('policy')}
              className={`w-full text-left px-3 py-2 transition-colors ${
                activeTab === 'policy' 
                  ? 'font-semibold text-black' 
                  : 'font-normal text-gray-600 hover:text-black'
              }`}
            >
              Policy Review
            </button>
            
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-3 py-2 transition-colors ${
                activeTab === 'account' 
                  ? 'font-semibold text-black' 
                  : 'font-normal text-gray-600 hover:text-black'
              }`}
            >
              Account Management
            </button>
          </nav>
        </div>
        
        {/* Footer/Logout Section */}
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
