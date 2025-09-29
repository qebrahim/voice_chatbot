"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConversationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let ConversationService = ConversationService_1 = class ConversationService {
    constructor() {
        this.logger = new common_1.Logger(ConversationService_1.name);
        this.conversations = new Map();
    }
    async getOrCreateConversation(conversationId) {
        if (conversationId && this.conversations.has(conversationId)) {
            const conversation = this.conversations.get(conversationId);
            conversation.lastActivity = new Date();
            return conversation;
        }
        const newConversation = {
            id: conversationId || (0, uuid_1.v4)(),
            messages: [],
            createdAt: new Date(),
            lastActivity: new Date(),
        };
        this.conversations.set(newConversation.id, newConversation);
        this.logger.log(`Created conversation: ${newConversation.id}`);
        return newConversation;
    }
    async getConversation(conversationId) {
        return this.conversations.get(conversationId) || null;
    }
    async addMessage(conversationId, message) {
        const conversation = this.conversations.get(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        const newMessage = {
            id: (0, uuid_1.v4)(),
            ...message,
            timestamp: message.timestamp || new Date(),
        };
        conversation.messages.push(newMessage);
        conversation.lastActivity = new Date();
        this.logger.log(`Added message to conversation ${conversationId}: ${message.role}`);
        return newMessage;
    }
    async deleteConversation(conversationId) {
        const deleted = this.conversations.delete(conversationId);
        if (deleted) {
            this.logger.log(`Deleted conversation: ${conversationId}`);
        }
        return deleted;
    }
    cleanupOldConversations(maxAgeHours = 24) {
        const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
        let cleanedCount = 0;
        for (const [id, conversation] of this.conversations.entries()) {
            if (conversation.lastActivity < cutoffTime) {
                this.conversations.delete(id);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            this.logger.log(`Cleaned up ${cleanedCount} old conversations`);
        }
        return cleanedCount;
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = ConversationService_1 = __decorate([
    (0, common_1.Injectable)()
], ConversationService);
//# sourceMappingURL=conversation.service.js.map