
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import Insight from "@/pages/Insight";
import ArticleDetail from "@/pages/ArticleDetail";
import Event from "@/pages/Event";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import Welcome from "@/pages/Welcome";
import PendingApproval from "@/pages/PendingApproval";
import Questionnaire from "@/pages/Questionnaire";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ArticlesManagement from "@/pages/admin/ArticlesManagement";
import ArticleEditor from "@/pages/admin/ArticleEditor";
import ContactManagement from "@/pages/admin/ContactManagement";
import UserAccountManagement from "@/pages/admin/UserAccountManagement";
import { PrivateRoute, AdminRoute } from "@/components/auth/ProtectedRoutes";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const AppRoutes = () => {
  return (
    <>
      {/* Header conditional rendering */}
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
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Footer conditional rendering */}
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
    </>
  );
};

export default AppRoutes;
