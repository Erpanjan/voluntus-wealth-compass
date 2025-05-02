
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import "./styles/auth-transitions.css"; // Import our auth transitions
import { PortalContextProvider } from "./hooks/auth/usePortalContext";

const queryClient = new QueryClient();

// Route middleware to check if we should redirect based on portal context
const PortalAwareRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const currentPortal = localStorage.getItem('portalContext') as 'admin' | 'client' || 'client';
  
  // Check if we're trying to access admin routes while in client portal
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isClientRoute = ['/dashboard', '/onboarding', '/welcome', '/pending-approval', '/questionnaire'].some(
    route => location.pathname.startsWith(route)
  );
  
  // If authenticated, ensure portal alignment
  if (isAuthenticated) {
    // User is trying to access admin routes from client portal
    if (isAdminRoute && currentPortal === 'client') {
      return <Navigate to="/login" />;
    }
    
    // User is trying to access client routes from admin portal
    if (isClientRoute && currentPortal === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  
  return children;
};

// Private route for client portal
const PrivateClientRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const currentPortal = localStorage.getItem('portalContext') || 'client';
  
  // If not authenticated or in admin portal, redirect to login
  if (!isAuthenticated || (currentPortal === 'admin')) {
    return <Navigate to="/login" />;
  }
  
  return <PortalAwareRoute>{children}</PortalAwareRoute>;
};

// Admin route component that checks for both authentication and admin mode
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdminMode = localStorage.getItem('isAdminMode') === 'true';
  const portalContext = localStorage.getItem('portalContext');
  
  // Allow access if authenticated and either in admin mode or in admin portal context
  if (isAuthenticated && (isAdminMode || portalContext === 'admin')) {
    return <PortalAwareRoute>{children}</PortalAwareRoute>;
  } else {
    return <Navigate to="/login" />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <PortalContextProvider>
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
                <Route path="/welcome" element={
                  <PrivateClientRoute>
                    <Welcome />
                  </PrivateClientRoute>
                } />
                <Route 
                  path="/pending-approval" 
                  element={
                    <PrivateClientRoute>
                      <PendingApproval />
                    </PrivateClientRoute>
                  }
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateClientRoute>
                      <Dashboard />
                    </PrivateClientRoute>
                  } 
                />
                <Route 
                  path="/onboarding" 
                  element={
                    <PrivateClientRoute>
                      <Onboarding />
                    </PrivateClientRoute>
                  } 
                />
                <Route 
                  path="/questionnaire" 
                  element={
                    <PrivateClientRoute>
                      <Questionnaire />
                    </PrivateClientRoute>
                  } 
                />
                
                {/* Admin Routes with Admin Portal-specific checking */}
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
        </PortalContextProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
