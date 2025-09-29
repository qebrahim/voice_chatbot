import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  browserSupportsSpeechRecognition: boolean;
}

export const useSpeechRecognition = (
  options: SpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const {
    continuous = false,
    interimResults = true,
    language = 'en-US'
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const browserSupportsSpeechRecognition = 
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  const isSupported = browserSupportsSpeechRecognition;

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      return;
    }
    recognitionRef.current = new SpeechRecognitionCtor();

    const recognition = recognitionRef.current;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart;
        } else {
          interim += transcriptPart;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setFinalTranscript(final);
        setTranscript(final);
      } else {
        setTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        // Some test mocks may not implement abort
        const maybeAbort = (recognition as unknown as { abort?: () => void }).abort;
        if (typeof maybeAbort === 'function') {
          maybeAbort.call(recognition);
        }
      }
    };
  }, [continuous, interimResults, language, isSupported]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      resetTranscript();
      const maybeStart = (recognitionRef.current as unknown as { start?: () => void }).start;
      if (typeof maybeStart === 'function') {
        maybeStart.call(recognitionRef.current);
      }
    }
  }, [isListening, resetTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      const maybeStop = (recognitionRef.current as unknown as { stop?: () => void }).stop;
      if (typeof maybeStop === 'function') {
        maybeStop.call(recognitionRef.current);
      }
    }
  }, [isListening]);

  

  return {
    isListening,
    transcript,
    interimTranscript,
    finalTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    browserSupportsSpeechRecognition
  };
};