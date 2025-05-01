import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextFormattingTools } from '../tools';

describe('TextFormattingTools Component', () => {
  const mockApplyFormat = jest.fn();

  beforeEach(() => {
    mockApplyFormat.mockClear();
  });

  it('renders formatting buttons correctly', () => {
    render(<TextFormattingTools applyFormat={mockApplyFormat} />);
    
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
    expect(screen.getByTitle('Underline')).toBeInTheDocument();
  });

  it('calls applyFormat with the correct command when buttons are clicked', () => {
    render(<TextFormattingTools applyFormat={mockApplyFormat} />);
    
    fireEvent.click(screen.getByTitle('Bold'));
    expect(mockApplyFormat).toHaveBeenCalledWith('bold');
    
    fireEvent.click(screen.getByTitle('Italic'));
    expect(mockApplyFormat).toHaveBeenCalledWith('italic');
    
    fireEvent.click(screen.getByTitle('Underline'));
    expect(mockApplyFormat).toHaveBeenCalledWith('underline');
  });
});
