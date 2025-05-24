
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import DashboardLoading from './DashboardLoading';
import { useDashboardAuth } from '@/hooks/dashboard/useDashboardAuth';

const DashboardLayout: React.FC = () => {
  const { user, loading, authorized, handleLogout } = useDashboardAuth();
  const [activeTab, setActiveTab] = useState('advisor');

  // Show optimized loading state with smoother animation
  if (loading) {
    return <DashboardLoading />;
  }

  // Don't render anything while redirecting
  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex">
      <DashboardContent activeTab={activeTab} />
      <DashboardSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default DashboardLayout;
