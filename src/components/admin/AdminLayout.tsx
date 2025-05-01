
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
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Check if user is authenticated and in admin mode
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Not authenticated');
        }
        
        // Check if user is an admin
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data?.is_admin) {
          throw new Error('Not authorized as admin');
        }
        
        // User is authenticated and is an admin
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdminMode', 'true');
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Verifying admin credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
