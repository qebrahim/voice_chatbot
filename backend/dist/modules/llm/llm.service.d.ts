import { ConfigService } from '@nestjs/config';
export declare class LlmService {
    private configService;
    private readonly logger;
    private readonly geminiClient;
    constructor(configService: ConfigService);
    generateResponse(userMessage: string, conversation?: any): Promise<string>;
    private getSystemPrompt;
}
