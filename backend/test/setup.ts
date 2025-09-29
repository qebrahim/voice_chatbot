import { Logger } from '@nestjs/common';

// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.ELEVENLABS_API_KEY = 'test-key';

  // Silence Nest Logger during tests to reduce noise
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
});

afterAll(async () => {
  // Cleanup after all tests
  jest.clearAllMocks();
});
