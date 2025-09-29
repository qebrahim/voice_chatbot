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

// Mark test environment without using `any`
type TestGlobalFlag = { __TEST__?: boolean };
(globalThis as unknown as TestGlobalFlag).__TEST__ = true;

// jsdom doesn't implement scrollIntoView; polyfill to avoid errors
if (!Element.prototype.scrollIntoView) {
  (Element.prototype as unknown as { scrollIntoView: (arg?: unknown) => void }).scrollIntoView = jest.fn();
}

// Mock SpeechRecognition
Object.defineProperty(window, 'SpeechRecognition', {
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
function MockUtterance(this: { [k: string]: unknown }, text: string) {
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
// Assign mock constructor to global without `any`
type SpeechSynthesisUtteranceCtor = new (text: string) => unknown;
(globalThis as unknown as { SpeechSynthesisUtterance: SpeechSynthesisUtteranceCtor }).SpeechSynthesisUtterance =
  MockUtterance as unknown as SpeechSynthesisUtteranceCtor;

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