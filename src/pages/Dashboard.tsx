
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdvisorChat from '@/components/dashboard/AdvisorChat';
import PolicyReview from '@/components/dashboard/PolicyReview';
import AccountManagement from '@/components/dashboard/AccountManagement';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supabaseError, setSupabaseError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('advisor');
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase is configured properly
        if (!isSupabaseConfigured()) {
          console.error("Supabase is not configured properly");
          setSupabaseError(true);
          
          // Use localStorage fallback for demo mode
          const demoAuth = localStorage.getItem('isAuthenticated') === 'true';
          setIsAuthenticated(demoAuth);
          setLoading(false);
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setSupabaseError(true);
        
        // Fallback to localStorage for demo mode
        const demoAuth = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(demoAuth);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener only if Supabase is configured
    let authListener = { subscription: { unsubscribe: () => {} } };
    
    if (isSupabaseConfigured()) {
      authListener = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
      });
    }
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    try {
      // If Supabase is configured, use it for logout
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      
      // Always clear local storage items
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('onboardingComplete');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show a banner if using demo mode (Supabase not configured)
  const DemoBanner = () => (
    supabaseError ? (
      <div className="bg-amber-50 border-amber-200 border-l-4 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-amber-800">
              Running in demo mode. Supabase authentication is not configured.
              <button 
                onClick={() => navigate('/login')}
                className="font-medium underline text-amber-800 hover:text-amber-700 ml-1"
              >
                Configure Supabase
              </button>
            </p>
          </div>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="container mx-auto max-w-6xl">
          <DemoBanner />
          {activeTab === 'advisor' && <AdvisorChat />}
          {activeTab === 'policy' && <PolicyReview />}
          {activeTab === 'account' && <AccountManagement />}
        </div>
      </div>
      
      {/* Right Sidebar with Navigation Tabs - Updated styling to match screenshots */}
      <div className="w-64 bg-[#F9F9F9] border-l min-h-screen flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-[#333333]">Financial Dashboard</h2>
          <p className="text-xs text-[#9F9EA1] mt-1">Client Portal</p>
        </div>
        
        {/* Navigation Menu - Updated with smaller font size */}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
