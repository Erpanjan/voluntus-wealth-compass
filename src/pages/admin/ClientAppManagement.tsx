
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const ClientAppManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Client Applications</h2>
          <p className="text-muted-foreground">
            Manage client onboarding applications.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-gray-500">
              Client application management features are currently being redeveloped.
            </p>
            <p className="text-center text-gray-500 mt-2">
              Please check back later for updates.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClientAppManagement;
