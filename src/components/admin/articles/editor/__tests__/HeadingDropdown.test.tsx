
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeadingDropdown } from '../tools';

// Mock DropdownMenu components
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <button data-testid="dropdown-trigger">{children}</button>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <button data-testid="dropdown-item" onClick={onClick}>{children}</button>
  ),
}));

describe('HeadingDropdown Component', () => {
  const mockApplyFormat = jest.fn();

  beforeEach(() => {
    mockApplyFormat.mockClear();
  });

  it('renders heading dropdown correctly', () => {
    render(<HeadingDropdown applyFormat={mockApplyFormat} />);
    
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
    expect(screen.getByText('Heading')).toBeInTheDocument();
  });

  it('applies heading formats when items are clicked', () => {
    render(<HeadingDropdown applyFormat={mockApplyFormat} />);
    
    const items = screen.getAllByTestId('dropdown-item');
    fireEvent.click(items[0]); // Click Heading 1
    expect(mockApplyFormat).toHaveBeenCalledWith('formatBlock', 'h1');
    
    fireEvent.click(items[1]); // Click Heading 2
    expect(mockApplyFormat).toHaveBeenCalledWith('formatBlock', 'h2');
  });
});
