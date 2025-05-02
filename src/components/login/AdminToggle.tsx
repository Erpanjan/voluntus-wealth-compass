
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AdminToggleProps {
  isAdminMode: boolean;
  onToggle: (checked: boolean) => void;
  isAnimating?: boolean;
}

const AdminToggle: React.FC<AdminToggleProps> = ({ isAdminMode, onToggle, isAnimating = false }) => {
  return (
    <div className="flex items-center justify-center relative w-full">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold transition-all duration-300 min-w-[200px] text-center">
          {isAdminMode ? 'Admin Portal' : 'Client Portal'}
        </h1>
        <div className="flex items-center space-x-2">
          <Switch
            id="admin-mode"
            checked={isAdminMode}
            onCheckedChange={onToggle}
            className="transition-all duration-300"
          />
          <Label htmlFor="admin-mode" className="text-sm text-gray-600"></Label>
        </div>
      </div>
    </div>
  );
};

export default AdminToggle;
