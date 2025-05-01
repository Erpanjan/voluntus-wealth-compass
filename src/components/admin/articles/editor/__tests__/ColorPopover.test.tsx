import React from 'react';
import { render, screen } from '@testing-library/react';
import { ColorPopover } from '../tools';

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

describe('ColorPopover Component', () => {
  const mockSetColorPopoverOpen = jest.fn();
  const mockHandleColorChange = jest.fn();
  
  const colorOptions = [
    { label: "Black", value: "#000000" },
    { label: "Red", value: "#FF0000" },
    { label: "Blue", value: "#0000FF" }
  ];
  
  const defaultProps = {
    colorPopoverOpen: true,
    setColorPopoverOpen: mockSetColorPopoverOpen,
    handleColorChange: mockHandleColorChange,
    colorOptions: colorOptions
  };

  beforeEach(() => {
    mockSetColorPopoverOpen.mockClear();
    mockHandleColorChange.mockClear();
  });

  it('renders color popover correctly', () => {
    render(<ColorPopover {...defaultProps} />);
    
    expect(screen.getByTitle('Text Color')).toBeInTheDocument();
    expect(screen.getByText('Text Color')).toBeInTheDocument();
  });

  it('renders color buttons for each color option', () => {
    render(<ColorPopover {...defaultProps} />);
    
    expect(screen.getByTitle('Black')).toBeInTheDocument();
    expect(screen.getByTitle('Red')).toBeInTheDocument();
    expect(screen.getByTitle('Blue')).toBeInTheDocument();
  });

  it('calls handleColorChange with the correct color value when a color button is clicked', () => {
    render(<ColorPopover {...defaultProps} />);
    
    fireEvent.click(screen.getByTitle('Red'));
    expect(mockHandleColorChange).toHaveBeenCalledWith('#FF0000');
  });
});
