
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Mock contentEditable behavior for testing
Object.defineProperty(HTMLElement.prototype, 'contentEditable', {
  configurable: true,
  get: function() { return this.getAttribute('contentEditable'); },
  set: function(value) { this.setAttribute('contentEditable', value); }
});

// Mock execCommand method for tests
document.execCommand = jest.fn();

// Setup Testing Library configuration
configure({
  getElementError: (message, container) => {
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    return error;
  },
});

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Custom file input queries - for reference but not used directly
// These are here to document the approach but we'll use standard queries instead
const queryByAcceptAttribute = (container: HTMLElement, accept: string) => {
  return Array.from(container.querySelectorAll('input[type="file"]')).find(
    input => input.getAttribute('accept') === accept
  ) as HTMLInputElement | null;
};

const queryAllByAcceptAttribute = (container: HTMLElement, accept: string) => {
  return Array.from(container.querySelectorAll('input[type="file"]')).filter(
    input => input.getAttribute('accept') === accept
  ) as HTMLInputElement[];
};

const getByAcceptAttribute = (container: HTMLElement, accept: string) => {
  const element = queryByAcceptAttribute(container, accept);
  if (!element) {
    throw new Error(`Unable to find an element with accept="${accept}"`);
  }
  return element;
};

const getAllByAcceptAttribute = (container: HTMLElement, accept: string) => {
  const elements = queryAllByAcceptAttribute(container, accept);
  if (!elements.length) {
    throw new Error(`Unable to find elements with accept="${accept}"`);
  }
  return elements;
};

/*
 * Note: We're not attaching these methods to screen directly
 * to avoid type conflicts. Instead, we'll use standard queries with selectors
 * in our tests, like:
 *
 * screen.getByLabelText('Upload Image', { selector: 'input[type="file"]' })
 *
 * This is more in line with Testing Library best practices.
 */
