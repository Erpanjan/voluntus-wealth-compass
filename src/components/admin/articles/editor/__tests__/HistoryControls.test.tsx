import React from 'react';
import { render, screen } from '@testing-library/react';
import { HistoryControls } from '../tools';

describe('HistoryControls Component', () => {
  const mockApplyFormat = jest.fn();

  beforeEach(() => {
    mockApplyFormat.mockClear();
  });

  it('renders history controls correctly', () => {
    render(<HistoryControls applyFormat={mockApplyFormat} />);
    
    expect(screen.getByTitle('Undo')).toBeInTheDocument();
    expect(screen.getByTitle('Redo')).toBeInTheDocument();
  });

  it('calls applyFormat with the correct command when buttons are clicked', () => {
    render(<HistoryControls applyFormat={mockApplyFormat} />);
    
    fireEvent.click(screen.getByTitle('Undo'));
    expect(mockApplyFormat).toHaveBeenCalledWith('undo');
    
    fireEvent.click(screen.getByTitle('Redo'));
    expect(mockApplyFormat).toHaveBeenCalledWith('redo');
  });
});
