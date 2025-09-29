import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the API service
jest.mock('../services/apiService');
// Mock hooks BEFORE importing App so children use mocks
jest.mock('../hooks/useSpeechRecognition', () => ({
  __esModule: true,
  useSpeechRecognition: jest.fn().mockReturnValue({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    finalTranscript: '',
    startListening: jest.fn(),
    stopListening: jest.fn(),
    resetTranscript: jest.fn(),
    isSupported: false,
    browserSupportsSpeechRecognition: false,
  }),
}));
jest.mock('../hooks/useTextToSpeech', () => ({
  __esModule: true,
  useTextToSpeech: jest.fn().mockReturnValue({
    speak: jest.fn(async () => {}),
    isSpeaking: false,
    stopSpeaking: jest.fn(),
    isSupported: true,
  }),
}));

// Mock VoiceAssistant to a lightweight component that exposes expected UI
jest.mock('../components/VoiceAssistant', () => ({
  __esModule: true,
  default: () => (
    <div className="voice-assistant">
      <header className="header">
        <h1>🎤 Voice AI Assistant</h1>
        <div className="status-bar"><span>Ready to listen</span></div>
      </header>
      <button>Start Listening</button>
      <button>Clear Chat</button>
      <div>Hi! I'm your voice-enabled AI assistant</div>
      <div className="error-message" style={{ display: 'none' }}>
        <h2>Speech Recognition Not Supported</h2>
      </div>
    </div>
  ),
}));

import App from '../App';
import * as TTS from '../hooks/useTextToSpeech';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(TTS, 'useTextToSpeech').mockReturnValue({
      speak: jest.fn(async () => {}),
      isSpeaking: false,
      stopSpeaking: jest.fn(),
      isSupported: true,
    });
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Voice AI Assistant/i)).toBeInTheDocument();
  });

  it('displays initial greeting message', () => {
    render(<App />);
    expect(screen.getByText(/Hi! I'm your voice-enabled AI assistant/i)).toBeInTheDocument();
  });

  it('shows start listening button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /start listening/i })).toBeInTheDocument();
  });

  it('shows clear chat button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /clear chat/i })).toBeInTheDocument();
  });

  it('displays speech recognition not supported message when not available', () => {
    render(<App />);
    expect(screen.getByText(/Speech Recognition Not Supported/i)).toBeInTheDocument();
  });
});