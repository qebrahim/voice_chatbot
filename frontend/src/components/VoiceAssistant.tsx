import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from './ChatInterface';
import VoiceControls from './VoiceControls';
import ConfigPanel from './ConfigPanel';
import ErrorBoundary from './ErrorBoundary';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useApi } from '../contexts/ApiContext';
import { Message, VoiceConfig } from '../types';
import { generateMessageId } from '../utils/helpers';

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateMessageId(),
      text: "Hi! I'm your voice-enabled AI assistant. Click the microphone to start talking!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [config, setConfig] = useState<VoiceConfig>({
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    speechRate: 1,
    speechPitch: 1,
    language: 'en-US'
  });
  const [error, setError] = useState<string | null>(null);

  const { apiService } = useApi();
  const { speak, isSpeaking, stopSpeaking } = useTextToSpeech(config);
  
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    language: config.language
  });

  // Handle speech result
  const handleSpeechResult = useCallback(async (finalTranscript: string) => {
    if (!finalTranscript.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(),
      text: finalTranscript,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null);

    try {
      const response = await apiService.sendMessage({
        message: finalTranscript,
        conversationId
      });

      const aiMessage: Message = {
        id: generateMessageId(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(response.timestamp)
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationId(response.conversationId);

      // Generate speech for AI response
      await speak(response.text);

    } catch (error) {
      console.error('Error processing message:', error);
      setError(error instanceof Error ? error.message : 'Failed to process message');
      
      const errorMessage: Message = {
        id: generateMessageId(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  }, [apiService, conversationId, speak, resetTranscript]);

  // Listen for final transcript changes
  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      handleSpeechResult(transcript);
    }
  }, [transcript, isListening, isProcessing, handleSpeechResult]);

  const handleStartListening = () => {
    setError(null);
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
  };

  const clearChat = () => {
    setMessages([{
      id: generateMessageId(),
      text: "Hi! I'm your voice-enabled AI assistant. Click the microphone to start talking!",
      sender: 'ai',
      timestamp: new Date()
    }]);
    setConversationId(undefined);
    setError(null);
  };

  const updateConfig = (newConfig: Partial<VoiceConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-assistant">
        <div className="container">
          <div className="error-message">
            <h2>Speech Recognition Not Supported</h2>
            <p>Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="voice-assistant">
        <div className="container">
          <header className="header">
            <h1>🎤 Voice AI Assistant</h1>
            <div className="status-bar">
              <span className={`status ${
                isListening ? 'listening' : 
                isProcessing ? 'processing' : 
                isSpeaking ? 'speaking' :
                error ? 'error' : ''
              }`}>
                {error ? `Error: ${error}` :
                 isListening ? 'Listening... Speak now!' :
                 isProcessing ? 'Processing your request...' :
                 isSpeaking ? 'Speaking...' :
                 'Ready to listen'}
              </span>
            </div>
          </header>

          <VoiceControls
            isListening={isListening}
            isProcessing={isProcessing}
            isSpeaking={isSpeaking}
            isSupported={isSupported}
            currentTranscript={transcript}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            onStopSpeaking={stopSpeaking}
            onClearChat={clearChat}
          />

          <ChatInterface 
            messages={messages} 
            isProcessing={isProcessing}
            conversationId={conversationId}
          />

          <ConfigPanel
            config={config}
            onConfigChange={updateConfig}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default VoiceAssistant;