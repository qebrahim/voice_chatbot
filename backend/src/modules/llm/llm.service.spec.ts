import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LlmService } from './llm.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LlmService', () => {
  let service: LlmService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        'gemini.apiKey': 'test-gemini-key',
        'gemini.model': 'gemini-1.5-flash',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LlmService>(LlmService);
    configService = module.get<ConfigService>(ConfigService);

    // Setup axios mock
    mockedAxios.create.mockReturnValue({
      post: jest.fn(),
      get: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateResponse', () => {
    it('should generate a response successfully', async () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [{ text: 'Hello! How can I help you today?' }],
              },
            },
          ],
        },
      };

      const mockAxiosInstance = {
        post: jest.fn().mockResolvedValue(mockResponse),
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      // Re-instantiate service to use mocked axios
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LlmService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      const testService = module.get<LlmService>(LlmService);
      const result = await testService.generateResponse('Hello');

      expect(result).toBe('Hello! How can I help you today?');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/models/gemini-1.5-flash:generateContent',
        expect.objectContaining({
          contents: expect.arrayContaining([
            expect.objectContaining({ role: 'user', parts: expect.any(Array) }),
          ]),
          generationConfig: expect.objectContaining({
            temperature: 0.7,
            maxOutputTokens: 1000,
          }),
        }),
      );
    });

    it('should handle API errors', async () => {
      const mockAxiosInstance = {
        post: jest.fn().mockRejectedValue(new Error('API Error')),
      };

      mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          LlmService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      const testService = module.get<LlmService>(LlmService);

      await expect(testService.generateResponse('Hello')).rejects.toThrow(
        'API Error',
      );
    });
  });
});
