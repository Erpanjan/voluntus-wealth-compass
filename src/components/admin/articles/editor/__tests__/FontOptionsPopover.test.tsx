
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FontOptionsPopover from '../FontOptionsPopover';

// Mock Popover components
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, open, onOpenChange }: { children: React.ReactNode, open: boolean, onOpenChange: (open: boolean) => void }) => (
    <div data-testid="popover" data-open={open} onClick={() => onOpenChange(!open)}>{children}</div>
  ),
  PopoverTrigger: ({ children, asChild }: { children: React.ReactNode, asChild: boolean }) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div data-testid="popover-content" className={className}>{children}</div>
  ),
}));

// Mock Select components
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange }: { children: React.ReactNode, onValueChange: (value: string) => void }) => (
    <div data-testid="select" onChange={(e: any) => onValueChange(e.target.value)}>{children}</div>
  ),
  SelectTrigger: ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div data-testid="select-trigger" className={className}>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => <div data-testid="select-value">{placeholder}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div data-testid="select-content">{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode, value: string }) => (
    <button data-testid="select-item" data-value={value}>{children}</button>
  ),
}));

describe('FontOptionsPopover Component', () => {
  const mockSetFontOptionsOpen = jest.fn();
  const mockHandleFontFamilyChange = jest.fn();
  const mockHandleFontSizeChange = jest.fn();
  
  const fontFamilies = [
    { label: "Default", value: "inherit" },
    { label: "Poppins", value: "'Poppins', sans-serif" }
  ];
  
  const fontSizes = [
    { label: "Normal", value: "16px" },
    { label: "Large", value: "24px" }
  ];
  
  const defaultProps = {
    fontOptionsOpen: true,
    setFontOptionsOpen: mockSetFontOptionsOpen,
    handleFontFamilyChange: mockHandleFontFamilyChange,
    handleFontSizeChange: mockHandleFontSizeChange,
    fontFamilies: fontFamilies,
    fontSizes: fontSizes
  };

  beforeEach(() => {
    mockSetFontOptionsOpen.mockClear();
    mockHandleFontFamilyChange.mockClear();
    mockHandleFontSizeChange.mockClear();
  });

  it('renders font options popover correctly', () => {
    render(<FontOptionsPopover {...defaultProps} />);
    
    expect(screen.getByText('Font')).toBeInTheDocument();
    expect(screen.getByText('Font Family')).toBeInTheDocument();
    expect(screen.getByText('Font Size')).toBeInTheDocument();
  });

  it('renders select items for font families', () => {
    render(<FontOptionsPopover {...defaultProps} />);
    
    const items = screen.getAllByTestId('select-item');
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Poppins')).toBeInTheDocument();
  });

  it('renders select items for font sizes', () => {
    render(<FontOptionsPopover {...defaultProps} />);
    
    const items = screen.getAllByTestId('select-item');
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });
});
