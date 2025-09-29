/**
 * API endpoint constants
 */
export const API_ENDPOINTS = {
  CHAT: '/chat',
  SPEECH_GENERATE: '/speech/generate',
  SPEECH_TRANSCRIBE: '/speech/transcribe',
  SPEECH_VOICES: '/speech/voices',
  HEALTH: '/health',
  CONVERSATION_HISTORY: '/chat/history',
} as const;

/**
 * Speech recognition configuration
 */
export const SPEECH_CONFIG = {
  SAMPLE_RATE: 16000,
  CHANNELS: 1,
  BITS_PER_SAMPLE: 16,
  MAX_RECORDING_TIME: 60000, // 60 seconds
  SILENCE_TIMEOUT: 3000, // 3 seconds
  MAX_TRANSCRIPT_LENGTH: 1000, // characters
  INTERIM_RESULTS: true,
  CONTINUOUS: false,
} as const;

/**
 * Application UI states
 */
export const UI_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
  ERROR: 'error',
  LOADING: 'loading',
} as const;

/**
 * Supported languages for speech recognition and synthesis
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (United Kingdom)', flag: '🇬🇧' },
  { code: 'en-AU', name: 'English (Australia)', flag: '🇦🇺' },
  { code: 'en-CA', name: 'English (Canada)', flag: '🇨🇦' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'es-MX', name: 'Spanish (Mexico)', flag: '🇲🇽' },
  { code: 'es-AR', name: 'Spanish (Argentina)', flag: '🇦🇷' },
  { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
  { code: 'fr-CA', name: 'French (Canada)', flag: '🇨🇦' },
  { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian (Italy)', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
  { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean (South Korea)', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Mandarin, China)', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional, Taiwan)', flag: '🇹🇼' },
  { code: 'ru-RU', name: 'Russian (Russia)', flag: '🇷🇺' },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
  { code: 'nl-NL', name: 'Dutch (Netherlands)', flag: '🇳🇱' },
  { code: 'sv-SE', name: 'Swedish (Sweden)', flag: '🇸🇪' },
  { code: 'da-DK', name: 'Danish (Denmark)', flag: '🇩🇰' },
  { code: 'no-NO', name: 'Norwegian (Norway)', flag: '🇳🇴' },
  { code: 'fi-FI', name: 'Finnish (Finland)', flag: '🇫🇮' },
] as const;

/**
 * Default voice configuration
 */
export const DEFAULT_VOICE_CONFIG = {
  voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel (ElevenLabs default)
  speechRate: 1.0,
  speechPitch: 1.0,
  language: 'en-US',
  volume: 1.0,
} as const;

/**
 * ElevenLabs voice settings presets
 */
export const ELEVENLABS_PRESETS = {
  STABLE: {
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true,
  },
  EXPRESSIVE: {
    stability: 0.25,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true,
  },
  CALM: {
    stability: 0.9,
    similarity_boost: 0.8,
    style: 0.1,
    use_speaker_boost: false,
  },
  DRAMATIC: {
    stability: 0.1,
    similarity_boost: 0.6,
    style: 0.8,
    use_speaker_boost: true,
  },
} as const;

/**
 * File upload constraints
 */
export const FILE_CONSTRAINTS = {
  AUDIO: {
    MAX_SIZE: 25 * 1024 * 1024, // 25MB
    ALLOWED_TYPES: [
      'audio/wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/webm',
      'audio/ogg',
      'audio/m4a',
    ],
    MAX_DURATION: 300, // 5 minutes in seconds
  },
} as const;

/**
 * Application limits
 */
export const APP_LIMITS = {
  MESSAGE_MAX_LENGTH: 1000,
  CONVERSATION_MAX_MESSAGES: 100,
  RETRY_MAX_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // milliseconds
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_LIMIT: 1000, // milliseconds
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  API_ERROR: 'Server error. Please try again later.',
  MICROPHONE_ERROR: 'Microphone access denied. Please enable microphone permissions.',
  SPEECH_RECOGNITION_ERROR: 'Speech recognition failed. Please try again.',
  TEXT_TO_SPEECH_ERROR: 'Text-to-speech failed. Please try again.',
  FILE_TOO_LARGE: 'File is too large. Maximum size allowed is 25MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an audio file.',
  TRANSCRIPTION_ERROR: 'Audio transcription failed. Please try again.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment before trying again.',
  AUTHENTICATION_ERROR: 'Authentication failed. Please check your API keys.',
  BROWSER_NOT_SUPPORTED: 'Your browser does not support this feature.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Message sent successfully!',
  AUDIO_TRANSCRIBED: 'Audio transcribed successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  VOICE_CONFIG: 'voiceChatbot_voiceConfig',
  CONVERSATION_HISTORY: 'voiceChatbot_conversations',
  USER_PREFERENCES: 'voiceChatbot_preferences',
  API_SETTINGS: 'voiceChatbot_apiSettings',
  RECENT_VOICES: 'voiceChatbot_recentVoices',
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  PULSE_DURATION: 1500,
  TYPING_SPEED: 50,
  SLIDE_DURATION: 300,
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  START_LISTENING: ' ', // Spacebar
  STOP_LISTENING: 'Escape',
  CLEAR_CHAT: 'Delete',
  TOGGLE_SETTINGS: 's',
  COPY_LAST_MESSAGE: 'c',
} as const;

/**
 * Theme configuration
 */
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    ACCENT: '#4facfe',
    SUCCESS: '#4ecdc4',
    WARNING: '#ffeaa7',
    ERROR: '#ff6b6b',
    INFO: '#74b9ff',
  },
  BREAKPOINTS: {
    MOBILE: '480px',
    TABLET: '768px',
    DESKTOP: '1024px',
    LARGE: '1200px',
  },
} as const;

/**
 * WebSocket configuration
 */
export const WEBSOCKET_CONFIG = {
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_INTERVAL: 3000, // 3 seconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  CONNECTION_TIMEOUT: 5000, // 5 seconds
} as const;

/**
 * Development flags
 */
export const DEV_FLAGS = {
  ENABLE_LOGGING: (() => {
    type Env = { DEV?: boolean; VITE_MOCK_API?: string; VITE_ENABLE_ELEVENLABS?: string };
    type G = typeof globalThis & { importMeta?: { env?: Env } };
    const g = globalThis as G;
    return g.importMeta?.env?.DEV ?? false;
  })(),
  ENABLE_DEBUG_PANEL: (() => {
    type Env = { DEV?: boolean };
    type G = typeof globalThis & { importMeta?: { env?: Env } };
    const g = globalThis as G;
    return g.importMeta?.env?.DEV ?? false;
  })(),
  MOCK_API_RESPONSES: (() => {
    type Env = { VITE_MOCK_API?: string };
    type G = typeof globalThis & { importMeta?: { env?: Env } };
    const g = globalThis as G;
    return (g.importMeta?.env?.VITE_MOCK_API ?? 'false') === 'true';
  })(),
  ENABLE_PERFORMANCE_MONITORING: (() => {
    type Env = { DEV?: boolean };
    type G = typeof globalThis & { importMeta?: { env?: Env } };
    const g = globalThis as G;
    return g.importMeta?.env?.DEV ?? false;
  })(),
} as const;

/**
 * Regular expressions for validation
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  ENABLE_SPEECH_RECOGNITION: true,
  ENABLE_TEXT_TO_SPEECH: true,
  ENABLE_ELEVENLABS: (() => {
    type Env = { VITE_ENABLE_ELEVENLABS?: string };
    type G = typeof globalThis & { importMeta?: { env?: Env } };
    const g = globalThis as G;
    return (g.importMeta?.env?.VITE_ENABLE_ELEVENLABS ?? 'true') !== 'false';
  })(),
  ENABLE_CONVERSATION_HISTORY: true,
  ENABLE_ANALYTICS: false,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_REAL_TIME_TRANSCRIPTION: true,
} as const;

/**
 * Browser compatibility information
 */
export const BROWSER_SUPPORT = {
  SPEECH_RECOGNITION: {
    CHROME: '25+',
    FIREFOX: 'Not supported',
    SAFARI: '14.1+',
    EDGE: '79+',
  },
  SPEECH_SYNTHESIS: {
    CHROME: '33+',
    FIREFOX: '49+',
    SAFARI: '7+',
    EDGE: '14+',
  },
} as const;