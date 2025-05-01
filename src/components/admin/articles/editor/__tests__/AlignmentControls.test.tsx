
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlignmentControls from '../AlignmentControls';

describe('AlignmentControls Component', () => {
  const mockApplyFormat = jest.fn();

  beforeEach(() => {
    mockApplyFormat.mockClear();
  });

  it('renders alignment controls correctly', () => {
    render(<AlignmentControls applyFormat={mockApplyFormat} />);
    
    expect(screen.getByTitle('Align Left')).toBeInTheDocument();
    expect(screen.getByTitle('Align Center')).toBeInTheDocument();
    expect(screen.getByTitle('Align Right')).toBeInTheDocument();
  });

  it('calls applyFormat with the correct command when buttons are clicked', () => {
    render(<AlignmentControls applyFormat={mockApplyFormat} />);
    
    fireEvent.click(screen.getByTitle('Align Left'));
    expect(mockApplyFormat).toHaveBeenCalledWith('justifyLeft');
    
    fireEvent.click(screen.getByTitle('Align Center'));
    expect(mockApplyFormat).toHaveBeenCalledWith('justifyCenter');
    
    fireEvent.click(screen.getByTitle('Align Right'));
    expect(mockApplyFormat).toHaveBeenCalledWith('justifyRight');
  });
});
