
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import AdminToggle from '@/components/login/AdminToggle';
import LoginTabs from '@/components/login/LoginTabs';
import { useAuth } from '@/hooks/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { clearUserStateFlags } from '@/hooks/auth/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

const LoginModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous route from location state
  const previousRoute = location.state?.from?.pathname || '/';
  
  // Use the custom hook to handle authentication
  const { loading, handleRegularLogin } = useAuth(isAdminMode);

  // Open modal with optimized animation timing
  useEffect(() => {
    // Add overflow hidden to body to prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Set ready state immediately to avoid layout shift
    setIsReady(true);
    
    // Trigger modal open animation with minimal delay
    const timer = requestAnimationFrame(() => {
      setIsModalOpen(true);
    });

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      cancelAnimationFrame(timer);
    };
  }, []);

  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (loading) return;
    
    const checkExistingAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          return;
        }
        
        if (isAdminMode) {
          const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', session.user.id)
            .single();
            
          if (data && !error) {
            handleClose(() => navigate('/admin/dashboard', { replace: true }));
          } else {
            toast({
              title: "Access Denied",
              description: "Your account does not have admin privileges.",
              variant: "destructive",
            });
            
            await supabase.auth.signOut();
            clearUserStateFlags(session.user.id);
          }
        } else {
          await handleRegularLogin();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        clearUserStateFlags();
      }
    };
    
    checkExistingAuth();
  }, [loading, isAdminMode, toast, handleRegularLogin, navigate]);

  // Handle closing the modal
  const handleClose = (callback?: () => void) => {
    setIsModalOpen(false);
    
    // Wait for exit animation to complete before navigating
    setTimeout(() => {
      document.body.style.overflow = '';
      if (callback) {
        callback();
      } else {
        navigate(previousRoute, { replace: true });
      }
    }, 200);
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle toggle animation for mode switch
  const handleAdminToggle = (checked: boolean) => {
    setIsAnimating(true);
    setIsAdminMode(checked);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 100);
  };

  // Show loading state
  if (loading) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        isReady ? 'bg-black/10 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-t-transparent text-gray-600 mb-2"></div>
          <p className="text-gray-600">Connecting to portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ease-out ${
        isModalOpen && isReady ? 'bg-black/20 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Login Modal Card */}
      <div 
        className={`w-[95vw] max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 ease-out max-h-[90vh] overflow-y-auto ${
          isModalOpen && isReady
            ? 'opacity-100 transform scale-100 translate-y-0' 
            : 'opacity-0 transform scale-98 translate-y-2'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-3 right-3 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 mobile-touch-target"
          aria-label="Close login modal"
        >
          <X size={18} className="text-gray-500" />
        </button>

        {/* Modal Content */}
        <div className="p-4 sm:p-8 pt-8 sm:pt-12">
          {/* Title and admin mode toggle */}
          <div className="mb-6 sm:mb-8 text-center">
            <AdminToggle 
              isAdminMode={isAdminMode}
              onToggle={handleAdminToggle}
              isAnimating={isAnimating}
            />
          </div>

          {/* Login Tabs */}
          <div className={`transition-opacity duration-200 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
            <LoginTabs 
              isAdminMode={isAdminMode}
              isAnimating={isAnimating}
              onRegularLogin={handleRegularLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
