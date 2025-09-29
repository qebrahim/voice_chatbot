"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ElevenlabsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElevenlabsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let ElevenlabsService = ElevenlabsService_1 = class ElevenlabsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ElevenlabsService_1.name);
        const apiKey = this.configService.get('elevenlabs.apiKey');
        this.client = axios_1.default.create({
            baseURL: 'https://api.elevenlabs.io/v1',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        });
    }
    async generateSpeech(text, options = {}) {
        const apiKey = this.configService.get('elevenlabs.apiKey');
        if (!apiKey) {
            this.logger.warn('ElevenLabs API key not provided, returning mock audio');
            return this.generateMockAudio(text);
        }
        try {
            const { voiceId = this.configService.get('elevenlabs.voiceId'), model = 'eleven_monolingual_v1', voiceSettings = {
                stability: 0.5,
                similarity_boost: 0.5,
                style: 0.0,
                use_speaker_boost: true,
            }, } = options;
            const response = await this.client.post(`/text-to-speech/${voiceId}`, {
                text,
                model_id: model,
                voice_settings: voiceSettings,
            }, {
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'audio/mpeg',
                },
            });
            this.logger.log(`Generated speech: ${text.substring(0, 50)}...`);
            return Buffer.from(response.data);
        }
        catch (error) {
            this.logger.error('ElevenLabs error:', error.message);
            if (error.response?.status === 401) {
                throw new Error('Invalid ElevenLabs API key');
            }
            else if (error.response?.status === 429) {
                throw new Error('ElevenLabs rate limit exceeded');
            }
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
        }
        catch (error) {
            this.logger.error('Get voices error:', error);
            return this.getMockVoices();
        }
    }
    generateMockAudio(text) {
        const mockAudioSize = Math.min(text.length * 100, 10000);
        return Buffer.alloc(mockAudioSize, 0);
    }
    getMockVoices() {
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
};
exports.ElevenlabsService = ElevenlabsService;
exports.ElevenlabsService = ElevenlabsService = ElevenlabsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ElevenlabsService);
//# sourceMappingURL=elevenlabs.service.js.map