import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ElevenlabsService {
  private readonly logger = new Logger(ElevenlabsService.name);
  private readonly client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('elevenlabs.apiKey');
    
    this.client = axios.create({
      baseURL: 'https://api.elevenlabs.io/v1',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async generateSpeech(text: string, options: any = {}): Promise<Buffer> {
    const apiKey = this.configService.get('elevenlabs.apiKey');
    
    if (!apiKey) {
      this.logger.warn('ElevenLabs API key not provided, returning mock audio');
      return this.generateMockAudio(text);
    }

    try {
      const {
        voiceId = this.configService.get('elevenlabs.voiceId'),
        model = 'eleven_monolingual_v1',
        voiceSettings = {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
        },
      } = options;

      const response = await this.client.post(
        `/text-to-speech/${voiceId}`,
        {
          text,
          model_id: model,
          voice_settings: voiceSettings,
        },
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'audio/mpeg',
          },
        },
      );

      this.logger.log(`Generated speech: ${text.substring(0, 50)}...`);
      return Buffer.from(response.data);
    } catch (error) {
      this.logger.error('ElevenLabs error:', error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid ElevenLabs API key');
      } else if (error.response?.status === 429) {
        throw new Error('ElevenLabs rate limit exceeded');
      }
      
      // Fallback to mock audio
      return this.generateMockAudio(text);
    }
  }

  async getVoices() {
    const apiKey = this.configService.get('elevenlabs.apiKey');
    
    if (!apiKey) {
      return this.getMockVoices();
    }

    try {
      const response = await this.client.get('/voices');
      return response.data.voices;
    } catch (error) {
      this.logger.error('Get voices error:', error);
      return this.getMockVoices();
    }
  }

  private generateMockAudio(text: string): Buffer {
    // Generate a simple mock audio buffer
    const mockAudioSize = Math.min(text.length * 100, 10000);
    return Buffer.alloc(mockAudioSize, 0);
  }

  private getMockVoices() {
    return [
      {
        voice_id: '21m00Tcm4TlvDq8ikWAM',
        name: 'Rachel',
        category: 'premade',
        labels: { accent: 'american', description: 'calm', age: 'young' },
      },
      {
        voice_id: 'AZnzlk1XvdvUeBnXmlld',
        name: 'Domi',
        category: 'premade',
        labels: { accent: 'american', description: 'strong', age: 'young' },
      },
    ];
  }
}