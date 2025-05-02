
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Phone, Users, Smartphone, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isAdminMode');
    
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
    
    navigate('/login');
  };

  // Updated order: Dashboard, Contact Us, User Account, Client Application, Articles
  const navItems = [
    { path: '/admin/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { path: '/admin/contact', label: 'CONTACT US', icon: Phone },
    { path: '/admin/user-account', label: 'USER ACCOUNT', icon: Users },
    { path: '/admin/client-app', label: 'CLIENT APPLICATION', icon: Smartphone },
    { path: '/admin/articles', label: 'ARTICLES', icon: FileText },
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Financial Dashboard</h2>
        <p className="text-xs text-[#9F9EA1] mt-1">Admin Portal</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-2 rounded-lg transition-colors text-xs tracking-wide ${
                    isActive
                      ? 'font-medium text-[#333333]'
                      : 'font-normal text-[#9F9EA1] hover:text-[#333333]'
                  }`
                }
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
