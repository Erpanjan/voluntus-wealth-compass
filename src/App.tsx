
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Insight from "./pages/Insight";
import Event from "./pages/Event";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

// Private route component
const PrivateRoute = ({ children, redirectTo = "/login" }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Redirect to={redirectTo} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* Header only on non-dashboard/non-onboarding pages */}
          <Routes>
            <Route path="/dashboard" element={null} />
            <Route path="/onboarding" element={null} />
            <Route path="*" element={<Header />} />
          </Routes>
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/insight" element={<Insight />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          {/* Footer only on non-dashboard/non-onboarding pages */}
          <Routes>
            <Route path="/dashboard" element={null} />
            <Route path="/onboarding" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
