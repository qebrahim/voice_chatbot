import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ConversationService } from '../conversation/conversation.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { Conversation } from '../../shared/interfaces';

@Injectable()
export class ChatService {
  // Make sure this line has 'export'
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly conversationService: ConversationService,
  ) {}

  async processMessage(
    chatMessageDto: ChatMessageDto,
  ): Promise<ChatResponseDto> {
    const { message, conversationId } = chatMessageDto;

    this.logger.log(`Processing message: ${message.substring(0, 50)}...`);

    try {
      // Get or create conversation
      const conversation =
        await this.conversationService.getOrCreateConversation(conversationId);

      // Add user message
      await this.conversationService.addMessage(conversation.id, {
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Generate AI response
      const aiResponse = await this.llmService.generateResponse(
        message,
        conversation,
      );

      // Add AI message
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
    } catch (error) {
      this.logger.error('Error processing message:', error);
      throw error;
    }
  }

  async getConversationHistory(
    conversationId: string,
  ): Promise<Conversation | null> {
    const conversation =
      await this.conversationService.getConversation(conversationId);

    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found`,
      );
    }

    return conversation;
  }
}
