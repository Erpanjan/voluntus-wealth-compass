
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AdminToggleProps {
  isAdminMode: boolean;
  onToggle: (checked: boolean) => void;
  isDisabled?: boolean;
}

const AdminToggle: React.FC<AdminToggleProps> = ({ 
  isAdminMode, 
  onToggle,
  isDisabled = false 
}) => {
  return (
    <div className="flex items-center justify-center relative w-full h-full">
      <div className="flex items-center space-x-4">
        <div className="text-center w-[200px]">
          <h1 className="text-3xl font-bold">
            {isAdminMode ? 'Admin Portal' : 'Client Portal'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="admin-mode"
            checked={isAdminMode}
            onCheckedChange={onToggle}
            className={isDisabled ? 'opacity-70 cursor-not-allowed' : ''}
            disabled={isDisabled}
          />
          <Label htmlFor="admin-mode" className="text-sm text-gray-600"></Label>
        </div>
      </div>
    </div>
  );
};

export default AdminToggle;
