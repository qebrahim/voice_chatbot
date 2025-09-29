import axios from 'axios';
import { ApiService } from '../services/apiService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function makeAxiosInstance() {
  const inst = {
    post: jest.fn(),
    get: jest.fn(),
    defaults: { baseURL: '/api', timeout: 30000, headers: { common: {} as any } },
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  } as any;
  mockedAxios.create.mockReturnValue(inst);
  return inst;
}

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock://object-url');
  });
  

  it('sendMessage posts to /chat and returns data', async () => {
    const instance = makeAxiosInstance();
    instance.post.mockResolvedValue({ data: { text: 'hi', conversationId: 'c1', timestamp: 't' } });

    const svc = new ApiService();
    const res = await svc.sendMessage({ message: 'hello' });
    expect(instance.post).toHaveBeenCalledWith('/chat', expect.any(Object));
    expect(res.text).toBe('hi');
  });

  it('generateSpeech returns object URL from blob', async () => {
    const instance = makeAxiosInstance();
    instance.post.mockResolvedValue({ data: new Blob(['abc'], { type: 'audio/mpeg' }) });

    const svc = new ApiService();
    const url = await svc.generateSpeech({ text: 'Say this' });
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(typeof url).toBe('string');
    expect(url).toBeTruthy();
    // Accept the mocked URL or a blob fallback
    expect(url === 'mock://object-url' || url.startsWith('blob:')).toBe(true);
  });

  it('getAvailableVoices returns [] on error', async () => {
    const instance = makeAxiosInstance();
    instance.get.mockRejectedValue(new Error('fail'));

    const svc = new ApiService();
    const voices = await svc.getAvailableVoices();
    expect(Array.isArray(voices)).toBe(true);
    expect(voices).toHaveLength(0);
  });

  it('setAuthHeader and removeAuthHeader modify defaults', () => {
    const instance = makeAxiosInstance();
    const svc = new ApiService();
    svc.setAuthHeader('token');
    expect(instance.defaults.headers.common['Authorization']).toContain('Bearer');
    svc.removeAuthHeader();
    expect(instance.defaults.headers.common['Authorization']).toBeUndefined();
  });
});
