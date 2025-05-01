
import React from 'react';
import { render, screen } from '@testing-library/react';
import EditorToolbar from '../EditorToolbar';

// Mock child components
jest.mock('../tools/TextFormattingTools', () => () => <div data-testid="text-formatting-tools">TextFormattingTools</div>);
jest.mock('../tools/FontControls', () => () => <div data-testid="font-controls">FontControls</div>);
jest.mock('../tools/ColorPopover', () => () => <div data-testid="color-popover">ColorPopover</div>);
jest.mock('../tools/LineHeightPopover', () => () => <div data-testid="line-height-popover">LineHeightPopover</div>);
jest.mock('../tools/HeadingDropdown', () => () => <div data-testid="heading-dropdown">HeadingDropdown</div>);
jest.mock('../tools/ListControls', () => () => <div data-testid="list-controls">ListControls</div>);
jest.mock('../tools/AlignmentControls', () => () => <div data-testid="alignment-controls">AlignmentControls</div>);
jest.mock('../tools/LinkPopover', () => () => <div data-testid="link-popover">LinkPopover</div>);
jest.mock('../tools/ImagePopover', () => () => <div data-testid="image-popover">ImagePopover</div>);
jest.mock('../tools/HistoryControls', () => () => <div data-testid="history-controls">HistoryControls</div>);
jest.mock('../constants/editorConstants', () => ({
  colorOptions: [{ label: 'Black', value: '#000000' }]
}));

// Mock Separator and ScrollArea
jest.mock('@/components/ui/separator', () => ({
  Separator: ({ orientation, className }: { orientation: string, className: string }) => (
    <div data-testid="separator" data-orientation={orientation} className={className}></div>
  )
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div data-testid="scroll-area" className={className}>{children}</div>
  )
}));

describe('EditorToolbar Component', () => {
  const mockProps = {
    applyFormat: jest.fn(),
    linkUrl: 'https://example.com',
    setLinkUrl: jest.fn(),
    linkPopoverOpen: false,
    setLinkPopoverOpen: jest.fn(),
    handleLinkInsertion: jest.fn(),
    imageUrl: 'https://example.com/image.jpg',
    setImageUrl: jest.fn(),
    imagePopoverOpen: false,
    setImagePopoverOpen: jest.fn(),
    handleImageUrlInsertion: jest.fn(),
    handleImageUpload: jest.fn(),
    fileInputRef: { current: null } as React.RefObject<HTMLInputElement>,
    fontOptionsOpen: false,
    setFontOptionsOpen: jest.fn(),
    colorPopoverOpen: false,
    setColorPopoverOpen: jest.fn(),
    lineHeightPopoverOpen: false,
    setLineHeightPopoverOpen: jest.fn(),
    handleFontFamilyChange: jest.fn(),
    handleFontSizeChange: jest.fn(),
    handleColorChange: jest.fn(),
    handleLineHeightChange: jest.fn()
  };

  it('renders all toolbar components correctly', () => {
    render(<EditorToolbar {...mockProps} />);
    
    expect(screen.getByTestId('scroll-area')).toBeInTheDocument();
    expect(screen.getByTestId('text-formatting-tools')).toBeInTheDocument();
    expect(screen.getByTestId('font-controls')).toBeInTheDocument();
    expect(screen.getByTestId('color-popover')).toBeInTheDocument();
    expect(screen.getByTestId('line-height-popover')).toBeInTheDocument();
    expect(screen.getByTestId('heading-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('list-controls')).toBeInTheDocument();
    expect(screen.getByTestId('alignment-controls')).toBeInTheDocument();
    expect(screen.getByTestId('link-popover')).toBeInTheDocument();
    expect(screen.getByTestId('image-popover')).toBeInTheDocument();
    expect(screen.getByTestId('history-controls')).toBeInTheDocument();
  });

  it('renders separators between tool groups', () => {
    render(<EditorToolbar {...mockProps} />);
    
    const separators = screen.getAllByTestId('separator');
    expect(separators.length).toBe(5); // Expecting 5 separators in the toolbar
    
    separators.forEach(separator => {
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });
  });
});
