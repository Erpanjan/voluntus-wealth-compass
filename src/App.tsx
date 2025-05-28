
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AuthorManagement from "./pages/admin/AuthorManagement";
import { LanguageProvider } from "./contexts/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/insight" element={<Insight />} />
                <Route path="/insight/:id" element={<ArticleDetail />} />
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
                <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
                <Route path="/admin/authors" element={<AuthorManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
