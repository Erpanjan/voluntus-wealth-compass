
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ListControls from '../ListControls';

describe('ListControls Component', () => {
  const mockApplyFormat = jest.fn();

  beforeEach(() => {
    mockApplyFormat.mockClear();
  });

  it('renders list controls correctly', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);
    
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument();
    expect(screen.getByTitle('Numbered List')).toBeInTheDocument();
  });

  it('calls applyFormat with the correct command when buttons are clicked', () => {
    render(<ListControls applyFormat={mockApplyFormat} />);
    
    fireEvent.click(screen.getByTitle('Bullet List'));
    expect(mockApplyFormat).toHaveBeenCalledWith('insertUnorderedList');
    
    fireEvent.click(screen.getByTitle('Numbered List'));
    expect(mockApplyFormat).toHaveBeenCalledWith('insertOrderedList');
  });
});
