
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Since we removed FontOptionsPopover, this test should focus on the new font controls
describe('Font Controls', () => {
  const mockHandleFontFamilyChange = jest.fn();
  const mockHandleFontSizeChange = jest.fn();
  
  it('renders Select components properly', () => {
    render(
      <Select onValueChange={mockHandleFontFamilyChange}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue placeholder="Font Family" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inherit">Default</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(screen.getByText('Font Family')).toBeInTheDocument();
  });
});
