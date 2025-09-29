import { ElevenlabsService } from '../elevenlabs/elevenlabs.service';
export declare class SpeechService {
    private readonly elevenlabsService;
    private readonly logger;
    constructor(elevenlabsService: ElevenlabsService);
    generateSpeech(text: string, options?: any): Promise<Buffer>;
    transcribeAudio(audioBuffer: Buffer): Promise<{
        text: string;
        confidence: number;
    }>;
    getAvailableVoices(): Promise<any>;
}
