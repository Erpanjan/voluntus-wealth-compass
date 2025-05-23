
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous route from location state
  const previousRoute = location.state?.from?.pathname || '/';
  
  // Use the custom hook to handle authentication
  const { loading, handleRegularLogin } = useAuth(isAdminMode);

  // Open modal with animation on mount
  useEffect(() => {
    // Add overflow hidden to body to prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Trigger modal open animation
    requestAnimationFrame(() => {
      setIsModalOpen(true);
    });

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
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
    }, 300);
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
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isModalOpen ? 'bg-black/20 backdrop-blur-sm' : 'bg-transparent'
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
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out ${
        isModalOpen ? 'bg-black/20 backdrop-blur-sm' : 'bg-transparent'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Login Modal Card */}
      <div 
        className={`max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
          isModalOpen 
            ? 'opacity-100 transform scale-100 translate-y-0' 
            : 'opacity-0 transform scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close login modal"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Modal Content */}
        <div className="p-8 pt-12">
          {/* Title and admin mode toggle */}
          <div className="mb-8 text-center">
            <AdminToggle 
              isAdminMode={isAdminMode}
              onToggle={handleAdminToggle}
              isAnimating={isAnimating}
            />
          </div>

          {/* Login Tabs */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
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
