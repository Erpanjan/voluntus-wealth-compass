
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  
  // Check if user is authenticated and in admin mode
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking admin authentication...');
        
        // First check if we already have a valid admin session in localStorage
        const isAdminMode = localStorage.getItem('isAdminMode') === 'true';
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (isAuthenticated && isAdminMode) {
          console.log('Admin session found in localStorage');
          setIsAuthorized(true);
          setInitialLoading(false);
          return;
        }
        
        // If not, verify with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }
        
        console.log('Supabase session found, checking admin status');
        
        // Check if user is an admin using admin_users table
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();
        
        if (error || !data) {
          throw new Error('Not authorized as admin');
        }
        
        // User is authenticated and is an admin
        console.log('User confirmed as admin');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdminMode', 'true');
        setIsAuthorized(true);
        setInitialLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        
        // Redirect to login page
        toast({
          title: "Access Denied",
          description: "Please log in with an admin account to access this area.",
          variant: "destructive",
        });
        
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdminMode');
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  // Once authorized, the layout will remain consistent during tab navigation
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {isAuthorized ? children : null}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
