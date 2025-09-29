import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiProvider } from '../contexts/ApiContext';
import { AudioProvider } from '../contexts/AudioContext';

// Use the __mocks__ for apiService
jest.mock('../services/apiService');
// Mock hooks to avoid browser API side effects
jest.mock('../hooks/useSpeechRecognition', () => ({
  __esModule: true,
  useSpeechRecognition: jest.fn(() => ({
    isListening: false,
    isSupported: true,
    transcript: '',
    interimTranscript: '',
    finalTranscript: '',
    startListening: jest.fn(),
    stopListening: jest.fn(),
    resetTranscript: jest.fn(),
    browserSupportsSpeechRecognition: true,
  })),
}));
// Import after mocks to ensure they take effect
import VoiceAssistant from '../components/VoiceAssistant';
import * as TTS from '../hooks/useTextToSpeech';
import * as SR from '../hooks/useSpeechRecognition';

describe('VoiceAssistant', () => {
  function renderWithProviders() {
    return render(
      <ApiProvider>
        <AudioProvider>
          <VoiceAssistant />
        </AudioProvider>
      </ApiProvider>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(SR, 'useSpeechRecognition').mockReturnValue({
      isListening: false,
      isSupported: true,
      transcript: '',
      startListening: jest.fn(),
      stopListening: jest.fn(),
      resetTranscript: jest.fn(),
      browserSupportsSpeechRecognition: true,
    } as any);
  });

  it('renders header and initial message', () => {
    jest.spyOn(TTS, 'useTextToSpeech').mockReturnValue({
      speak: jest.fn(async () => {}),
      isSpeaking: false,
      stopSpeaking: jest.fn(),
      isSupported: true,
    });
    renderWithProviders();
    expect(screen.getByText(/Voice AI Assistant/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Hi! I'm your voice-enabled AI assistant/i)
    ).toBeInTheDocument();
  });

  it('renders controls and allows clear chat', async () => {
    const user = userEvent.setup();
    jest.spyOn(TTS, 'useTextToSpeech').mockReturnValue({
      speak: jest.fn(async () => {}),
      isSpeaking: false,
      stopSpeaking: jest.fn(),
      isSupported: true,
    });
    renderWithProviders();
    expect(screen.getByRole('button', { name: /start listening/i })).toBeInTheDocument();
    const clearBtn = screen.getByRole('button', { name: /clear chat/i });
    await user.click(clearBtn);
    expect(clearBtn).toBeInTheDocument();
  });

  it('shows status bar text', () => {
    jest.spyOn(TTS, 'useTextToSpeech').mockReturnValue({
      speak: jest.fn(async () => {}),
      isSpeaking: false,
      stopSpeaking: jest.fn(),
      isSupported: true,
    });
    renderWithProviders();
    expect(screen.getByText(/Ready to listen/i)).toBeInTheDocument();
  });
});
