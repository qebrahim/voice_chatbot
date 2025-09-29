import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { Conversation } from '../../shared/interfaces';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Send a chat message' })
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async sendMessage(@Body() chatMessageDto: ChatMessageDto): Promise<ChatResponseDto> {
    return this.chatService.processMessage(chatMessageDto);
  }

  @Get('history/:conversationId')
  @ApiOperation({ summary: 'Get conversation history' })
  @ApiResponse({ status: 200, description: 'Conversation history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversationHistory(@Param('conversationId') conversationId: string): Promise<Conversation | null> {
    return this.chatService.getConversationHistory(conversationId);
  }
}