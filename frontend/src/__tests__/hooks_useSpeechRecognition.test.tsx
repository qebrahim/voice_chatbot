import React, { FC } from 'react';
import { render, screen, act } from '@testing-library/react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const HookProbe: FC<{ lang?: string }> = ({ lang = 'en-US' }) => {
  const { isListening, transcript, startListening, stopListening, browserSupportsSpeechRecognition } = useSpeechRecognition({ language: lang });
  return (
    <div>
      <div data-testid="supported">{String(browserSupportsSpeechRecognition)}</div>
      <div data-testid="listening">{String(isListening)}</div>
      <div data-testid="transcript">{transcript}</div>
      <button onClick={startListening}>start</button>
      <button onClick={stopListening}>stop</button>
    </div>
  );
};

describe('useSpeechRecognition', () => {
  it('starts and stops listening and processes results', async () => {
    render(<HookProbe />);

    // Grab the created mock recognition instance (use last, in case multiple were constructed)
    const ctor = ((window as any).SpeechRecognition as unknown as jest.Mock);
    expect(ctor).toHaveBeenCalled();
    const results = ctor.mock.results;
    const instance = (results[results.length - 1]?.value || ctor.mock.instances[ctor.mock.instances.length - 1]) as any;

    // Initially not listening

    // Start listening
    await act(async () => {
      screen.getByText('start').click();
      // trigger onstart
      if (instance && typeof instance.onstart === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        instance.onstart({} as any);
      }
    });

    expect(screen.getByTestId('listening').textContent).toBe('true');

    // Simulate an interim + final result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockEvent: any = {
      resultIndex: 0,
      results: [
        { 0: { transcript: 'Hello', confidence: 0.9 }, isFinal: false },
        { 0: { transcript: ' world', confidence: 0.9 }, isFinal: true },
      ],
    };

    await act(async () => {
      if (instance && typeof instance.onresult === 'function') {
        instance.onresult(mockEvent);
      }
    });
    expect(screen.getByTestId('transcript').textContent).toContain('world');

    // Stop listening
    await act(async () => {
      screen.getByText('stop').click();
      if (instance && typeof instance.onend === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        instance.onend?.({} as any);
      }
    });

    expect(screen.getByTestId('listening').textContent).toBe('false');
  });
});
