
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdvisorChat from '@/components/dashboard/AdvisorChat';
import PolicyReview from '@/components/dashboard/PolicyReview';
import AccountManagement from '@/components/dashboard/AccountManagement';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

const Dashboard = () => {
  // Use state for session management
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('advisor');
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user && !localStorage.getItem('isAuthenticated')) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      console.log('Client logout initiated');
      
      // Get user ID before signing out
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      await supabase.auth.signOut();
      
      // Clear all user-specific flags
      clearUserStateFlags(userId);
      
      // Remove client-specific flags
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
      localStorage.removeItem('onboardingComplete');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Force clear local storage even if API call fails
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
      localStorage.removeItem('onboardingComplete');
      
      toast({
        title: "Error logging out",
        description: error.message || "There was a problem logging you out.",
        variant: "destructive"
      });
      
      navigate('/login');
    }
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
      <div className="w-64 bg-[#F9F9F9] border-l min-h-screen flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-[#333333]">Financial Dashboard</h2>
          <p className="text-xs text-[#9F9EA1] mt-1">Client Portal</p>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 py-8">
          <nav className="space-y-6 px-6">
            <button 
              onClick={() => setActiveTab('advisor')}
              className={`w-full text-left transition-all text-xs ${
                activeTab === 'advisor' 
                  ? 'font-medium text-[#333333] tracking-wide' 
                  : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
              }`}
            >
              ADVISOR INTERFACE
            </button>
            
            <button 
              onClick={() => setActiveTab('policy')}
              className={`w-full text-left transition-all text-xs ${
                activeTab === 'policy' 
                  ? 'font-medium text-[#333333] tracking-wide' 
                  : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
              }`}
            >
              POLICY REVIEW
            </button>
            
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full text-left transition-all text-xs ${
                activeTab === 'account' 
                  ? 'font-medium text-[#333333] tracking-wide' 
                  : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
              }`}
            >
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
          
          {user && (
            <p className="text-xs text-center text-gray-500 mt-4">
              Logged in as: {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
