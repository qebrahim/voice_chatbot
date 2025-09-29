import React from 'react';
import { Mic, MicOff, Trash2, VolumeX } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  currentTranscript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onClearChat: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  isSupported,
  currentTranscript,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onClearChat
}) => {
  const isDisabled = isProcessing || !isSupported;

  return (
    <div className="voice-controls">
      <div className="control-buttons">
        <button
          className={`voice-btn primary ${isListening ? 'recording' : ''}`}
          onClick={isListening ? onStopListening : onStartListening}
          disabled={isDisabled || isSpeaking}
          title={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>

        {isSpeaking && (
          <button
            className="voice-btn secondary"
            onClick={onStopSpeaking}
            title="Stop speaking"
          >
            <VolumeX size={20} />
            Stop Speaking
          </button>
        )}

        <button
          className="voice-btn secondary"
          onClick={onClearChat}
          disabled={isListening || isProcessing}
          title="Clear conversation"
        >
          <Trash2 size={20} />
          Clear Chat
        </button>
      </div>

      {/* Live transcript display */}
      {currentTranscript && (
        <div className="live-transcript">
          <div className="transcript-label">Listening...</div>
          <div className="transcript-text">"{currentTranscript}"</div>
        </div>
      )}

      {/* Activity indicators */}
      {(isProcessing || isSpeaking || isListening) && (
        <div className="activity-indicator">
          <div className="spinner" />
          <span>
            {isListening ? 'Listening for your voice...' :
             isProcessing ? 'Processing your request...' :
             isSpeaking ? 'Speaking response...' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceControls;