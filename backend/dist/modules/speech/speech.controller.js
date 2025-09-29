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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpeechController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const speech_service_1 = require("./speech.service");
const text_to_speech_dto_1 = require("./dto/text-to-speech.dto");
let SpeechController = class SpeechController {
    constructor(speechService) {
        this.speechService = speechService;
    }
    async generateSpeech(textToSpeechDto, res) {
        const audioBuffer = await this.speechService.generateSpeech(textToSpeechDto.text, textToSpeechDto);
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length.toString(),
            'Cache-Control': 'public, max-age=3600',
        });
        res.send(audioBuffer);
    }
    async transcribeAudio(file) {
        return this.speechService.transcribeAudio(file.buffer);
    }
    async getVoices() {
        return this.speechService.getAvailableVoices();
    }
};
exports.SpeechController = SpeechController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Generate speech from text' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [text_to_speech_dto_1.TextToSpeechDto, Object]),
    __metadata("design:returntype", Promise)
], SpeechController.prototype, "generateSpeech", null);
__decorate([
    (0, common_1.Post)('transcribe'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audio')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Transcribe audio to text' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpeechController.prototype, "transcribeAudio", null);
__decorate([
    (0, common_1.Get)('voices'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available voices' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpeechController.prototype, "getVoices", null);
exports.SpeechController = SpeechController = __decorate([
    (0, swagger_1.ApiTags)('speech'),
    (0, common_1.Controller)('speech'),
    __metadata("design:paramtypes", [speech_service_1.SpeechService])
], SpeechController);
//# sourceMappingURL=speech.controller.js.map