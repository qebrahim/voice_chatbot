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
var SpeechService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechService = void 0;
const common_1 = require("@nestjs/common");
const elevenlabs_service_1 = require("../elevenlabs/elevenlabs.service");
let SpeechService = SpeechService_1 = class SpeechService {
    constructor(elevenlabsService) {
        this.elevenlabsService = elevenlabsService;
        this.logger = new common_1.Logger(SpeechService_1.name);
    }
    async generateSpeech(text, options = {}) {
        this.logger.log(`Generating speech for: ${text.substring(0, 50)}...`);
        return this.elevenlabsService.generateSpeech(text, options);
    }
    async transcribeAudio(audioBuffer) {
        this.logger.log('Transcribing audio...');
        return { text: 'Transcription not implemented yet', confidence: 0 };
    }
    async getAvailableVoices() {
        return this.elevenlabsService.getVoices();
    }
};
exports.SpeechService = SpeechService;
exports.SpeechService = SpeechService = SpeechService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elevenlabs_service_1.ElevenlabsService])
], SpeechService);
//# sourceMappingURL=speech.service.js.map