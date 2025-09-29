import { ConfigService } from '@nestjs/config';
export declare class ElevenlabsService {
    private configService;
    private readonly logger;
    private readonly client;
    constructor(configService: ConfigService);
    generateSpeech(text: string, options?: any): Promise<Buffer>;
    getVoices(): Promise<any>;
    private generateMockAudio;
    private getMockVoices;
}
