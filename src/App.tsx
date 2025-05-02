
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Insight from "./pages/Insight";
import ArticleDetail from "./pages/ArticleDetail";
import Event from "./pages/Event";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import PendingApproval from "./pages/PendingApproval";
import Questionnaire from "./pages/Questionnaire";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArticlesManagement from "./pages/admin/ArticlesManagement";
import ArticleEditor from "./pages/admin/ArticleEditor";
import ContactManagement from "./pages/admin/ContactManagement";
import UserAccountManagement from "./pages/admin/UserAccountManagement";
import ClientAppManagement from "./pages/admin/ClientAppManagement";

const queryClient = new QueryClient();

// Private route component for React Router v6 that checks for real Supabase session
const PrivateRoute = ({ children }) => {
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
    
    checkSession();
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
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin route component that checks for both authentication and admin mode
const AdminRoute = ({ children }) => {
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          {/* Header only on non-dashboard/non-onboarding/non-questionnaire/non-admin pages */}
          <Routes>
            <Route path="/dashboard" element={null} />
            <Route path="/onboarding" element={null} />
            <Route path="/welcome" element={null} />
            <Route path="/pending-approval" element={null} />
            <Route path="/questionnaire" element={null} />
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<Header />} />
          </Routes>
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/insight/:id" element={<ArticleDetail />} />
              <Route path="/event" element={<Event />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/welcome" 
                element={
                  <PrivateRoute>
                    <Welcome />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/pending-approval" 
                element={
                  <PrivateRoute>
                    <PendingApproval />
                  </PrivateRoute>
                }
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/onboarding" 
                element={
                  <PrivateRoute>
                    <Onboarding />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/questionnaire" 
                element={
                  <PrivateRoute>
                    <Questionnaire />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/articles" 
                element={
                  <AdminRoute>
                    <ArticlesManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/articles/create" 
                element={
                  <AdminRoute>
                    <ArticleEditor />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/articles/edit/:id" 
                element={
                  <AdminRoute>
                    <ArticleEditor />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/contact" 
                element={
                  <AdminRoute>
                    <ContactManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/user-account" 
                element={
                  <AdminRoute>
                    <UserAccountManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/client-app" 
                element={
                  <AdminRoute>
                    <ClientAppManagement />
                  </AdminRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          {/* Footer only on non-dashboard/non-onboarding/non-login/non-questionnaire/non-admin pages */}
          <Routes>
            <Route path="/dashboard" element={null} />
            <Route path="/onboarding" element={null} />
            <Route path="/welcome" element={null} />
            <Route path="/pending-approval" element={null} />
            <Route path="/login" element={null} />
            <Route path="/questionnaire" element={null} />
            <Route path="/admin/*" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
