
import React, { useState, useMemo } from 'react';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';
import DashboardLoading from './DashboardLoading';

const OptimizedDashboardLayout: React.FC = () => {
  const { user, session, loading, logout } = useOptimizedAuth();
  const [activeTab, setActiveTab] = useState('advisor');

  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user?.id, user?.email]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex">
      <DashboardContent activeTab={activeTab} />
      <DashboardSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={memoizedUser}
        onLogout={logout}
      />
    </div>
  );
};

export default React.memo(OptimizedDashboardLayout);
