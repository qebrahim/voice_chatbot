import React from 'react';
import { render, screen } from '@testing-library/react';
import { AudioProvider, useAudio } from '../contexts/AudioContext';

const Probe: React.FC = () => {
  const { isPlaying, setIsPlaying } = useAudio();
  return (
    <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'playing' : 'stopped'}</button>
  );
};

describe('AudioContext', () => {
  it('provides isPlaying state', async () => {
    render(
      <AudioProvider>
        <Probe />
      </AudioProvider>
    );

    expect(screen.getByRole('button', { name: /stopped/i })).toBeInTheDocument();
  });
});
