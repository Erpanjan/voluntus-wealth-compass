
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogOut, LayoutDashboard, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdvisorChat from '@/components/dashboard/AdvisorChat';
import PolicyReview from '@/components/dashboard/PolicyReview';
import AccountManagement from '@/components/dashboard/AccountManagement';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

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

  // Function to render the active content based on tab
  const renderContent = () => {
    switch (activeTab) {
      case 'advisor':
        return <AdvisorChat />;
      case 'policy':
        return <PolicyReview />;
      case 'account':
        return <AccountManagement />;
      default:
        return <AdvisorChat />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex w-full">
      <SidebarProvider defaultOpen={true}>
        <Sidebar variant="inset">
          <SidebarHeader className="p-4 border-b">
            <h2 className="text-xl font-semibold">Financial Dashboard</h2>
            <p className="text-sm text-gray-500">Welcome to your portal</p>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'advisor'} 
                  onClick={() => setActiveTab('advisor')}
                >
                  <LayoutDashboard className="mr-2" />
                  <span>Advisor Interface</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'policy'} 
                  onClick={() => setActiveTab('policy')}
                >
                  <FileText className="mr-2" />
                  <span>Policy Review</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeTab === 'account'} 
                  onClick={() => setActiveTab('account')}
                >
                  <User className="mr-2" />
                  <span>Account Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t p-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 justify-center"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto max-w-6xl">
            {renderContent()}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
