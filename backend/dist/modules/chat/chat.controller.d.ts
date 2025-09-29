import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { Conversation } from '../../shared/interfaces';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(chatMessageDto: ChatMessageDto): Promise<ChatResponseDto>;
    getConversationHistory(conversationId: string): Promise<Conversation | null>;
}
