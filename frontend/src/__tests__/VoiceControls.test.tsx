import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoiceControls from '../components/VoiceControls';

describe('VoiceControls', () => {
  const baseProps = {
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isSupported: true,
    currentTranscript: '',
    onStartListening: jest.fn(),
    onStopListening: jest.fn(),
    onStopSpeaking: jest.fn(),
    onClearChat: jest.fn(),
  };

  it('shows Start Listening when not listening', async () => {
    render(<VoiceControls {...baseProps} />);
    expect(screen.getByRole('button', { name: /start listening/i })).toBeInTheDocument();
  });

  it('disables start when processing or unsupported', async () => {
    const { rerender } = render(<VoiceControls {...baseProps} isProcessing />);
    expect(screen.getByRole('button', { name: /start listening/i })).toBeDisabled();

    rerender(<VoiceControls {...baseProps} isSupported={false} />);
    expect(screen.getByRole('button', { name: /start listening/i })).toBeDisabled();
  });

  it('calls onStartListening and onClearChat', async () => {
    const user = userEvent.setup();
    render(<VoiceControls {...baseProps} />);

    await user.click(screen.getByRole('button', { name: /start listening/i }));
    expect(baseProps.onStartListening).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /clear chat/i }));
    expect(baseProps.onClearChat).toHaveBeenCalled();
  });

  it('shows Stop Listening when listening', async () => {
    render(<VoiceControls {...baseProps} isListening />);
    expect(screen.getByRole('button', { name: /stop listening/i })).toBeInTheDocument();
  });
});
