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
        console.log('AdminLayout: Checking admin authentication...');
        
        // First check if we already have a valid admin session in localStorage
        const isAdminMode = localStorage.getItem('isAdminMode') === 'true';
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        console.log('AdminLayout: LocalStorage auth status:', { isAdminMode, isAuthenticated });
        
        if (isAuthenticated && isAdminMode) {
          console.log('AdminLayout: Admin session found in localStorage');
          setIsAuthorized(true);
          setInitialLoading(false);
          return;
        }
        
        // If not, verify with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('AdminLayout: Supabase session check result:', { 
          hasSession: !!session,
          userId: session?.user?.id 
        });
        
        if (!session) {
          console.log('AdminLayout: No session found in Supabase');
          throw new Error('Not authenticated');
        }
        
        // Check if user is an admin using admin_users table
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();
        
        console.log('AdminLayout: Admin check result:', { data, error });
        
        if (error || !data) {
          console.log('AdminLayout: User is not an admin');
          throw new Error('Not authorized as admin');
        }
        
        // User is authenticated and is an admin
        console.log('AdminLayout: User confirmed as admin');
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdminMode', 'true');
        setIsAuthorized(true);
        setInitialLoading(false);
      } catch (error) {
        console.error('AdminLayout: Authentication error:', error);
        
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
          {isAuthorized ? (
            <>
              {children}
              <div className="mt-4 text-xs text-gray-400 text-right">
                Admin session active
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
