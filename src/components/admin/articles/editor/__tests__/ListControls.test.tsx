import React from 'react';
import { render, screen } from '@testing-library/react';
import { ListControls } from '../tools';

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ onClick, children, className, variant, size, title }: { onClick: () => void, children: React.ReactNode, className: string, variant: string, size: string, title: string }) => (
    <button data-testid="button" onClick={onClick} className={className} data-variant={variant} data-size={size} title={title}>{children}</button>
  ),
}));

describe('ListControls Component', () => {
  const mockApplyFormat = jest.fn();

  it('renders the ListControls component with buttons', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const bulletListButton = screen.getByTitle('Bullet List');
    const numberedListButton = screen.getByTitle('Numbered List');

    expect(bulletListButton).toBeInTheDocument();
    expect(numberedListButton).toBeInTheDocument();
  });

  it('calls applyFormat with "insertUnorderedList" when Bullet List button is clicked', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const bulletListButton = screen.getByTitle('Bullet List');
    bulletListButton.click();

    expect(mockApplyFormat).toHaveBeenCalledWith('insertUnorderedList');
  });

  it('calls applyFormat with "insertOrderedList" when Numbered List button is clicked', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);

    const numberedListButton = screen.getByTitle('Numbered List');
    numberedListButton.click();

    expect(mockApplyFormat).toHaveBeenCalledWith('insertOrderedList');
  });
});

