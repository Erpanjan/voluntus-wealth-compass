
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RichTextEditor from '../RichTextEditor';
import * as imageUtils from '@/utils/imageUtils';

// Mock EditorToolbar component
jest.mock('../editor/EditorToolbar', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="editor-toolbar">
      <button data-testid="mock-apply-format" onClick={() => props.applyFormat('bold')}>Apply Bold</button>
      <button data-testid="mock-link-insertion" onClick={props.handleLinkInsertion}>Insert Link</button>
      <button data-testid="mock-image-insertion" onClick={props.handleImageUrlInsertion}>Insert Image</button>
    </div>
  )
}));

// Mock toast hook
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}));

// Mock imageUtils
jest.mock('@/utils/imageUtils', () => ({
  insertImageIntoEditor: jest.fn()
}));

describe('RichTextEditor Component', () => {
  const mockOnChange = jest.fn();
  const mockValue = '<p>Test content</p>';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders editor with initial content', () => {
    render(<RichTextEditor value={mockValue} onChange={mockOnChange} />);
    
    expect(screen.getByTestId('editor-toolbar')).toBeInTheDocument();
    
    const editorContent = screen.getByRole('textbox', { hidden: true });
    expect(editorContent).toBeInTheDocument();
    expect(editorContent.innerHTML).toBe(mockValue);
  });

  it('calls onChange when content is edited', () => {
    render(<RichTextEditor value={mockValue} onChange={mockOnChange} />);
    
    const editorContent = screen.getByRole('textbox', { hidden: true });
    fireEvent.input(editorContent, {
      target: { innerHTML: '<p>Updated content</p>' }
    });
    
    expect(mockOnChange).toHaveBeenCalledWith('<p>Updated content</p>');
  });

  it('applies formatting when toolbar actions are used', () => {
    // Mock document.execCommand
    const originalExecCommand = document.execCommand;
    document.execCommand = jest.fn();
    
    render(<RichTextEditor value={mockValue} onChange={mockOnChange} />);
    
    const applyFormatButton = screen.getByTestId('mock-apply-format');
    fireEvent.click(applyFormatButton);
    
    expect(document.execCommand).toHaveBeenCalledWith('bold', false, undefined);
    
    // Restore original execCommand
    document.execCommand = originalExecCommand;
  });

  it('inserts image when image URL is provided', () => {
    render(<RichTextEditor value={mockValue} onChange={mockOnChange} />);
    
    // Trigger the image insertion function
    const insertImageButton = screen.getByTestId('mock-image-insertion');
    fireEvent.click(insertImageButton);
    
    expect(imageUtils.insertImageIntoEditor).toHaveBeenCalled();
  });
});
