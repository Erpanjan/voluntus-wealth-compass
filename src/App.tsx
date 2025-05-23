
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, memo, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import ErrorBoundary from "./components/ErrorBoundary";
import { useNetworkStatus } from "./hooks/useNetworkStatus";

// Lazy load components for better performance
const Header = memo(() => import("./components/layout/Header").then(m => ({ default: m.default })));
const Footer = memo(() => import("./components/layout/Footer").then(m => ({ default: m.default })));
const Index = memo(() => import("./pages/Index").then(m => ({ default: m.default })));
const Services = memo(() => import("./pages/Services").then(m => ({ default: m.default })));
const Insight = memo(() => import("./pages/Insight").then(m => ({ default: m.default })));
const ArticleDetail = memo(() => import("./pages/ArticleDetail").then(m => ({ default: m.default })));
const Event = memo(() => import("./pages/Event").then(m => ({ default: m.default })));
const About = memo(() => import("./pages/About").then(m => ({ default: m.default })));
const Contact = memo(() => import("./pages/Contact").then(m => ({ default: m.default })));
const Login = memo(() => import("./pages/Login").then(m => ({ default: m.default })));
const NotFound = memo(() => import("./pages/NotFound").then(m => ({ default: m.default })));
const Dashboard = memo(() => import("./pages/Dashboard").then(m => ({ default: m.default })));
const Onboarding = memo(() => import("./pages/Onboarding").then(m => ({ default: m.default })));
const Welcome = memo(() => import("./pages/Welcome").then(m => ({ default: m.default })));
const PendingApproval = memo(() => import("./pages/PendingApproval").then(m => ({ default: m.default })));
const Questionnaire = memo(() => import("./pages/Questionnaire").then(m => ({ default: m.default })));
const AdminDashboard = memo(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.default })));
const ArticlesManagement = memo(() => import("./pages/admin/ArticlesManagement").then(m => ({ default: m.default })));
const ArticleEditor = memo(() => import("./pages/admin/ArticleEditor").then(m => ({ default: m.default })));
const ContactManagement = memo(() => import("./pages/admin/ContactManagement").then(m => ({ default: m.default })));
const UserAccountManagement = memo(() => import("./pages/admin/UserAccountManagement").then(m => ({ default: m.default })));

// Optimized QueryClient with better error handling and caching
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) return false;
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 1 * 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        meta: {
          onError: (error: any) => {
            console.error('Mutation error:', error);
          }
        }
      }
    }
  });
};

const queryClient = createQueryClient();

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-t-transparent text-gray-600"></div>
  </div>
);

// Network status indicator
const NetworkIndicator = memo(() => {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  
  if (isOnline && !isSlowConnection) return null;
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 text-center py-2 text-sm font-medium ${
      !isOnline ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
    }`}>
      {!isOnline ? 'You are offline' : 'Slow connection detected'}
    </div>
  );
});

// Private route component with improved session handling
const PrivateRoute = memo(({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setAuthenticated(!!session);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        if (isMounted) {
          setAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setAuthenticated(!!session);
        setLoading(false);
      }
    });
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
});

// Admin route component with improved error handling
const AdminRoute = memo(({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }
        
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (isMounted) {
          setIsAdmin(!!data && !error);
          setLoading(false);
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };
    
    checkAdminStatus();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
});

const App = () => {
  const [appError, setAppError] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
      setAppError(event.error?.message || 'An unexpected error occurred');
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setAppError('A network or processing error occurred');
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (appError) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4 text-center">
        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
        <p className="mb-4 text-gray-600">{appError}</p>
        <button 
          onClick={() => {
            setAppError(null);
            window.location.reload();
          }}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <NetworkIndicator />
            <div className="flex flex-col min-h-screen">
              <Suspense fallback={<div />}>
                <Routes>
                  <Route path="/dashboard" element={null} />
                  <Route path="/onboarding" element={null} />
                  <Route path="/welcome" element={null} />
                  <Route path="/pending-approval" element={null} />
                  <Route path="/questionnaire" element={null} />
                  <Route path="/admin/*" element={null} />
                  <Route path="*" element={<Header />} />
                </Routes>
              </Suspense>
              
              <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner />}>
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
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              
              <Suspense fallback={<div />}>
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
              </Suspense>
            </div>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
