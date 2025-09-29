const mockApi = {
  sendMessage: jest.fn().mockResolvedValue({
    text: 'Mocked response',
    conversationId: 'conv_mock',
    timestamp: new Date().toISOString(),
  }),
  getConversationHistory: jest.fn().mockResolvedValue({
    id: 'conv_mock',
    messages: [],
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  }),
  generateSpeech: jest.fn().mockResolvedValue('blob:mock-audio-url'),
  transcribeAudio: jest.fn().mockResolvedValue({ text: 'hi', confidence: 0.9, timestamp: new Date().toISOString() }),
  getAvailableVoices: jest.fn().mockResolvedValue([]),
  healthCheck: jest.fn().mockResolvedValue({ status: 'ok', timestamp: new Date().toISOString(), uptime: 1, memory: {}, environment: 'test' }),
  uploadAudioBlob: jest.fn().mockResolvedValue({ text: 'hi', confidence: 0.9, timestamp: new Date().toISOString() }),
  cancelAllRequests: jest.fn(),
  updateBaseURL: jest.fn(),
  setAuthHeader: jest.fn(),
  removeAuthHeader: jest.fn(),
  getConfig: jest.fn().mockReturnValue({ baseURL: '/api', timeout: 30000, headers: {} }),
};

export const ApiService = jest.fn().mockImplementation(() => mockApi);
export const apiService = mockApi;
export default mockApi;
