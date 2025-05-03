import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

// Private route component for React Router v6 that checks for real Supabase session
export const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  // Check for an actual Supabase session, not just localStorage
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthenticated(!!session);
      } catch (error) {
        console.error("Session check failed:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    // Immediate check for initial render
    checkSession();
    
    // Also set up listener for auth changes to keep state in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Verifying authentication...</p>
    </div>;
  }
  
  // Redirect to login if not authenticated
  if (!authenticated) {
    console.log("Access denied: No valid Supabase session found");
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route component that checks for both authentication and admin mode
export const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check for valid session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        // Check if user is in admin_users table
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();
          
        setIsAdmin(!!data && !error);
      } catch (error) {
        console.error("Admin check failed:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  // Show loading state while checking admin status
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Verifying admin access...</p>
    </div>;
  }
  
  // Redirect to login if not an admin
  if (!isAdmin) {
    console.log("Access denied: User not authorized for admin access");
    return <Navigate to="/login" />;
  }
  
  return children;
};
