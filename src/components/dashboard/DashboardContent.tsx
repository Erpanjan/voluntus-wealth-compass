
import React from 'react';
import AdvisorChat from './AdvisorChat';
import PolicyReview from './PolicyReview';
import AccountManagement from './AccountManagement';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  return (
    <div className="flex-1 p-6">
      <div className="container mx-auto max-w-6xl">
        {activeTab === 'advisor' && <AdvisorChat />}
        {activeTab === 'policy' && <PolicyReview />}
        {activeTab === 'account' && <AccountManagement />}
      </div>
    </div>
  );
};

export default DashboardContent;
