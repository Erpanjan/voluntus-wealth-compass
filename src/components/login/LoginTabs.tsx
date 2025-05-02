
import React, { useEffect, useState } from 'react';
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
  // Track active tab for client mode
  const [clientActiveTab, setClientActiveTab] = useState<string>("login");
  
  // Reset to login tab whenever mode changes
  useEffect(() => {
    // Short delay to ensure the animation completes first
    const timer = setTimeout(() => {
      setClientActiveTab("login");
    }, 200);
    
    return () => clearTimeout(timer);
  }, [isAdminMode]);

  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 transform scale-[0.98]' : 'opacity-100 transform scale-100'}`}>
      {isAdminMode ? (
        // Admin mode - Single login tab with consistent height
        <Tabs defaultValue="login" className="w-full custom-tabs">
          <div className="px-6">
            <TabsList className="grid grid-cols-1 w-full bg-transparent p-0 h-12 relative">
              <TabsTrigger value="login" className="tab-button">Login</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="h-[650px] relative overflow-hidden">
            <TabsContent value="login" className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <LoginForm onDemoLogin={onDemoLogin} onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        // Client mode - All three tabs with the same fixed height
        <Tabs 
          value={clientActiveTab} 
          onValueChange={setClientActiveTab}
          className="w-full custom-tabs"
        >
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-12 relative">
              <TabsTrigger value="login" className="tab-button">Login</TabsTrigger>
              <TabsTrigger value="register" className="tab-button">Register</TabsTrigger>
              <TabsTrigger value="forgot" className="tab-button">Reset Password</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="h-[650px] relative overflow-hidden">
            <TabsContent value="login" className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <LoginForm onDemoLogin={onDemoLogin} onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent value="register" className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <RegisterForm isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent value="forgot" className="p-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <ForgotPasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default LoginTabs;
