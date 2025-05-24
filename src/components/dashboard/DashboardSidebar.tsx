
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onLogout
}) => {
  return (
    <div className="w-64 bg-[#F9F9F9] border-l min-h-screen flex flex-col">
      <div className="p-6 border-b">
        
      </div>
      
      {/* Navigation Menu */}
      <div className="flex-1 py-8">
        <nav className="space-y-6 px-6">
          <button 
            onClick={() => setActiveTab('advisor')}
            className={`w-full text-left transition-all text-xs ${
              activeTab === 'advisor' 
                ? 'font-medium text-[#333333] tracking-wide' 
                : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
            }`}
          >
            ADVISOR INTERFACE
          </button>
          
          <button 
            onClick={() => setActiveTab('policy')}
            className={`w-full text-left transition-all text-xs ${
              activeTab === 'policy' 
                ? 'font-medium text-[#333333] tracking-wide' 
                : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
            }`}
          >
            POLICY REVIEW
          </button>
          
          <button 
            onClick={() => setActiveTab('account')}
            className={`w-full text-left transition-all text-xs ${
              activeTab === 'account' 
                ? 'font-medium text-[#333333] tracking-wide' 
                : 'font-normal text-[#9F9EA1] hover:text-[#333333] tracking-wide'
            }`}
          >
            ACCOUNT MANAGEMENT
          </button>
        </nav>
      </div>
      
      {/* Footer/Logout Section */}
      <div className="p-6 border-t">
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-[#9F9EA1] hover:text-[#333333]"
        >
          <LogOut size={16} />
          Logout
        </Button>
        
        {user && (
          <p className="text-xs text-center text-gray-500 mt-4">
            Logged in as: {user.email}
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardSidebar;
