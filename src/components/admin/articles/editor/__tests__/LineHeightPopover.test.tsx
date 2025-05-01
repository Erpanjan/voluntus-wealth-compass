import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LineHeightPopover } from '../tools';
import { lineHeightOptions } from '../constants/editorConstants';

// Mock Popover and ToggleGroup components
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-trigger">{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
}));

jest.mock('@/components/ui/toggle-group', () => ({
  ToggleGroup: ({ children, type, variant, className }: { children: React.ReactNode, type: string, variant: string, className: string }) => (
    <div data-testid="toggle-group" data-type={type} data-variant={variant} className={className}>{children}</div>
  ),
  ToggleGroupItem: ({ children, value, onClick, className }: { children: React.ReactNode, value: string, onClick: () => void, className: string }) => (
    <button data-testid="toggle-group-item" data-value={value} onClick={onClick} className={className}>{children}</button>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, className, title }: { children: React.ReactNode, variant: string, size: string, className: string, title: string }) => (
    <button data-testid="button" data-variant={variant} data-size={size} className={className} title={title}>{children}</button>
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children }: { children: React.ReactNode }) => <label data-testid="label">{children}</label>,
}));

describe('LineHeightPopover Component', () => {
  const mockProps = {
    lineHeightPopoverOpen: false,
    setLineHeightPopoverOpen: jest.fn(),
    handleLineHeightChange: jest.fn(),
    lineHeights: lineHeightOptions,
  };

  it('renders the component correctly', () => {
    render(<LineHeightPopover {...mockProps} />);
    
    expect(screen.getByTestId('popover')).toBeInTheDocument();
    expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
  });

  it('renders the trigger button with the correct title', () => {
    render(<LineHeightPopover {...mockProps} />);
    
    const button = screen.getByTestId('button');
    expect(button).toHaveAttribute('title', 'Line Height');
  });

  it('renders the popover content when open', () => {
    render(<LineHeightPopover {...mockProps} lineHeightPopoverOpen={true} />);
    
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    expect(screen.getByTestId('label')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-group')).toBeInTheDocument();
  });

  it('calls handleLineHeightChange when a line height option is clicked', () => {
    render(<LineHeightPopover {...mockProps} lineHeightPopoverOpen={true} />);
    
    const toggleGroupItems = screen.getAllByTestId('toggle-group-item');
    fireEvent.click(toggleGroupItems[0]);
    
    expect(mockProps.handleLineHeightChange).toHaveBeenCalled();
  });

  it('passes the correct value to handleLineHeightChange when a line height option is clicked', () => {
    render(<LineHeightPopover {...mockProps} lineHeightPopoverOpen={true} />);
    
    const toggleGroupItems = screen.getAllByTestId('toggle-group-item');
    const firstItem = toggleGroupItems[0];
    const value = firstItem.getAttribute('data-value');
    
    fireEvent.click(firstItem);
    
    expect(mockProps.handleLineHeightChange).toHaveBeenCalledWith(value);
  });
});
