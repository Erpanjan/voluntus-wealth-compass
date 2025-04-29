
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AdvisorChat from '@/components/dashboard/AdvisorChat';
import PolicyReview from '@/components/dashboard/PolicyReview';
import AccountManagement from '@/components/dashboard/AccountManagement';

const Dashboard = () => {
  // In a real app, this would check authentication status from a context or API
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('advisor');
  const [previousTab, setPreviousTab] = useState('');
  const [animationDirection, setAnimationDirection] = useState<'in' | 'out'>('in');
  
  // Track activity for session timeout
  useEffect(() => {
    const lastActivity = new Date().getTime();
    localStorage.setItem('lastActivity', lastActivity.toString());
    
    const checkActivity = () => {
      const currentTime = new Date().getTime();
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0');
      const inactiveTime = currentTime - lastActivity;
      
      // If inactive for more than 30 minutes (1800000 ms), log out
      if (inactiveTime > 1800000) {
        handleLogout();
      }
    };
    
    const activityInterval = setInterval(checkActivity, 60000); // Check every minute
    
    return () => {
      clearInterval(activityInterval);
    };
  }, []);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleTabChange = (tab: string) => {
    // Skip if already on this tab
    if (tab === activeTab) return;
    
    setPreviousTab(activeTab);
    setAnimationDirection('out');
    
    // Short timeout to allow for exit animation
    setTimeout(() => {
      setActiveTab(tab);
      setAnimationDirection('in');
      
      // Track this activity
      localStorage.setItem('lastActivity', new Date().getTime().toString());
    }, 200);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('onboardingComplete');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate('/login');
  };

  // Determine which content to show with animations
  const renderContent = () => {
    const animationClass = animationDirection === 'in' ? 'animate-fade-in' : 'animate-fade-out';
    
    return (
      <div className={`flex-1 p-6 ${animationClass}`} style={{ animationDuration: '200ms' }}>
        <div className="container mx-auto max-w-6xl">
          {activeTab === 'advisor' && <AdvisorChat />}
          {activeTab === 'policy' && <PolicyReview />}
          {activeTab === 'account' && <AccountManagement />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Main Content Area */}
      {renderContent()}
      
      {/* Right Sidebar with Navigation Tabs */}
      <div className="w-64 bg-[#F9F9F9] border-l min-h-screen flex flex-col">
        <div className="p-6 border-b flex flex-col">
          <h2 className="text-lg font-medium text-[#333333]">Financial Dashboard</h2>
          <p className="text-xs text-[#9F9EA1] mt-1">Client Portal</p>
          
          {/* User info */}
          <div className="mt-6 flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/lovable-uploads/822caf58-c2a0-42b8-b572-0dcd908ddbd5.png" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#333333]">Your Account</p>
              <p className="text-xs text-[#9F9EA1]">Personal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 py-8">
          <nav className="space-y-6 px-6">
            <button 
              onClick={() => handleTabChange('advisor')}
              className={`w-full text-left transition-all text-xs flex items-center ${
                activeTab === 'advisor' 
                  ? 'font-medium text-[#333333] tracking-wide' 
                  : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
              }`}
            >
              <div className={`w-1 h-4 mr-2 rounded-full transition-all ${activeTab === 'advisor' ? 'bg-[#333333]' : 'bg-transparent'}`}></div>
              ADVISOR INTERFACE
            </button>
            
            <button 
              onClick={() => handleTabChange('policy')}
              className={`w-full text-left transition-all text-xs flex items-center ${
                activeTab === 'policy' 
                  ? 'font-medium text-[#333333] tracking-wide' 
                  : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
              }`}
            >
              <div className={`w-1 h-4 mr-2 rounded-full transition-all ${activeTab === 'policy' ? 'bg-[#333333]' : 'bg-transparent'}`}></div>
              POLICY REVIEW
            </button>
            
            <button 
              onClick={() => handleTabChange('account')}
              className={`w-full text-left transition-all text-xs flex items-center ${
                activeTab === 'account' 
                  ? 'font-medium text-[#333333] tracking-wide' 
                  : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
              }`}
            >
              <div className={`w-1 h-4 mr-2 rounded-full transition-all ${activeTab === 'account' ? 'bg-[#333333]' : 'bg-transparent'}`}></div>
              ACCOUNT MANAGEMENT
            </button>
          </nav>
        </div>
        
        {/* Footer/Logout Section */}
        <div className="p-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-[#9F9EA1] hover:text-[#333333]"
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
