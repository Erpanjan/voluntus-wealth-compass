
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Phone, Users, Smartphone, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { clearPortalSpecificFlags } from '@/hooks/auth/useLocalStorage';
import { usePortalContext } from '@/hooks/auth/usePortalContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { switchToPortal } = usePortalContext('admin');
  
  const handleLogout = async () => {
    try {
      // Set the loading state if needed
      document.body.classList.add('admin-logout-transition');
      
      // Clear only admin-related flags in localStorage
      clearPortalSpecificFlags('admin');
      localStorage.removeItem('isAdminMode');
      
      // Reset portal context to client for login page
      localStorage.setItem('portalContext', 'client');
      switchToPortal('client');
      
      // Clear authentication flag - admin users must re-authenticate
      localStorage.removeItem('isAuthenticated');
      
      // Sign out from Supabase with proper error handling
      await supabase.auth.signOut();
      
      toast({
        title: 'Logged out',
        description: 'You have been logged out of the admin portal successfully.'
      });
      
      // Small delay to ensure session is cleared and transition animation plays
      setTimeout(() => {
        navigate('/login');
      }, 300);
    } catch (error) {
      console.error('Error during admin logout:', error);
      toast({
        title: 'Logout Error',
        description: 'There was a problem logging you out. Please try again.',
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        document.body.classList.remove('admin-logout-transition');
      }, 500);
    }
  };

  // Updated order: Dashboard, Contact Us, User Account, Client Application, Articles
  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'DASHBOARD',
      icon: LayoutDashboard
    },
    {
      path: '/admin/contact',
      label: 'CONTACT US',
      icon: Phone
    },
    {
      path: '/admin/user-account',
      label: 'USER ACCOUNT',
      icon: Users
    },
    {
      path: '/admin/client-app',
      label: 'CLIENT APPLICATION',
      icon: Smartphone
    },
    {
      path: '/admin/articles',
      label: 'ARTICLES',
      icon: FileText
    }
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <nav className="flex-1 p-4 my-[113px] mx-[15px] px-[26px]">
        <ul className="space-y-6">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({isActive}) => `flex items-center py-2 rounded-lg transition-colors text-xs tracking-wide ${
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
