import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlignmentControls } from '../tools';

describe('AlignmentControls Component', () => {
  const applyFormat = jest.fn();

  it('renders alignment buttons', () => {
    render(<AlignmentControls applyFormat={applyFormat} />);
    
    const alignLeftButton = screen.getByTitle('Align Left');
    const alignCenterButton = screen.getByTitle('Align Center');
    const alignRightButton = screen.getByTitle('Align Right');

    expect(alignLeftButton).toBeInTheDocument();
    expect(alignCenterButton).toBeInTheDocument();
    expect(alignRightButton).toBeInTheDocument();
  });

  it('calls applyFormat with correct command when alignment buttons are clicked', () => {
    render(<AlignmentControls applyFormat={applyFormat} />);
    
    const alignLeftButton = screen.getByTitle('Align Left');
    const alignCenterButton = screen.getByTitle('Align Center');
    const alignRightButton = screen.getByTitle('Align Right');

    alignLeftButton.click();
    expect(applyFormat).toHaveBeenCalledWith('justifyLeft');

    alignCenterButton.click();
    expect(applyFormat).toHaveBeenCalledWith('justifyCenter');

    alignRightButton.click();
    expect(applyFormat).toHaveBeenCalledWith('justifyRight');
  });
});
