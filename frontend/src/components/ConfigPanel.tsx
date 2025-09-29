import React, { useState, useEffect } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceConfig } from '../types';
import { SUPPORTED_LANGUAGES } from '../utils/constants';

interface ConfigPanelProps {
  config: VoiceConfig;
  onConfigChange: (config: Partial<VoiceConfig>) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleConfigChange = <K extends keyof VoiceConfig>(key: K, value: VoiceConfig[K]) => {
    onConfigChange({ [key]: value } as Pick<VoiceConfig, K>);
  };

  return (
    <div className="config-panel">
      <button
        className="config-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings size={20} />
        <span>Voice Settings</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="config-content">
          <div className="config-grid">
            <div className="config-group">
              <label htmlFor="voice-select">Voice:</label>
              <select
                id="voice-select"
                value={config.voiceId}
                onChange={(e) => handleConfigChange('voiceId', e.target.value)}
              >
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label htmlFor="language-select">Language:</label>
              <select
                id="language-select"
                value={config.language}
                onChange={(e) => handleConfigChange('language', e.target.value)}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="config-group">
              <label htmlFor="speech-rate">
                Speech Rate: {config.speechRate.toFixed(1)}
              </label>
              <input
                id="speech-rate"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={config.speechRate}
                onChange={(e) => handleConfigChange('speechRate', parseFloat(e.target.value))}
              />
            </div>

            <div className="config-group">
              <label htmlFor="speech-pitch">
                Speech Pitch: {config.speechPitch.toFixed(1)}
              </label>
              <input
                id="speech-pitch"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.speechPitch}
                onChange={(e) => handleConfigChange('speechPitch', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;