
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Questionnaire from "./pages/Questionnaire";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArticlesManagement from "./pages/admin/ArticlesManagement";
import ArticleEditor from "./pages/admin/ArticleEditor";
import AuthorManagement from "./pages/admin/AuthorManagement";

const queryClient = new QueryClient();

// Private route component for React Router v6
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin route component that checks for both authentication and admin mode
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdminMode = localStorage.getItem('isAdminMode') === 'true';
  
  return isAuthenticated && isAdminMode ? children : <Navigate to="/login" />;
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
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/onboarding" 
                element={<Onboarding />} 
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
                path="/admin/authors" 
                element={
                  <AdminRoute>
                    <AuthorManagement />
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
