
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ImagePopover from '../ImagePopover';

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

describe('ImagePopover Component', () => {
  const mockSetImageUrl = jest.fn();
  const mockSetImagePopoverOpen = jest.fn();
  const mockHandleImageUrlInsertion = jest.fn();
  const mockHandleImageUpload = jest.fn();
  const mockFileInputRef = { current: null } as React.RefObject<HTMLInputElement>;
  
  const defaultProps = {
    imageUrl: 'https://example.com/image.jpg',
    setImageUrl: mockSetImageUrl,
    imagePopoverOpen: true,
    setImagePopoverOpen: mockSetImagePopoverOpen,
    handleImageUrlInsertion: mockHandleImageUrlInsertion,
    handleImageUpload: mockHandleImageUpload,
    fileInputRef: mockFileInputRef
  };

  beforeEach(() => {
    mockSetImageUrl.mockClear();
    mockSetImagePopoverOpen.mockClear();
    mockHandleImageUrlInsertion.mockClear();
    mockHandleImageUpload.mockClear();
  });

  it('renders image popover correctly', () => {
    render(<ImagePopover {...defaultProps} />);
    
    expect(screen.getByTitle('Insert Image')).toBeInTheDocument();
    expect(screen.getByText('From URL')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('handles image URL change', () => {
    render(<ImagePopover {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('https://example.com/image.jpg');
    fireEvent.change(input, { target: { value: 'https://test.com/image.png' } });
    
    expect(mockSetImageUrl).toHaveBeenCalledWith('https://test.com/image.png');
  });

  it('calls handleImageUrlInsertion when Insert button is clicked', () => {
    render(<ImagePopover {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Insert'));
    expect(mockHandleImageUrlInsertion).toHaveBeenCalled();
  });

  it('calls handleImageUpload when file input changes', () => {
    render(<ImagePopover {...defaultProps} />);
    
    // Use standard query to find input by type and accept attribute
    const fileInput = screen.getByLabelText('Upload Image', { selector: 'input[type="file"]' });
    const file = new File(['dummy content'], 'image.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockHandleImageUpload).toHaveBeenCalled();
  });
});
