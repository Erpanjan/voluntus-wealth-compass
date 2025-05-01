
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, BarChart2, LogOut, Settings } from 'lucide-react';
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

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/articles', label: 'Articles', icon: FileText },
    { path: '/admin/authors', label: 'Authors', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Admin Portal</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={18} className="mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full text-gray-600 hover:text-gray-900 flex items-center justify-center"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
