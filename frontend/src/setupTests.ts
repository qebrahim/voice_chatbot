import '@testing-library/jest-dom';

// Mock window.speechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    speak: jest.fn((utterance: any) => {
      // Simulate async speech start/end
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        utterance.onstart && utterance.onstart({} as any);
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          utterance.onend && utterance.onend({} as any);
        }, 0);
      }, 0);
    }),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn(() => []),
    onvoiceschanged: null,
  },
});

// Indicate test environment for modules that need to avoid side effects
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__TEST__ = true;

// jsdom doesn't implement scrollIntoView; polyfill to avoid errors
// eslint-disable-next-line @typescript-eslint/no-empty-function
if (!Element.prototype.scrollIntoView) {
  // @ts-ignore
  Element.prototype.scrollIntoView = jest.fn();
}

// Mock SpeechRecognition
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: jest.fn(() => ({
    continuous: false,
    interimResults: false,
    lang: 'en-US',
    start: jest.fn(),
    stop: jest.fn(),
    abort: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    onstart: null,
    onend: null,
    onresult: null,
    onerror: null,
  })),
});

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: window.SpeechRecognition,
});

// Mock SpeechSynthesisUtterance constructor
// Lightweight SpeechSynthesisUtterance mock without DOM typings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MockUtterance(this: any, text: string) {
  this.text = text;
  this.pitch = 1;
  this.rate = 1;
  this.volume = 1;
  this.voice = null;
  this.lang = 'en-US';
  this.onboundary = null;
  this.onend = null;
  this.onerror = null;
  this.onmark = null;
  this.onpause = null;
  this.onresume = null;
  this.onstart = null;
}
// @ts-ignore
(globalThis as any).SpeechSynthesisUtterance = MockUtterance as any;

// Mock MediaDevices
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn(() => Promise.resolve({
      getTracks: () => [],
    })),
  },
});

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(() => 'mock-object-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
});

// Polyfill import.meta.env for Vite-style environment variables in Jest
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const existingImportMeta: any = (globalThis as any).importMeta || {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envPolyfill: any = { DEV: false, VITE_API_URL: '/api' };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).importMeta = { env: { ...envPolyfill, ...(existingImportMeta.env || {}) } };