
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Insight from "./pages/Insight";
import Event from "./pages/Event";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Welcome from "./pages/Welcome";
import PendingApproval from "./pages/PendingApproval";
import Questionnaire from "./pages/Questionnaire";
import ArticleDetail from "./pages/ArticleDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserAccountManagement from "./pages/admin/UserAccountManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import ArticlesManagement from "./pages/admin/ArticlesManagement";
import ArticleEditor from "./pages/admin/ArticleEditor";
import EditArticle from "./pages/admin/EditArticle";
import AuthorManagement from "./pages/admin/AuthorManagement";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

// Helper function to determine if a route should show public layout (Header/Footer)
const shouldShowPublicLayout = (pathname: string): boolean => {
  // Admin routes - no public layout
  if (pathname.startsWith('/admin')) {
    return false;
  }
  
  // Client portal routes - no public layout
  const clientPortalRoutes = [
    '/onboarding',
    '/dashboard', 
    '/welcome',
    '/pending-approval',
    '/questionnaire'
  ];
  
  if (clientPortalRoutes.includes(pathname)) {
    return false;
  }
  
  // Public website routes - show public layout
  return true;
};

// Layout component that conditionally renders Header/Footer
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showPublicLayout = shouldShowPublicLayout(location.pathname);

  if (!showPublicLayout) {
    // Admin routes and client portal routes: render only the content
    return <>{children}</>;
  }

  // Public website routes: render with Header and Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/insight" element={<Insight />} />
              <Route path="/insight/:slug" element={<ArticleDetail />} />
              <Route path="/event" element={<Event />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserAccountManagement />} />
              <Route path="/admin/contacts" element={<ContactManagement />} />
              <Route path="/admin/articles" element={<ArticlesManagement />} />
              <Route path="/admin/articles/create" element={<ArticleEditor />} />
              <Route path="/admin/articles/edit/:id" element={<EditArticle />} />
              <Route path="/admin/authors" element={<AuthorManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
