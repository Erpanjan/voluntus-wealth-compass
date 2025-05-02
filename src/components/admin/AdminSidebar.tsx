
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Phone, Users, Smartphone, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      console.log('Admin logout initiated');
      
      // Get user ID before signing out
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      await supabase.auth.signOut();
      
      // Clear all user-specific flags
      clearUserStateFlags(userId);
      
      // Clear admin-specific flags
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
      
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.'
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Force clear local storage even if API call fails
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isAdminMode');
      
      toast({
        title: 'Logout issue',
        description: 'There was an issue with logout, but you have been signed out locally.',
        variant: 'destructive'
      });
      
      navigate('/login');
    }
  };

  // Updated order: Dashboard, Contact Us, User Account, Client Application, Articles
  const navItems = [{
    path: '/admin/dashboard',
    label: 'DASHBOARD',
    icon: LayoutDashboard
  }, {
    path: '/admin/contact',
    label: 'CONTACT US',
    icon: Phone
  }, {
    path: '/admin/user-account',
    label: 'USER ACCOUNT',
    icon: Users
  }, {
    path: '/admin/client-app',
    label: 'CLIENT APPLICATION',
    icon: Smartphone
  }, {
    path: '/admin/articles',
    label: 'ARTICLES',
    icon: FileText
  }];
  
  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <nav className="flex-1 p-4 my-[113px] mx-[15px] px-[26px]">
        <ul className="space-y-6">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `flex items-center py-2 rounded-lg transition-colors text-xs tracking-wide ${
                  isActive ? 'font-medium text-[#333333]' : 'font-normal text-[#9F9EA1] hover:text-[#333333]'
                }`}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-2 text-[#9F9EA1] hover:text-[#333333] rounded-full"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
