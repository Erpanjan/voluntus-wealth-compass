
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
        <div className={`relative h-12 perspective-1000 transition-all duration-300 ease-out ${isAnimating ? 'opacity-70' : 'opacity-100'}`}>
          <div className={`text-3xl font-bold absolute transition-all duration-700 transform-style-3d w-full text-center 
            ${isAdminMode ? 'rotate-y-180 backface-hidden invisible' : 'rotate-y-0 visible'}`}>
            Client Portal
          </div>
          <div className={`text-3xl font-bold absolute transition-all duration-700 transform-style-3d w-full text-center 
            ${isAdminMode ? 'rotate-y-0 visible' : 'rotate-y-180 backface-hidden invisible'}`}>
            Admin Portal
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="admin-mode"
            checked={isAdminMode}
            onCheckedChange={onToggle}
            className="transition-all duration-400 ease-out"
          />
          <Label htmlFor="admin-mode" className="text-sm text-gray-600"></Label>
        </div>
      </div>
    </div>
  );
};

export default AdminToggle;
