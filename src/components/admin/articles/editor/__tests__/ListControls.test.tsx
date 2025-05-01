
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListControls } from '../tools';

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ onClick, children, className, variant, size, title, type }: { 
    onClick: (e: any) => void, 
    children: React.ReactNode, 
    className: string, 
    variant: string, 
    size: string, 
    title: string, 
    type: "button" | "submit" | "reset" 
  }) => (
    <button 
      data-testid="button" 
      onClick={onClick} 
      className={className} 
      data-variant={variant} 
      data-size={size} 
      title={title} 
      type={type}
    >
      {children}
    </button>
  ),
}));

describe('ListControls Component', () => {
  const mockApplyFormat = jest.fn();

  beforeEach(() => {
    mockApplyFormat.mockClear();
  });

  it('renders the ListControls component with buttons', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const bulletListButton = screen.getByTitle('Bullet List');
    const numberedListButton = screen.getByTitle('Numbered List');
    const increaseIndentButton = screen.getByTitle('Increase Indent');
    const decreaseIndentButton = screen.getByTitle('Decrease Indent');

    expect(bulletListButton).toBeInTheDocument();
    expect(numberedListButton).toBeInTheDocument();
    expect(increaseIndentButton).toBeInTheDocument();
    expect(decreaseIndentButton).toBeInTheDocument();
  });

  it('calls applyFormat with "insertUnorderedList" when Bullet List button is clicked', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const bulletListButton = screen.getByTitle('Bullet List');
    fireEvent.click(bulletListButton);

    expect(mockApplyFormat).toHaveBeenCalledWith('insertUnorderedList');
  });

  it('calls applyFormat with "insertOrderedList" when Numbered List button is clicked', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const numberedListButton = screen.getByTitle('Numbered List');
    fireEvent.click(numberedListButton);

    expect(mockApplyFormat).toHaveBeenCalledWith('insertOrderedList');
  });

  it('calls applyFormat with "indent" when Increase Indent button is clicked', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const increaseIndentButton = screen.getByTitle('Increase Indent');
    fireEvent.click(increaseIndentButton);

    expect(mockApplyFormat).toHaveBeenCalledWith('indent');
  });

  it('calls applyFormat with "outdent" when Decrease Indent button is clicked', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const decreaseIndentButton = screen.getByTitle('Decrease Indent');
    fireEvent.click(decreaseIndentButton);

    expect(mockApplyFormat).toHaveBeenCalledWith('outdent');
  });
});
