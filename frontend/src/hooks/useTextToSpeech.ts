import { useState, useCallback, useRef } from 'react';
import { VoiceConfig } from '../types';
import { useAudio } from '../contexts/AudioContext';

interface UseTextToSpeechReturn {
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  isSupported: boolean;
}

export const useTextToSpeech = (config: VoiceConfig): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { setIsPlaying, setCurrentAudio } = useAudio();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = 'speechSynthesis' in window;

  const speak = useCallback(async (text: string): Promise<void> => {
    if (!isSupported) {
      console.warn('Text-to-speech not supported');
      return;
    }

    return new Promise((resolve, reject) => {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Find the selected voice
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.voiceURI === config.voiceId);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = config.speechRate;
      utterance.pitch = config.speechPitch;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPlaying(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPlaying(false);
        setCurrentAudio(null);
        utteranceRef.current = null;
        resolve();
      };

      utterance.onerror = (error) => {
        setIsSpeaking(false);
        setIsPlaying(false);
        setCurrentAudio(null);
        utteranceRef.current = null;
        reject(error);
      };

      speechSynthesis.speak(utterance);
    });
  }, [config, isSupported, setIsPlaying, setCurrentAudio]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPlaying(false);
    setCurrentAudio(null);
    utteranceRef.current = null;
  }, [setIsPlaying, setCurrentAudio]);

  return {
    speak,
    isSpeaking,
    stopSpeaking,
    isSupported
  };
};