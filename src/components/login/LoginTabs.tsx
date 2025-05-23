
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
        // Admin mode - Single login tab with modal-optimized height
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full custom-tabs">
          <div className="px-2">
            <TabsList className="grid grid-cols-1 w-full bg-transparent p-0 h-12 relative">
              <TabsTrigger value="login" className="tab-button">Login</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="h-[400px] relative overflow-hidden">
            <TabsContent value="login" className="p-2 pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <LoginForm onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        // Client mode - All three tabs with modal-optimized height
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full custom-tabs">
          <div className="px-2">
            <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-12 relative">
              <TabsTrigger value="login" className="tab-button text-sm">Login</TabsTrigger>
              <TabsTrigger value="register" className="tab-button text-sm">Register</TabsTrigger>
              <TabsTrigger value="forgot" className="tab-button text-sm">Reset</TabsTrigger>
              <div className="tab-indicator"></div>
            </TabsList>
          </div>

          <div className="h-[400px] relative overflow-hidden">
            <TabsContent value="login" className="p-2 pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <LoginForm onRegularLogin={onRegularLogin} isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent value="register" className="p-2 pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <RegisterForm isAdminMode={isAdminMode} />
            </TabsContent>

            <TabsContent value="forgot" className="p-2 pt-6 absolute w-full top-0 left-0 transition-all duration-300 ease-in-out">
              <ForgotPasswordForm />
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default LoginTabs;
