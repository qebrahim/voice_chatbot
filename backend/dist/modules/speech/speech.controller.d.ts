import { Response } from 'express';
import { SpeechService } from './speech.service';
import { TextToSpeechDto } from './dto/text-to-speech.dto';
export declare class SpeechController {
    private readonly speechService;
    constructor(speechService: SpeechService);
    generateSpeech(textToSpeechDto: TextToSpeechDto, res: Response): Promise<void>;
    transcribeAudio(file: Express.Multer.File): Promise<{
        text: string;
        confidence: number;
    }>;
    getVoices(): Promise<any>;
}
