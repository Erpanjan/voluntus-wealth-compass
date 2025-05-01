import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkPopover } from '../tools';

// Mock Popover and related components
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) => (
    <div>
      <div data-testid="popover-trigger" onClick={() => onOpenChange(!open)}>Trigger</div>
      {open && <div data-testid="popover-content">{children}</div>}
    </div>
  ),
  PopoverTrigger: ({ asChild, children }: { asChild: boolean, children: React.ReactNode }) => (
    asChild ? <div>{children}</div> : <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ className, children }: { className: string, children: React.ReactNode }) => (
    <div data-testid="popover-content" className={className}>{children}</div>
  ),
}));

// Mock Input and Button
jest.mock('@/components/ui/input', () => ({
  Input: ({ type, placeholder, value, onChange }: { type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <input
      data-testid="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ size, onClick, children }: { size: string, onClick: () => void, children: React.ReactNode }) => (
    <button data-testid="button" onClick={onClick} data-size={size}>{children}</button>
  ),
}));

describe('LinkPopover Component', () => {
  const mockSetLinkUrl = jest.fn();
  const mockSetLinkPopoverOpen = jest.fn();
  const mockHandleLinkInsertion = jest.fn();

  const renderComponent = (open: boolean = false) => {
    render(
      <LinkPopover
        linkUrl="https://example.com"
        setLinkUrl={mockSetLinkUrl}
        linkPopoverOpen={open}
        setLinkPopoverOpen={mockSetLinkPopoverOpen}
        handleLinkInsertion={mockHandleLinkInsertion}
      />
    );
  };

  it('renders the component with the trigger button', () => {
    renderComponent();
    expect(screen.getByTestId('popover-trigger')).toBeInTheDocument();
  });

  it('opens the popover content when the trigger is clicked', () => {
    renderComponent();
    const trigger = screen.getByTestId('popover-trigger');
    fireEvent.click(trigger);
  });

  it('renders the input and insert button inside the popover content', () => {
    renderComponent(true);
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('calls setLinkUrl when the input value changes', () => {
    renderComponent(true);
    const input = screen.getByTestId('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://new-example.com' } });
    expect(mockSetLinkUrl).toHaveBeenCalled();
  });

  it('calls handleLinkInsertion when the insert button is clicked', () => {
    renderComponent(true);
    const insertButton = screen.getByTestId('button');
    fireEvent.click(insertButton);
    expect(mockHandleLinkInsertion).toHaveBeenCalled();
  });
});
