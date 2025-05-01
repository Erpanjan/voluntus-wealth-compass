
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LineHeightPopover from '../LineHeightPopover';

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

// Mock ToggleGroup components
jest.mock('@/components/ui/toggle-group', () => ({
  ToggleGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="toggle-group">{children}</div>,
  ToggleGroupItem: ({ children, value, onClick }: { children: React.ReactNode, value: string, onClick: () => void }) => (
    <button data-testid="toggle-item" data-value={value} onClick={onClick}>{children}</button>
  ),
}));

describe('LineHeightPopover Component', () => {
  const mockSetLineHeightPopoverOpen = jest.fn();
  const mockHandleLineHeightChange = jest.fn();
  
  const lineHeights = [
    { label: "Tight", value: "1.2" },
    { label: "Normal", value: "1.5" },
    { label: "Relaxed", value: "1.8" }
  ];
  
  const defaultProps = {
    lineHeightPopoverOpen: true,
    setLineHeightPopoverOpen: mockSetLineHeightPopoverOpen,
    handleLineHeightChange: mockHandleLineHeightChange,
    lineHeights: lineHeights
  };

  beforeEach(() => {
    mockSetLineHeightPopoverOpen.mockClear();
    mockHandleLineHeightChange.mockClear();
  });

  it('renders line height popover correctly', () => {
    render(<LineHeightPopover {...defaultProps} />);
    
    expect(screen.getByTitle('Line Height')).toBeInTheDocument();
    expect(screen.getByText('Line Spacing')).toBeInTheDocument();
  });

  it('renders toggle items for each line height option', () => {
    render(<LineHeightPopover {...defaultProps} />);
    
    expect(screen.getByText('Tight')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('Relaxed')).toBeInTheDocument();
  });

  it('calls handleLineHeightChange with the correct height value when a toggle item is clicked', () => {
    render(<LineHeightPopover {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Normal'));
    expect(mockHandleLineHeightChange).toHaveBeenCalledWith('1.5');
  });
});
