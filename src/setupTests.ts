
import '@testing-library/jest-dom';

// Mock contentEditable behavior for testing
Object.defineProperty(HTMLElement.prototype, 'contentEditable', {
  configurable: true,
  get: function() { return this.getAttribute('contentEditable'); },
  set: function(value) { this.setAttribute('contentEditable', value); }
});

// Mock execCommand method for tests
document.execCommand = jest.fn();

// Setup custom query for testing file inputs by accept attribute
import { configure, screen } from '@testing-library/react';

configure({
  getElementError: (message, container) => {
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    return error;
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
  
  // Extend Testing Library's Screen interface
  namespace Testing {
    interface Queries {
      queryByAcceptText: (accept: string) => HTMLInputElement | null;
      queryAllByAcceptText: (accept: string) => HTMLInputElement[];
      getByAcceptText: (accept: string) => HTMLInputElement;
      getAllByAcceptText: (accept: string) => HTMLInputElement[];
    }
  }
}

// Extend the screen object with our custom methods
declare module '@testing-library/react' {
  interface Screen extends Testing.Queries {}
}

// Add custom queries
const queryByAcceptText = (container: HTMLElement, accept: string) => {
  return Array.from(container.querySelectorAll('input[type="file"]')).find(
    input => input.getAttribute('accept') === accept
  ) as HTMLInputElement | null;
};

const queryAllByAcceptText = (container: HTMLElement, accept: string) => {
  return Array.from(container.querySelectorAll('input[type="file"]')).filter(
    input => input.getAttribute('accept') === accept
  ) as HTMLInputElement[];
};

const getByAcceptText = (container: HTMLElement, accept: string) => {
  const element = queryByAcceptText(container, accept);
  if (!element) {
    throw new Error(`Unable to find an element with accept="${accept}"`);
  }
  return element;
};

const getAllByAcceptText = (container: HTMLElement, accept: string) => {
  const elements = queryAllByAcceptText(container, accept);
  if (!elements.length) {
    throw new Error(`Unable to find elements with accept="${accept}"`);
  }
  return elements;
};

// Extend screen with custom queries
screen.queryByAcceptText = (accept: string) => queryByAcceptText(document.body, accept);
screen.queryAllByAcceptText = (accept: string) => queryAllByAcceptText(document.body, accept);
screen.getByAcceptText = (accept: string) => getByAcceptText(document.body, accept);
screen.getAllByAcceptText = (accept: string) => getAllByAcceptText(document.body, accept);
