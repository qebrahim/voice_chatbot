// Global test setup
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.GEMINI_API_KEY = 'test-key';
  process.env.ELEVENLABS_API_KEY = 'test-key';
});

afterAll(async () => {
  // Cleanup after all tests
  jest.clearAllMocks();
});
