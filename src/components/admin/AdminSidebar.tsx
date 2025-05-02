
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Phone, Users, Smartphone, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const userEmail = localStorage.getItem('userEmail') || 'Admin';

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

  // Dashboard, Contact Us, User Account, Client Application, Articles
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/contact', label: 'Contact Management', icon: Phone },
    { path: '/admin/user-account', label: 'User Accounts', icon: Users },
    { path: '/admin/client-app', label: 'Client Applications', icon: Smartphone },
    { path: '/admin/articles', label: 'Article Management', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col shadow-sm">
      <div className="p-6 flex flex-col items-center">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-[#333333]">Financial Dashboard</h2>
          <p className="text-xs text-[#9F9EA1] mt-1">Admin Portal</p>
        </div>
        
        <Avatar className="w-16 h-16 mb-4">
          <AvatarImage src={`https://avatar.vercel.sh/${userEmail}`} />
          <AvatarFallback className="bg-[#F2F2F2] text-[#333333]">
            {userEmail.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <p className="text-sm font-medium text-[#333333]">{userEmail}</p>
        <span className="text-xs text-[#9F9EA1] mt-1">Administrator</span>
      </div>
      
      <Separator className="mb-4 bg-[#F2F2F2]" />
      
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center py-3 px-4 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-[#F2F2F2] font-medium text-[#333333]' 
                      : 'text-[#9F9EA1] hover:bg-[#F2F2F2]/50 hover:text-[#333333]'}
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <Separator className="mb-4 bg-[#F2F2F2]" />
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-[#9F9EA1] hover:text-[#333333] rounded-lg border-[#F2F2F2]"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
