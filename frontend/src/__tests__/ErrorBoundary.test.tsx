import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

const Bomb: React.FC = () => {
  // Throw during render
  throw new Error('boom');
  // istanbul ignore next
  return <div />;
};

describe('ErrorBoundary', () => {
  it('catches errors and renders fallback UI', () => {
    // Silence expected error log from React during error boundaries
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});
