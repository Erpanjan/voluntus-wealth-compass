
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import ForgotPasswordForm from '@/components/login/ForgotPasswordForm';

interface LoginTabsProps {
  isAdminMode: boolean;
  isAnimating: boolean;
  onRegularLogin: () => void;
}

const LoginTabs: React.FC<LoginTabsProps> = ({
  isAdminMode,
  isAnimating,
  onRegularLogin
}) => {
  // Control the active tab state
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Reset to login tab whenever isAdminMode changes
  useEffect(() => {
    setActiveTab("login");
  }, [isAdminMode]);
  
  return (
    <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 transform scale-[0.98]' : 'opacity-100 transform scale-100'}`}>
      {isAdminMode ? (
        // Admin mode - Single login tab with flexible height
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full custom-tabs">
          <div className="px-1 sm:px-2">
            <TabsList className="grid grid-cols-1 w-full bg-transparent p-0 h-10 sm:h-12 relative">
              <TabsTrigger value="login" className="tab-button text-sm sm:text-base">Login</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="min-h-[280px] sm:min-h-[320px] relative overflow-hidden">
            <TabsContent value="login" className="p-1 sm:p-2 pt-4 sm:pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <LoginForm onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        // Client mode - All three tabs with flexible height
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full custom-tabs">
          <div className="px-1 sm:px-2">
            <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-10 sm:h-12 relative">
              <TabsTrigger value="login" className="tab-button text-xs sm:text-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="tab-button text-xs sm:text-sm">Register</TabsTrigger>
              <TabsTrigger value="forgot" className="tab-button text-xs sm:text-sm">Reset</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="min-h-[400px] sm:min-h-[450px] relative overflow-hidden">
            <TabsContent value="login" className="p-1 sm:p-2 pt-4 sm:pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <LoginForm onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent value="register" className="p-1 sm:p-2 pt-4 sm:pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <RegisterForm isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent value="forgot" className="p-1 sm:p-2 pt-4 sm:pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <ForgotPasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default LoginTabs;
