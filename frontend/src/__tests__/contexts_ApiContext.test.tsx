import React from 'react';
import { render } from '@testing-library/react';
import { ApiProvider, useApi } from '../contexts/ApiContext';

const Probe: React.FC = () => {
  const { apiService } = useApi();
  // access a method to ensure context provided
  if (!apiService || typeof apiService.getConfig !== 'function') {
    throw new Error('Api not provided');
  }
  return <div>ok</div>;
};

describe('ApiContext', () => {
  it('provides apiService instance', () => {
    const { getByText } = render(
      <ApiProvider>
        <Probe />
      </ApiProvider>
    );
    expect(getByText('ok')).toBeInTheDocument();
  });
});
