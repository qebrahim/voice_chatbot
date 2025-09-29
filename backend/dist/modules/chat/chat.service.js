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
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const llm_service_1 = require("../llm/llm.service");
const conversation_service_1 = require("../conversation/conversation.service");
let ChatService = ChatService_1 = class ChatService {
    constructor(llmService, conversationService) {
        this.llmService = llmService;
        this.conversationService = conversationService;
        this.logger = new common_1.Logger(ChatService_1.name);
    }
    async processMessage(chatMessageDto) {
        const { message, conversationId } = chatMessageDto;
        this.logger.log(`Processing message: ${message.substring(0, 50)}...`);
        try {
            const conversation = await this.conversationService.getOrCreateConversation(conversationId);
            await this.conversationService.addMessage(conversation.id, {
                role: 'user',
                content: message,
                timestamp: new Date(),
            });
            const aiResponse = await this.llmService.generateResponse(message, conversation);
            await this.conversationService.addMessage(conversation.id, {
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
            });
            return {
                text: aiResponse,
                conversationId: conversation.id,
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error processing message:', error);
            throw error;
        }
    }
    async getConversationHistory(conversationId) {
        const conversation = await this.conversationService.getConversation(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException(`Conversation with ID ${conversationId} not found`);
        }
        return conversation;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [llm_service_1.LlmService,
        conversation_service_1.ConversationService])
], ChatService);
//# sourceMappingURL=chat.service.js.map