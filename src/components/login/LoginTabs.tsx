
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';

interface LoginTabsProps {
  isAdminMode: boolean;
  isAnimating: boolean;
  onDemoLogin: () => void;
  onRegularLogin: () => void;
}

const LoginTabs: React.FC<LoginTabsProps> = ({
  isAdminMode,
  isAnimating,
  onDemoLogin,
  onRegularLogin
}) => {
  return (
    <div 
      className={`portal-switch transition-all duration-500 ease-in-out ${
        isAnimating ? 'opacity-70 transform scale-[0.99]' : 'opacity-100 transform scale-100'
      }`}
      style={{ 
        willChange: 'opacity, transform', 
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d'
      }}
    >
      {isAdminMode ? (
        // Admin mode - Single login tab with consistent height
        <Tabs defaultValue="login" className="w-full custom-tabs prevent-flicker">
          <div className="px-6">
            <TabsList className="grid grid-cols-1 w-full bg-transparent p-0 h-12 relative">
              <TabsTrigger value="login" className="tab-button">Login</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="h-[450px] relative overflow-hidden prevent-flicker">
            <TabsContent 
              value="login" 
              className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out"
              // Force render even during transitions
              forceMount={true}
            >
              <LoginForm onDemoLogin={onDemoLogin} onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        // Client mode - All three tabs with the same fixed height
        <Tabs defaultValue="login" className="w-full custom-tabs prevent-flicker">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-12 relative">
              <TabsTrigger value="login" className="tab-button">Login</TabsTrigger>
              <TabsTrigger value="register" className="tab-button">Register</TabsTrigger>
              <TabsTrigger value="forgot" className="tab-button">Reset Password</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="h-[450px] relative overflow-hidden prevent-flicker">
            <TabsContent 
              value="login" 
              className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out"
              forceMount={true}
            >
              <LoginForm onDemoLogin={onDemoLogin} onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent 
              value="register" 
              className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out"
              forceMount={true}
            >
              <RegisterForm isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent 
              value="forgot" 
              className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out"
              forceMount={true}
            >
              <ForgotPasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default LoginTabs;
