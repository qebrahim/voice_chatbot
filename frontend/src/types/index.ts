export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// ==========================================
// API Response Types
// ==========================================
export interface ChatResponse {
  text: string;
  conversationId: string;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

export interface ConversationHistory {
  id: string;
  messages: ConversationMessage[];
  createdAt: string;
  lastActivity: string;
}

// ==========================================
// Voice & Audio Configuration
// ==========================================
export interface VoiceConfig {
  voiceId: string;
  speechRate: number;
  speechPitch: number;
  language: string;
}

export interface VoiceSettings {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: {
    accent?: string;
    description?: string;
    age?: string;
    gender?: string;
  };
  preview_url?: string;
}

// ==========================================
// Speech Recognition Types
// ==========================================
export interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

// ==========================================
// Text-to-Speech Types
// ==========================================
export interface TextToSpeechConfig {
  voice?: SpeechSynthesisVoice;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

// ==========================================
// Component Props Types
// ==========================================
export interface VoiceControlsProps {
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

export interface ChatInterfaceProps {
  messages: Message[];
  isProcessing: boolean;
  conversationId?: string;
}

export interface ConfigPanelProps {
  config: VoiceConfig;
  onConfigChange: (config: Partial<VoiceConfig>) => void;
}

// ==========================================
// Hook Return Types
// ==========================================
export interface UseSpeechRecognitionReturn {
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

export interface UseTextToSpeechReturn {
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  isSupported: boolean;
}

// ==========================================
// Error Types
// ==========================================
export interface ApiError extends Error {
  status?: number;
  code?: string;
  response?: {
    data?: unknown;
    status: number;
    statusText: string;
  };
}

export interface VoiceError extends Error {
  type: 'speech-recognition' | 'text-to-speech' | 'microphone' | 'browser-support';
  details?: unknown;
}

// ==========================================
// Application State Types
// ==========================================
export interface AppState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  currentTranscript: string;
  messages: Message[];
  conversationId?: string;
  config: VoiceConfig;
  error?: string | null;
}

export type AppAction = 
  | { type: 'START_LISTENING' }
  | { type: 'STOP_LISTENING' }
  | { type: 'SET_TRANSCRIPT'; payload: string }
  | { type: 'START_PROCESSING' }
  | { type: 'STOP_PROCESSING' }
  | { type: 'START_SPEAKING' }
  | { type: 'STOP_SPEAKING' }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_CONVERSATION_ID'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<VoiceConfig> }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CHAT' }
  | { type: 'RESET_STATE' };

// ==========================================
// Context Types
// ==========================================
export interface ApiContextType {
  apiService: any; // Will be properly typed based on your ApiService class
}

export interface AudioContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentAudio: HTMLAudioElement | null;
  setCurrentAudio: (audio: HTMLAudioElement | null) => void;
}

// ==========================================
// Utility Types
// ==========================================
export interface Language {
  code: string;
  name: string;
}

export interface AudioValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface DeviceCapabilities {
  hasMicrophone: boolean;
  hasAudioOutput: boolean;
  supportsSpeechRecognition: boolean;
  supportsTextToSpeech: boolean;
  isSecureContext: boolean;
}

// ==========================================
// Event Handler Types
// ==========================================
export type MessageHandler = (message: Message) => void;
export type ErrorHandler = (error: Error | string) => void;
export type TranscriptHandler = (transcript: string, isFinal: boolean) => void;
export type ConfigChangeHandler = (config: Partial<VoiceConfig>) => void;

// ==========================================
// Audio Recording Types
// ==========================================
export interface AudioRecordingConfig {
  sampleRate?: number;
  channels?: number;
  bitsPerSample?: number;
  maxDuration?: number;
  format?: 'wav' | 'mp3' | 'webm';
}

export interface AudioRecordingResult {
  audioBlob: Blob;
  duration: number;
  size: number;
  mimeType: string;
}

// ==========================================
// Browser Support Types
// ==========================================
export interface BrowserSupport {
  speechRecognition: boolean;
  speechSynthesis: boolean;
  mediaRecorder: boolean;
  webAudio: boolean;
  getUserMedia: boolean;
}

// ==========================================
// Analytics Types (for future use)
// ==========================================
export interface AnalyticsEvent {
  type: 'voice_interaction' | 'error' | 'config_change' | 'conversation_start';
  data: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
}

// ==========================================
// Performance Monitoring Types
// ==========================================
export interface PerformanceMetrics {
  speechRecognitionLatency?: number;
  apiResponseTime?: number;
  textToSpeechLatency?: number;
  totalInteractionTime?: number;
}

// ==========================================
// Feature Flags Types
// ==========================================
export interface FeatureFlags {
  enableSpeechRecognition: boolean;
  enableTextToSpeech: boolean;
  enableElevenLabs: boolean;
  enableAnalytics: boolean;
  debugMode: boolean;
}

// ==========================================
// Environment Configuration Types
// ==========================================
export interface EnvironmentConfig {
  apiUrl: string;
  enableDevTools: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  features: FeatureFlags;
}

// ==========================================
// WebSocket Types (for real-time features)
// ==========================================
export interface WebSocketMessage {
  type: 'transcript' | 'response' | 'error' | 'status';
  data: any;
  timestamp: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts: number;
  reconnectInterval: number;
  heartbeatInterval: number;
}

// ==========================================
// Type Guards
// ==========================================
export function isApiError(error: any): error is ApiError {
  return error && typeof error.status === 'number';
}

export function isVoiceError(error: any): error is VoiceError {
  return error && typeof error.type === 'string' && 
    ['speech-recognition', 'text-to-speech', 'microphone', 'browser-support'].includes(error.type);
}

export function isMessage(obj: any): obj is Message {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.text === 'string' &&
    ['user', 'ai'].includes(obj.sender) &&
    obj.timestamp instanceof Date;
}

// ==========================================
// Branded Types for Type Safety
// ==========================================
export type MessageId = string & { readonly brand: unique symbol };
export type ConversationId = string & { readonly brand: unique symbol };
export type VoiceId = string & { readonly brand: unique symbol };

// Helper functions to create branded types
export const createMessageId = (id: string): MessageId => id as MessageId;
export const createConversationId = (id: string): ConversationId => id as ConversationId;
export const createVoiceId = (id: string): VoiceId => id as VoiceId;