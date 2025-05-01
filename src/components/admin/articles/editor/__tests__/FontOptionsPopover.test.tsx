
import React from 'react';
import { render, screen } from '@testing-library/react';
import FontControls from '../tools/FontControls';

// We'll mock the Select component since we're not testing its internal functionality
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="select" onClick={() => onValueChange('test-value')}>{children}</div>
  ),
  SelectTrigger: ({ children, className }: any) => (
    <div data-testid="select-trigger" className={className}>{children}</div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <div data-testid="select-value">{placeholder}</div>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid="select-item" data-value={value}>{children}</div>
  )
}));

describe('FontControls', () => {
  const mockHandleFontFamilyChange = jest.fn();
  const mockHandleFontSizeChange = jest.fn();
  
  it('renders Select components properly', () => {
    render(
      <FontControls 
        handleFontFamilyChange={mockHandleFontFamilyChange}
        handleFontSizeChange={mockHandleFontSizeChange}
      />
    );
    
    // Verify font family select exists
    const selectValues = screen.getAllByTestId('select-value');
    expect(selectValues[0]).toHaveTextContent('Font Family');
    
    // Verify font size select exists
    expect(selectValues[1]).toHaveTextContent('Font Size');
  });
});
