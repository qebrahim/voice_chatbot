import { Injectable, Logger } from '@nestjs/common';
import { ElevenlabsService } from '../elevenlabs/elevenlabs.service';

@Injectable()
export class SpeechService {
  private readonly logger = new Logger(SpeechService.name);

  constructor(private readonly elevenlabsService: ElevenlabsService) {}

  async generateSpeech(text: string, options: any = {}): Promise<Buffer> {
    this.logger.log(`Generating speech for: ${text.substring(0, 50)}...`);
    return this.elevenlabsService.generateSpeech(text, options);
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<{ text: string; confidence: number }> {
    this.logger.log('Transcribing audio...');
    // Implement Whisper integration here
    return { text: 'Transcription not implemented yet', confidence: 0 };
  }

  async getAvailableVoices() {
    return this.elevenlabsService.getVoices();
  }
}