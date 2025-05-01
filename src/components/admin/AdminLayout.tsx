
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { supabase } from '@/integrations/supabase/client';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Check if user is authenticated and in admin mode
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const isAdminMode = localStorage.getItem('isAdminMode') === 'true';
      
      if (!isAuthenticated || !isAdminMode) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

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
