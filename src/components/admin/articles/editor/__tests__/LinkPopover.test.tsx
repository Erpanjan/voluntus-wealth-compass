
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LinkPopover from '../LinkPopover';

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

describe('LinkPopover Component', () => {
  const mockSetLinkUrl = jest.fn();
  const mockSetLinkPopoverOpen = jest.fn();
  const mockHandleLinkInsertion = jest.fn();
  
  const defaultProps = {
    linkUrl: 'https://example.com',
    setLinkUrl: mockSetLinkUrl,
    linkPopoverOpen: true,
    setLinkPopoverOpen: mockSetLinkPopoverOpen,
    handleLinkInsertion: mockHandleLinkInsertion
  };

  beforeEach(() => {
    mockSetLinkUrl.mockClear();
    mockSetLinkPopoverOpen.mockClear();
    mockHandleLinkInsertion.mockClear();
  });

  it('renders link popover correctly', () => {
    render(<LinkPopover {...defaultProps} />);
    
    expect(screen.getByTitle('Insert Link')).toBeInTheDocument();
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('handles link URL change', () => {
    render(<LinkPopover {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(input, { target: { value: 'https://test.com' } });
    
    expect(mockSetLinkUrl).toHaveBeenCalledWith('https://test.com');
  });

  it('calls handleLinkInsertion when Insert button is clicked', () => {
    render(<LinkPopover {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Insert'));
    expect(mockHandleLinkInsertion).toHaveBeenCalled();
  });
});
