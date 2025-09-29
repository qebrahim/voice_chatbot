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
var LlmService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let LlmService = LlmService_1 = class LlmService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(LlmService_1.name);
        this.geminiClient = axios_1.default.create({
            baseURL: 'https://generativelanguage.googleapis.com/v1',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000,
            params: {
                key: this.configService.get('gemini.apiKey'),
            },
        });
    }
    async generateResponse(userMessage, conversation = null) {
        const messages = [
            {
                role: 'system',
                content: this.getSystemPrompt(),
            },
        ];
        if (conversation?.messages) {
            const recentMessages = conversation.messages.slice(-10);
            messages.push(...recentMessages);
        }
        messages.push({
            role: 'user',
            content: userMessage,
        });
        try {
            const model = this.configService.get('gemini.model') || 'gemini-1.5-flash';
            const historyContents = [];
            historyContents.push({ role: 'user', parts: [{ text: this.getSystemPrompt() }] });
            if (conversation?.messages) {
                const recentMessages = conversation.messages.slice(-10);
                for (const msg of recentMessages) {
                    const role = msg.role === 'assistant' ? 'model' : 'user';
                    historyContents.push({ role, parts: [{ text: msg.content }] });
                }
            }
            const userContent = { role: 'user', parts: [{ text: userMessage }] };
            const payload = {
                contents: [...historyContents, userContent],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                },
            };
            try {
                const preview = JSON.stringify({
                    model,
                    contentsCount: payload.contents.length,
                    firstContentSample: payload.contents[0]?.parts?.[0]?.text?.slice(0, 80),
                    lastContentSample: payload.contents[payload.contents.length - 1]?.parts?.[0]?.text?.slice(0, 80),
                    generationConfig: payload.generationConfig,
                }, null, 2);
                this.logger.debug(`Gemini request preview: ${preview}`);
            }
            catch { }
            const response = await this.geminiClient.post(`/models/${model}:generateContent`, payload);
            const candidate = response.data?.candidates?.[0];
            const aiResponse = candidate?.content?.parts?.[0]?.text?.trim?.() || '';
            if (!aiResponse) {
                throw new Error('Empty response from Gemini');
            }
            this.logger.log(`Generated response: ${aiResponse.substring(0, 50)}...`);
            return aiResponse;
        }
        catch (error) {
            if (error?.response) {
                const status = error.response.status;
                const apiMessage = error.response.data?.error?.message || error.response.data?.message || 'LLM request failed';
                this.logger.error(`LLM generation error (${status}): ${apiMessage}`);
                throw new Error(apiMessage);
            }
            const message = error?.message || 'LLM request failed';
            this.logger.error(`LLM generation error: ${message}`);
            throw new Error(message);
        }
    }
    getSystemPrompt() {
        return `You are a helpful voice assistant. Keep responses conversational and concise for voice interaction.`;
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = LlmService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LlmService);
//# sourceMappingURL=llm.service.js.map