import React, { FC } from 'react';
import { render, screen, act } from '@testing-library/react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { AudioProvider } from '../contexts/AudioContext';
import { VoiceConfig } from '../types';

const cfg: VoiceConfig = {
  voiceId: 'voice-1',
  speechRate: 1,
  speechPitch: 1,
  language: 'en-US',
};

const HookProbe: FC = () => {
  const { speak, isSpeaking, stopSpeaking, isSupported } = useTextToSpeech(cfg);
  return (
    <div>
      <div data-testid="supported">{String(isSupported)}</div>
      <div data-testid="speaking">{String(isSpeaking)}</div>
      <button onClick={() => speak('Hello world')}>speak</button>
      <button onClick={stopSpeaking}>stop</button>
    </div>
  );
};

describe('useTextToSpeech', () => {
  beforeEach(() => {
    (window.speechSynthesis.getVoices as jest.Mock).mockReturnValue([
      { voiceURI: 'voice-1', name: 'Voice One', lang: 'en-US' } as any,
    ]);
  });

  it('speaks and updates state accordingly', async () => {
    render(
      <AudioProvider>
        <HookProbe />
      </AudioProvider>
    );

    expect(screen.getByTestId('supported').textContent).toBe('true');
    expect(screen.getByTestId('speaking').textContent).toBe('false');

    await act(async () => {
      screen.getByText('speak').click();
    });

    // onstart should have been called by tts mock when speak was invoked
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('can stop speaking', async () => {
    render(
      <AudioProvider>
        <HookProbe />
      </AudioProvider>
    );

    await act(async () => {
      screen.getByText('stop').click();
    });

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
  });
});
