import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);
  private readonly conversations = new Map<string, Conversation>();

  async getOrCreateConversation(conversationId?: string): Promise<Conversation> {
    if (conversationId && this.conversations.has(conversationId)) {
      const conversation = this.conversations.get(conversationId);
      conversation.lastActivity = new Date();
      return conversation;
    }

    const newConversation: Conversation = {
      id: conversationId || uuidv4(),
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.conversations.set(newConversation.id, newConversation);
    this.logger.log(`Created conversation: ${newConversation.id}`);
    
    return newConversation;
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    return this.conversations.get(conversationId) || null;
  }

  async addMessage(conversationId: string, message: Omit<Message, 'id'>): Promise<Message> {
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const newMessage: Message = {
      id: uuidv4(),
      ...message,
      timestamp: message.timestamp || new Date(),
    };

    conversation.messages.push(newMessage);
    conversation.lastActivity = new Date();

    this.logger.log(`Added message to conversation ${conversationId}: ${message.role}`);
    return newMessage;
  }

  async deleteConversation(conversationId: string): Promise<boolean> {
    const deleted = this.conversations.delete(conversationId);
    if (deleted) {
      this.logger.log(`Deleted conversation: ${conversationId}`);
    }
    return deleted;
  }

  // Cleanup old conversations (call periodically)
  cleanupOldConversations(maxAgeHours: number = 24): number {
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
}