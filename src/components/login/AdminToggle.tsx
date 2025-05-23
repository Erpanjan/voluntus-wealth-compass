
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
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
      <div className="text-center flex-shrink-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold transition-all duration-300 leading-tight">
          {isAdminMode ? 'Admin Portal' : 'Client Portal'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="admin-mode"
          checked={isAdminMode}
          onCheckedChange={onToggle}
          className="transition-all duration-300"
        />
        <Label htmlFor="admin-mode" className="text-sm text-gray-600 sr-only">
          Toggle admin mode
        </Label>
      </div>
    </div>
  );
};

export default AdminToggle;
